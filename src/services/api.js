//API Request Settings

export const url = `https://swapi.co/api/people/`;

export function initHeaders() {
    return {
        method: 'GET',
        cache: 'default',
        accept: 'application/json'
    }
}


