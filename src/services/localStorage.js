//LocalStorage Service Object

export function loadClientData(key) {
  try {
    const serializedClientData = localStorage.getItem(key);
    if (serializedClientData === null) {
      return undefined;
    }
    return JSON.parse(serializedClientData);
  } catch (error) {
    return undefined;
  }
}

export function saveClientData(key, data) {
  try {
    const serializedClientData = JSON.stringify(data);

    localStorage.setItem(key, serializedClientData);

    return true;

  } catch (error) {
    return false;
  }
}
