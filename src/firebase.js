import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD88kHH-C6m09RJnE3kU5WdmyVlg3Qai7Y",
  authDomain: "foodstash-e4417.firebaseapp.com",
  databaseURL: "https://foodstash-e4417.firebaseio.com",
  projectId: "foodstash-e4417",
  storageBucket: "foodstash-e4417.appspot.com",
  messagingSenderId: "681244154128",
  appId: "1:681244154128:web:f205639f7fec2a9f83ad95",
  measurementId: "G-CCFVX0WP7V",
};
firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
