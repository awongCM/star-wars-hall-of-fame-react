/**
 * Image Service
 * 
 * Provides utilities for loading Star Wars images for all SWAPI resource types.
 * 
 * Image Organization:
 * - /public/images/characters/{id}.jpg - Character portraits
 * - /public/images/planets/{id}.jpg - Planet images
 * - /public/images/films/{id}.jpg - Movie posters
 * - /public/images/starships/{id}.jpg - Starship images
 * 
 * Usage:
 * import { getImageUrl } from './services/images';
 * const imageUrl = getImageUrl('people', 0); // Luke Skywalker
 */

/**
 * Get image URL for a SWAPI resource
 * 
 * @param {string} resourceType - Resource type (people, planets, films, starships)
 * @param {number} id - 0-based ID (as used in app routing)
 * @returns {string} Image URL or fallback placeholder
 */
export function getImageUrl(resourceType, id) {
  // Convert 0-based ID to 1-based for file naming
  const fileId = parseInt(id, 10) + 1;
  
  const resourceMap = {
    people: 'characters',
    planets: 'planets',
    films: 'films',
    starships: 'starships',
  };
  
  const folder = resourceMap[resourceType] || 'characters';
  return `/images/${folder}/${fileId}.jpg`;
}

/**
 * Get fallback image for missing resources
 * 
 * @param {string} resourceType - Resource type
 * @returns {string} Fallback image URL
 */
export function getFallbackImage(resourceType) {
  const fallbacks = {
    people: '/images/characters/placeholder.jpg',
    planets: '/images/planets/placeholder.jpg',
    films: '/images/films/placeholder.jpg',
    starships: '/images/starships/placeholder.jpg',
  };
  
  return fallbacks[resourceType] || '/images/placeholder.jpg';
}

/**
 * Check if image exists and load it
 * 
 * @param {string} imageUrl - Image URL to check
 * @returns {Promise<boolean>} True if image loads successfully
 */
export function checkImageExists(imageUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
}

/**
 * Get image URL with fallback handling
 * 
 * @param {string} resourceType - Resource type
 * @param {number} id - Resource ID
 * @returns {Promise<string>} Image URL (original or fallback)
 */
export async function getImageUrlWithFallback(resourceType, id) {
  const primaryUrl = getImageUrl(resourceType, id);
  const exists = await checkImageExists(primaryUrl);
  
  if (exists) {
    return primaryUrl;
  }
  
  return getFallbackImage(resourceType);
}

/**
 * Preload multiple images
 * 
 * @param {Array<{resourceType: string, id: number}>} items - Items to preload
 * @returns {Promise<void>}
 */
export function preloadImages(items) {
  const promises = items.map(({ resourceType, id }) => {
    const url = getImageUrl(resourceType, id);
    return checkImageExists(url);
  });
  
  return Promise.all(promises);
}
