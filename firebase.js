import firebase from "firebase/app";
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJz0KIx2XPTlZzP6h3tpw7078enGh51eQ",
  authDomain: "amzn-cln-2.firebaseapp.com",
  projectId: "amzn-cln-2",
  storageBucket: "amzn-cln-2.appspot.com",
  messagingSenderId: "851078737182",
  appId: "1:851078737182:web:ffd183e59727d96cbced0f",
};

/* export const app = !firebase?.apps?.length
  ? initializeApp(firebaseConfig)
  : firebase.app(); */

export const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export default db;
