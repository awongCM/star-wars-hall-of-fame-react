// StringUtil Object

export function fetchIDSuffix(url_string_with_id, baseURL) {
  let diff = url_string_with_id.length - baseURL.length;

  let id_suffix = url_string_with_id.substring(url_string_with_id.length - diff);

  return id_suffix;
}

export function trimSpecialChars(input_str) {
  return input_str.replace(/[^\w\s]/gi, '');
}

