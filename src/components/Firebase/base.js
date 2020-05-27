import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firebase-firestore';
import 'firebase/firebase-storage';

const FirebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCNH9tJUZemTDk1PsvyQw3gei9wEz2x2Q0",
    authDomain: "before-visit.firebaseapp.com",
    databaseURL: "https://before-visit.firebaseio.com",
    projectId: "before-visit",
    storageBucket: "before-visit.appspot.com",
    messagingSenderId: "708801181328",
    appId: "1:708801181328:web:28a5b19d6c9350d2bb8a15",
    measurementId: "G-TLHP2FSVB4"
});
export default FirebaseApp;
