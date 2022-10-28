# Getting Started with Shopping list

The project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)
The app runs in browser and make use of:

- IndexedDB API;
- Web Speech API (speech recognition);
- Web Storage API;
- Service Worker API (cache interface);
- React context API;
- React i18next framework;
- React Router library v.6

## App features:

- is installable;
- works offline;
- client side data storage;
- convert voice to text ;
- translation in 5 langauges : English, French, Italian, Romanian and Spanish;

## App structure

The project files are divided as follow:

- index.js is the entry point off the app
- App.js set up the routing and load the page components
- App.css holds the app css styles
- indexedDbManager.js a class that manage database transactions
- /page/ folder holds the page components
- /locales/ folder holds the translation .json files
- /hooks/ hold the custom react hooks
- /helpers/ folder contains js utility functions
- /context/ folder contains the app context provider that manage the component states
- /config/ folder holds internationalization configuration files
- /components/ folder hold the app micro components

## INSTALLATION GUIDE

To install all the packages run the following command in the project directory

### `npm install`

and the following command to run the nodejs hosting the app:

### `npm start`

This command will open the frontend at the url http://localhost:3000

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
