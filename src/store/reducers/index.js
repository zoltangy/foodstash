import { combineReducers } from "redux";
import { firebaseReducer } from "react-redux-firebase";
import { firestoreReducer } from "redux-firestore";
import authReducer from "./authReducer.js";
import stashReducer from "./stashReducer";

export default combineReducers({
  auth: authReducer,
  stash: stashReducer,
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});
