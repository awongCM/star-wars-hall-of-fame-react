import React from "react";
import { Link } from "react-router";
import * as stringUtil from "../../util/stringUtil";
import * as SWAPI from "../../services/api";

/**
 * TEACHING NOTE - Render Props Pattern:
 * 
 * This component uses a flexible approach to render different trivia types.
 * Instead of having separate components for each type, we:
 * 1. Accept a 'resourceType' prop to know what kind of data we're showing
 * 2. Use conditional rendering to display the right information
 * 3. Extract IDs from SWAPI URLs dynamically
 * 
 * Benefits:
 * - Single component handles all trivia types (DRY principle)
 * - Easy to add new trivia types
 * - Consistent styling across all trivia displays
 */

const TriviaDisplay = ({ resourceType, triviaData }) => {
  /**
   * TEACHING NOTE - Conditional Rendering Strategy:
   * 
   * We use a switch statement to determine what to render.
   * Each case returns JSX specific to that resource type.
   * 
   * Alternative approaches:
   * 1. Object lookup: { people: <PeopleTrivia />, ... }[resourceType]
   * 2. Component mapping: const Component = triviaComponents[resourceType]
   * 3. Separate components: <PeopleTrivia />, <PlanetsTrivia />, etc.
   * 
   * We chose switch for clarity and ease of understanding.
   */
  switch (resourceType) {
    case "people":
      return <PeopleTrivia triviaData={triviaData} />;
    case "planets":
      return <PlanetsTrivia triviaData={triviaData} />;
    case "films":
      return <FilmsTrivia triviaData={triviaData} />;
    case "starships":
      return <StarshipsTrivia triviaData={triviaData} />;
    default:
      return null;
  }
};

/**
 * TEACHING NOTE - Component Composition:
 * 
 * Below are specialized trivia components for each resource type.
 * Each knows how to display its specific data structure.
 * 
 * This is called "component composition" - building complex UIs
 * from smaller, focused components.
 */

