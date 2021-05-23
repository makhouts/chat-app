import * as firebase from "firebase";
import 'firebase/firestore';
import 'firebase/auth';


const firebaseConfig = {
    apiKey: "AIzaSyDkvbCdMu3qROUmIqPFt1AIOBkI2pVhiQw",
    authDomain: "chat-app-443b3.firebaseapp.com",
    projectId: "chat-app-443b3",
    storageBucket: "chat-app-443b3.appspot.com",
    messagingSenderId: "912683800207",
    appId: "1:912683800207:web:1dd4b953dadbd8a37982fa",
    measurementId: "G-ZGL4TNEDY6"
  };

  let app;

  if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
  } else {
    app = firebase.app();
  }

  const db = app.firestore();
  const auth = firebase.auth();

  export { db, auth };
