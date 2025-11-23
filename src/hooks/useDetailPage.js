import { useState, useEffect, useCallback } from "react";
import * as localStorageService from "../services/localStorage";

/**
 * Custom hook for managing detail page data fetching, comments, and localStorage persistence
 * 
 * @param {Object} config - Configuration object
 * @param {string} config.resourceType - SWAPI resource type (people, planets, films, starships)
 * @param {string} config.id - Resource ID from route params
 * @param {string} config.pathname - Location pathname for localStorage key
 * @param {string} config.dataKey - Key name for storing data (e.g., 'characterData', 'filmData')
 * @param {string} config.commentsKey - Key name for storing comments (e.g., 'characterComments', 'filmComments')
 * @returns {Object} - State and methods for detail page
 */
const useDetailPage = ({ resourceType, id, pathname, dataKey = 'data', commentsKey = 'comments' }) => {
  const [detailPage, setDetailPage] = useState({
    [dataKey]: {},
    [commentsKey]: [],
  });

  const loadPersistedClientData = useCallback(() => {
    console.log("loadClientData", localStorageService.loadClientData(pathname));
    return localStorageService.loadClientData(pathname);
  }, [pathname]);

  const refineData = useCallback((parsedData) => {
    parsedData.comments = [];
    return parsedData;
  }, []);

  const fetchData = useCallback(() => {
    // SWAPI uses 1-based indexing
    let param_index = parseInt(id, 10) + 1;

    // Explicitly pass query params with format=json
    fetch(`https://swapi.dev/api/${resourceType}/${param_index}?format=json`)
      .then((response) => response.json())
      .then((myJSON) => refineData(myJSON))
      .then((refinedData) => {
        setDetailPage((prevState) => ({ 
          ...prevState, 
          [dataKey]: refinedData 
        }));
        console.log(refinedData);
      })
      .catch((error) => {
        console.error(`Error fetching ${resourceType}:`, error);
      });
  }, [id, resourceType, dataKey, refineData]);

  // Load data on mount
  useEffect(() => {
    const availableClientData = loadPersistedClientData();

    if (availableClientData !== undefined) {
      setDetailPage({
        [dataKey]: availableClientData[dataKey],
        [commentsKey]: availableClientData[commentsKey],
      });
    } else {
      // Fetch from API if no cached data
      fetchData();
    }
  }, [loadPersistedClientData, fetchData, dataKey, commentsKey]);

  // Persist data to localStorage whenever it changes
  const persistsClientData = useCallback(() => {
    const mergedData = {
      [dataKey]: detailPage[dataKey],
      [commentsKey]: detailPage[commentsKey],
    };

    localStorageService.saveClientData(pathname, mergedData);
  }, [pathname, detailPage, dataKey, commentsKey]);

  useEffect(() => {
    persistsClientData();
  }, [persistsClientData]);

  // Save a new comment
  const saveComment = useCallback((comment) => {
    if (comment === "") {
      return;
    }

    const currentComments = detailPage[commentsKey] || [];
    const newComments = [...currentComments, comment];

    setDetailPage((prevState) => ({ 
      ...prevState, 
      [commentsKey]: newComments 
    }));
  }, [detailPage, commentsKey]);

  return {
    data: detailPage[dataKey],
    comments: detailPage[commentsKey],
    saveComment,
  };
};

export default useDetailPage;
