// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyASNXStoAZTfWq8ZTSNAgdf3R5J95ajM6s",
  authDomain: "piedpiper-login.firebaseapp.com",
  projectId: "piedpiper-login",
  storageBucket: "piedpiper-login.appspot.com",
  messagingSenderId: "1085053761292",
  appId: "1:1085053761292:web:56f65d340697b56132bb29",
  measurementId: "G-7X2TWQX0HD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

export {app,auth};
// const analytics = getAnalytics(app);