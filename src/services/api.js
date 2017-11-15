//API Request Settings

export const url = `https://swapi.co/api/people/`;

export function initHeaders() {
	return {
		method: 'GET',
		cache: 'default',
		accept: 'application/json'
	}
}

export function requestURL(requestedURL) {
	return new Promise( function (resolve, reject) {
		_requestURL(requestedURL)
			.then((res) =>  resolve(res))
			.catch((err) => reject(err));
	});
}

export function requestURLs(requested_URLs) {
	return requested_URLs.map( (requested_URL) => requestURL(requested_URL));
}

async function _requestURL (requested_URL) {
	try {

		let response = await fetch(requested_URL, initHeaders());
		const resp_json = await response.json();
		return resp_json;

	} catch (error) {
		return error;
	}
}
