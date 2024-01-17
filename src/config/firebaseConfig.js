import firebase from 'firebase'
// import config from './firebaseConfig.json';

const firebaseConfig = {
  // apiKey: config.apiKey,
  // authDomain: config.authDomain,
  // projectId: config.projectId,
  // storageBucket: config.storageBucket,
  // messagingSenderId: config.messagingSenderId,
  // appId: config.appId,
  // measurementId: config.measurementId,
  apiKey: 'AIzaSyBFWr4sws_7I6tcOxuMTx6dm-sZoj-76FE',
  authDomain: 'dhwani-tv.firebaseapp.com',
  databaseURL: 'https://dhwani-tv-default-rtdb.firebaseio.com',
  projectId: 'dhwani-tv',
  storageBucket: 'dhwani-tv.appspot.com',
  messagingSenderId: '499044335537',
  appId: '1:499044335537:web:4aab8c4fccedc465868790',
  measurementId: 'G-V7LV0GLR5W'
}

const firebaseAppConfig = firebase.initializeApp(firebaseConfig)
export default firebaseAppConfig
