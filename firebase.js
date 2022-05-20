// Import the functions you need from the SDKs you need
// v9 compat packages are API compatible with v8 code
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// import { initializeApp } from "firebase/app"
// import { getAuth } from "firebase/auth"
// import { getFirestore } from "firebase/firestore"
// import { getStorage } from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCkFYZ5zh154rlav8Mt1dgchAXhL7EaiRc",
  authDomain: "clinician-pharmacist-connect.firebaseapp.com",
  projectId: "clinician-pharmacist-connect",
  storageBucket: "clinician-pharmacist-connect.appspot.com",
  messagingSenderId: "15353969928",
  appId: "1:15353969928:web:e9b00f5fe77c4a001c40bd",
  measurementId: "G-88NN1LBTTC"
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig)
} else {
  app = firebase.app();
}

const db = app.firestore();
// const store = app.storage();
const auth = firebase.auth();

export { firebase, db, auth};