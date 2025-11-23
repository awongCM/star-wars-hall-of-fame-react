// StringUtil Object

export function fetchIDSuffix(url_string_with_id, baseURL) {
  // Defensive check: ensure both parameters are valid strings
  if (!url_string_with_id || typeof url_string_with_id !== 'string') {
    console.warn('[stringUtil] Invalid url_string_with_id:', url_string_with_id);
    return '';
  }
  
  if (!baseURL || typeof baseURL !== 'string') {
    console.warn('[stringUtil] Invalid baseURL:', baseURL);
    return '';
  }

  let diff = url_string_with_id.length - baseURL.length;

  let id_suffix = url_string_with_id.substring(url_string_with_id.length - diff);

  return id_suffix;
}

export function trimSpecialChars(input_str) {
  // Defensive check: ensure input is a valid string
  if (!input_str || typeof input_str !== 'string') {
    console.warn('[stringUtil] Invalid input_str:', input_str);
    return '';
  }
  
  return input_str.replace(/[^\w\s]/gi, '');
}

