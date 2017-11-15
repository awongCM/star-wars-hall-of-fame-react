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
	  _requestURL(requestedURL, function (err, res, body) {
		  if (err) {return reject(err);}
		  return resolve(res);
	  });
	});
}

export function requestURLs(requested_URLs) {
	return requested_URLs.map( (requested_URL) => {
		return new Promise( (resolve, reject) => {
			_requestURL(requested_URL, (err, res, body) => {
				if (err) return reject(err);
				return resolve(res);
			});
		});
	});
}

function _requestURL(requested_URL, callback) {
	fetch(requested_URL, initHeaders()).then( (response) =>{
		callback(null, response.json(), response.body);
	}).catch( (error)=>{
		callback(error, null, null);
	});
}
