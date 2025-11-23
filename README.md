# Star Wars Hall of Fame React

## Table of Contents

### Front End Tech Stack

- React JS
- React Router
- CSS3 - written using SMACSS
- HTML5
- ES6 Classes
- Native Promises
- Emojis used
- Star Wars API - `https://swapi.co/`

### Features

1. You can upvote/downvote your favourite Star Wars character.
2. You can write or add comments to your favourite Star Wars character as you click on their profile link. You can clear up your browser's cookies session to reset their comment fields if you want like, as there's a backend implementation to store them.

### Instructions to build and deploy

No build configuration such Webpack or Babel is required. You can just do the following
can just do the following.

1. Download the zipped file.
2. Run `npm install`
3. Run `npm start`
4. The `http://localhost:9090` will load up in the browser.

### Demo

[logo]: /public/Star_Wars_Hall_of_Fame_App_version1.png

![alt text][logo]

**[Demo Link](https://star-wars-hall-of-fame-react.onrender.com/)**

### History

Version 1.0

- Only Star Wars `people` data API endpoint is catered for.
- Pagination functionality catered for `people` endpoints
- Since implementing pagination functionality above, navigating other character profile detail on following pages are not working correctly as SWAPI hasn't yet provided `id` property for any of its resource.

### TODOS

- ~~Add route/link to characters' planets/movies/trivia link content pages~~
  ~~- Add pagination components for characters/planets/movies etc~~
- ~~Make data saving capabilities to be persistent~~
- ~~Handle multi asynchronous requests logic~~
- ~~To decide whether I should use JSX instead of js moving forth~~
- Provide MongoDB service for hosting star wars images
- ~~Refactored class-based components to make use of hooks~~
