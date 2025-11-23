import { useState, useEffect, useRef } from "react";
import * as SWAPI from "../services/api";
import * as localStorageService from "../services/localStorage";

/**
 * Custom hook for fetching and caching trivia data for different SWAPI resource types
 * 
 * TEACHING NOTE - Custom Hooks:
 * This hook extracts the complex async logic for fetching related resources (trivia).
 * Benefits:
 * 1. Reusability - Can be used by any component that needs trivia data
 * 2. Separation of Concerns - Data fetching logic is separate from UI logic
 * 3. Testability - Easier to test data fetching in isolation
 * 4. Maintainability - One place to update trivia fetching logic
 * 
 * @param {Object} config - Configuration object
 * @param {string} config.itemId - The item's ID
 * @param {string} config.pathname - Location pathname for localStorage key
 * @param {Object} config.itemData - The item's data (person, planet, film, starship)
 * @param {string} config.resourceType - Type of resource (people, planets, films, starships)
 * @returns {Object} - Trivia data and loading state
 */
const useTrivia = ({ itemId, pathname, itemData, resourceType }) => {
  const [triviaState, setTriviaState] = useState({
    triviaData: {},
    loaded: false,
  });
  
  const isMountedRef = useRef(true);

  useEffect(() => {
    /**
     * TEACHING NOTE - Async Data Fetching Pattern:
     * 
     * Why this pattern?
     * 1. Check localStorage first (cache) - faster, reduces API calls
     * 2. If not found, fetch from API
     * 3. Save to localStorage for next time
     * 
     * This is called "cache-first" strategy
     * 
     * We use isMountedRef to prevent setState on unmounted components
     */
    isMountedRef.current = true;
    
    const fetchTrivia = () => {
      // Create a cache key that includes resourceType to avoid conflicts
      const cacheKey = `${pathname}_${resourceType}`;
      
      // Try to load from localStorage first (synchronous)
      const cachedData = localStorageService.loadClientData(cacheKey);
      
      if (cachedData !== undefined && Array.isArray(cachedData)) {
        const itemTrivia = cachedData.find((item) => item.item_id === itemId);
        
        if (itemTrivia) {
          setTriviaState({
            triviaData: itemTrivia.triviaData,
            loaded: true,
          });
          return; // Exit early - we have our data!
        }
      }
      
      // Fetch from API asynchronously
      fetchTriviaFromAPI();
    };
    
    const fetchTriviaFromAPI = async () => {
      /**
       * TEACHING NOTE - Dynamic Trivia by Resource Type:
       * 
       * Different resources have different related data:
       * - People: homeworld (planet) + films
       * - Planets: residents (people) + films
       * - Films: characters (people) + planets + starships
       * - Starships: pilots (people) + films
       * 
       * We use a strategy pattern here - behavior changes based on resource type
       */
      let triviaData = {};

      try {
        switch (resourceType) {
          case "people":
            triviaData = await fetchPeopleTrivia(itemData);
            break;
          case "planets":
            triviaData = await fetchPlanetsTrivia(itemData);
            break;
          case "films":
            triviaData = await fetchFilmsTrivia(itemData);
            break;
          case "starships":
            triviaData = await fetchStarshipsTrivia(itemData);
            break;
          default:
            console.warn(`[useTrivia] Unknown resource type: ${resourceType}`);
        }

        // Save to localStorage with resourceType in key to avoid conflicts
        const cacheKey = `${pathname}_${resourceType}`;
        let cachedArray = localStorageService.loadClientData(cacheKey);
        if (cachedArray === undefined) {
          cachedArray = [];
        }

        cachedArray.push({
          item_id: itemId,
          triviaData: triviaData,
        });

        localStorageService.saveClientData(cacheKey, cachedArray);
        
        if (isMountedRef.current) {
          setTriviaState({
            triviaData,
            loaded: true, // Mark as loaded immediately
          });
        }
      } catch (error) {
        console.error(`[useTrivia] Error fetching trivia for ${resourceType}:`, error);
        // Even on error, mark as loaded to prevent infinite loading
        if (isMountedRef.current) {
          setTriviaState({
            triviaData: {},
            loaded: true,
          });
        }
      }
    };

    if (itemData && Object.keys(itemData).length > 0) {
      fetchTrivia();
    } else {
      // If no itemData, mark as loaded with empty data to prevent infinite loading
      if (isMountedRef.current) {
        setTriviaState({
          triviaData: {},
          loaded: true,
        });
      }
    }
    
    return () => {
      isMountedRef.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, pathname, resourceType]);

  return triviaState;
};

/**
 * TEACHING NOTE - Helper Functions:
 * 
 * These helper functions are specific implementations for each resource type.
 * They're defined outside the hook to keep the hook logic clean and readable.
 * 
 * Each function knows what related data to fetch for its resource type.
 */

async function fetchPeopleTrivia(personData) {
  const homePlanetURL = personData.homeworld;
  const filmURLs = personData.films || [];

  const [homePlanet, films] = await Promise.all([
    SWAPI.requestURL(homePlanetURL),
    SWAPI.requestURLs(filmURLs),
  ]);

  return { homePlanet, films };
}

async function fetchPlanetsTrivia(planetData) {
  const residentURLs = planetData.residents || [];
  const filmURLs = planetData.films || [];

  const [residents, films] = await Promise.all([
    SWAPI.requestURLs(residentURLs),
    SWAPI.requestURLs(filmURLs),
  ]);

  return { residents, films };
}

async function fetchFilmsTrivia(filmData) {
  const characterURLs = filmData.characters || [];
  const planetURLs = filmData.planets || [];
  const starshipURLs = filmData.starships || [];

  const [characters, planets, starships] = await Promise.all([
    SWAPI.requestURLs(characterURLs),
    SWAPI.requestURLs(planetURLs),
    SWAPI.requestURLs(starshipURLs),
  ]);

  return { characters, planets, starships };
}

async function fetchStarshipsTrivia(starshipData) {
  const pilotURLs = starshipData.pilots || [];
  const filmURLs = starshipData.films || [];

  const [pilots, films] = await Promise.all([
    SWAPI.requestURLs(pilotURLs),
    SWAPI.requestURLs(filmURLs),
  ]);

  return { pilots, films };
}

export default useTrivia;
