//API Request Settings

export const peopleURL = "https://swapi.dev/api/people/",
  defaultURL = peopleURL,
  planetsURL = "https://swapi.dev/api/planets/",
  filmsURL = "https://swapi.dev/api/films/",
  starshipsURL = "https://swapi.dev/api/starships/";

export function initHeaders() {
  return {
    method: "GET",
    cache: "default",
    accept: "application/json",
  };
}

export function requestURL(requested_URL) {
  return new Promise(function (resolve, reject) {
    _requestURL(requested_URL)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

export function requestURLs(requested_URLs) {
  return Promise.all(
    requested_URLs.map((requested_URL) => requestURL(requested_URL))
  );
}

async function _requestURL(requested_URL) {
  try {
    let response = await fetch(requested_URL, initHeaders());
    const resp_json = await response.json();
    return resp_json;
  } catch (error) {
    return error;
  }
}

export function fetchURLBy(queryType) {
  let url = "";
  switch (queryType) {
    case "planets":
      url = planetsURL;
      break;

    case "films":
      url = filmsURL;
      break;

    case "starships":
      url = starshipsURL;
      break;
    default:
      url = defaultURL;
  }
  console.log("url", url);

  return url;
}