const PeopleTrivia = ({ triviaData }) => {
  // Guard clause: Return early if triviaData is undefined or null
  if (!triviaData) return null;
  
  const { homePlanet, films = [] } = triviaData;

  // Show nothing if we have neither homePlanet nor films
  if (!homePlanet && films.length === 0) return null;

  const planetId = homePlanet ? extractIdFromUrl(homePlanet.url, SWAPI.planetsURL) : null;
  const filmsList = films.map((film) => ({
    ...film,
    id: extractIdFromUrl(film.url, SWAPI.filmsURL),
  }));

  return (
    <div className="triviaContent">
      {homePlanet && (
        <div className="planetLink">
          <span>Planet of Origin</span>
          <br />
          <Link to={`/planet/${planetId}`} key={planetId}>
            {homePlanet.name}
          </Link>
        </div>
      )}
      {filmsList.length > 0 && (
        <div className="filmsList">
          <span>Films played in</span>
          <br />
          <ul>
            {filmsList.map((film) => (
              <li key={film.id}>
                <Link to={`/film/${film.id}`}>{film.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const PlanetsTrivia = ({ triviaData }) => {
  // Guard clause: Return early if triviaData is undefined or null
  if (!triviaData) return null;
  
  const { residents = [], films = [] } = triviaData;

  // If both arrays are empty, don't render anything
  if (residents.length === 0 && films.length === 0) return null;

  const residentsList = residents.slice(0, 5).map((resident) => ({
    ...resident,
    id: extractIdFromUrl(resident.url, SWAPI.peopleURL),
  }));

  const filmsList = films.slice(0, 5).map((film) => ({
    ...film,
    id: extractIdFromUrl(film.url, SWAPI.filmsURL),
  }));

  return (
    <div className="triviaContent">
      {residentsList.length > 0 && (
        <div className="residentsList">
          <span>Notable Residents</span>
          <br />
          <ul>
            {residentsList.map((resident) => (
              <li key={resident.id}>
                <Link to={`/people/${resident.id}`}>{resident.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {filmsList.length > 0 && (
        <div className="filmsList">
          <span>Featured in Films</span>
          <br />
          <ul>
            {filmsList.map((film) => (
              <li key={film.id}>
                <Link to={`/film/${film.id}`}>{film.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const FilmsTrivia = ({ triviaData }) => {
  console.log('[FilmsTrivia] Received triviaData:', triviaData);
  
  // Guard clause: Return early if triviaData is undefined or null
  if (!triviaData) {
    console.log('[FilmsTrivia] triviaData is null/undefined, returning null');
    return null;
  }
  
  const { characters = [], planets = [], starships = [] } = triviaData;
  console.log('[FilmsTrivia] Extracted:', { 
    charactersLength: characters.length, 
    planetsLength: planets.length, 
    starshipsLength: starships.length 
  });

  // If all arrays are empty, don't render anything
  if (characters.length === 0 && planets.length === 0 && starships.length === 0) {
    console.log('[FilmsTrivia] All arrays empty, returning null');
    return null;
  }

  /**
   * TEACHING NOTE - Array.slice() for Performance:
   * 
   * Films can have MANY related items (characters, planets, starships).
   * We use .slice(0, 5) to limit display to first 5 items.
   * 
   * Why?
   * 1. Performance - Less DOM elements to render
   * 2. UX - Too many items overwhelm users
   * 3. Layout - Keeps card sizes consistent
   * 
   * DEFENSIVE PROGRAMMING:
   * We default to empty arrays in destructuring, so .slice() won't fail
   */
  const charactersList = characters.slice(0, 5).map((character) => ({
    ...character,
    id: extractIdFromUrl(character.url, SWAPI.peopleURL),
  }));

  const planetsList = planets.slice(0, 5).map((planet) => ({
    ...planet,
    id: extractIdFromUrl(planet.url, SWAPI.planetsURL),
  }));

  const starshipsList = starships.slice(0, 5).map((starship) => ({
    ...starship,
    id: extractIdFromUrl(starship.url, SWAPI.starshipsURL),
  }));

  return (
    <div className="triviaContent">
      {charactersList.length > 0 && (
        <div className="charactersList">
          <span>Main Characters</span>
          <br />
          <ul>
            {charactersList.map((character) => (
              <li key={character.id}>
                <Link to={`/people/${character.id}`}>{character.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {planetsList.length > 0 && (
        <div className="planetsList">
          <span>Planets</span>
          <br />
          <ul>
            {planetsList.map((planet) => (
              <li key={planet.id}>
                <Link to={`/planet/${planet.id}`}>{planet.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {starshipsList.length > 0 && (
        <div className="starshipsList">
          <span>Starships</span>
          <br />
          <ul>
            {starshipsList.map((starship) => (
              <li key={starship.id}>
                <Link to={`/starship/${starship.id}`}>{starship.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const StarshipsTrivia = ({ triviaData }) => {
  // Guard clause: Return early if triviaData is undefined or null
  if (!triviaData) return null;
  
  const { pilots = [], films = [] } = triviaData;

  // If both arrays are empty, don't render anything
  if (pilots.length === 0 && films.length === 0) return null;

  const pilotsList = pilots.slice(0, 5).map((pilot) => ({
    ...pilot,
    id: extractIdFromUrl(pilot.url, SWAPI.peopleURL),
  }));

  const filmsList = films.slice(0, 5).map((film) => ({
    ...film,
    id: extractIdFromUrl(film.url, SWAPI.filmsURL),
  }));

  return (
    <div className="triviaContent">
      {pilotsList.length > 0 && (
        <div className="pilotsList">
          <span>Known Pilots</span>
          <br />
          <ul>
            {pilotsList.map((pilot) => (
              <li key={pilot.id}>
                <Link to={`/people/${pilot.id}`}>{pilot.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {filmsList.length > 0 && (
        <div className="filmsList">
          <span>Appeared in Films</span>
          <br />
          <ul>
            {filmsList.map((film) => (
              <li key={film.id}>
                <Link to={`/film/${film.id}`}>{film.title}</Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/**
 * TEACHING NOTE - Helper Function for ID Extraction:
 * 
 * SWAPI URLs look like: "https://swapi.dev/api/people/1/"
 * We need to extract the "1" and convert it to 0-based index (0).
 * 
 * Why a helper function?
 * - Used in multiple places
 * - Complex logic deserves its own function
 * - Easier to test in isolation
 * - Self-documenting code (function name explains what it does)
 * 
 * DEFENSIVE PROGRAMMING:
 * Returns 0 as fallback if URL is invalid/missing. This prevents crashes
 * when SWAPI data has incomplete URL fields.
 */
function extractIdFromUrl(url, baseUrl) {
  // Guard clause: Return fallback if parameters are invalid
  if (!url || !baseUrl) {
    console.warn('extractIdFromUrl: Invalid parameters', { url, baseUrl });
    return 0; // Fallback to first item
  }

  const idSuffix = stringUtil.fetchIDSuffix(url, baseUrl);
  const id = stringUtil.trimSpecialChars(idSuffix);
  
  // Guard clause: Return fallback if extraction failed
  if (!id) {
    console.warn('extractIdFromUrl: Could not extract ID from URL', { url, baseUrl });
    return 0;
  }
  
  // Convert from 1-based (SWAPI) to 0-based (our app)
  const parsedId = parseInt(id, 10);
  
  // Guard clause: Return fallback if parsing failed
  if (isNaN(parsedId)) {
    console.warn('extractIdFromUrl: Could not parse ID', { id, url });
    return 0;
  }
  
  return parsedId - 1;
}

export default TriviaDisplay;
