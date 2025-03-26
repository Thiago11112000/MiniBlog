import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBb81yXE_JnPVVWmWCKrMpkI9bg1ixV8Wg",
  authDomain: "miniblog-8c673.firebaseapp.com",
  projectId: "miniblog-8c673",
  storageBucket: "miniblog-8c673.firebasestorage.app",
  messagingSenderId: "545434948092",
  appId: "1:545434948092:web:c256fb2930b9dcb380e279",
  measurementId: "G-KTGHRVC1PJ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, app };