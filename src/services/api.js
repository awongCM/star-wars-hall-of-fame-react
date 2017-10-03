//API Request Settings

export const url = `https://swapi.co/api/people/`;

export function initHeaders() {
    return {
        method: 'GET',
        cache: 'default',
        accept: 'application/json'
    }
}

//TODO---

export function requestAsync(requestedURL) {
    return new Promise( function (resolve, reject) {
       requestURL(requestedURL, function (err, res, body) {
           if (err) {return reject(err);}
           return resolve(res);
       });
    });
}

function requestURL(requestedURL, callback) {
    fetch(requestedURL, initHeaders()).then( (response) =>{
        callback(null, response.json(), response.body)
    }).catch( (error)=>{
        callback(error, null, null);
    })
}
