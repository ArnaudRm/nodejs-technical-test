const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyAjM8VwZaG-FP87fCH5kKzBBLZDQmRCj4E",
    authDomain: "nodejs-tech-test.firebaseapp.com",
    projectId: "nodejs-tech-test",
    storageBucket: "nodejs-tech-test.appspot.com",
    messagingSenderId: "375768976366",
    appId: "1:375768976366:web:3f90fd50390461fb835cff"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;
