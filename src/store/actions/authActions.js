import * as actions from "./actionTypes";

export const signUp = (data) => async (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();
  try {
    await firebase.auth().createUserWithEmailAndPassword(data.email, data.password);
    firebase.updateProfile({ email: data.email, firstName: data.firstName, lastName: data.lastName });
    dispatch({ type: actions.AUTH_SUCCESS });
  } catch (err) {
    dispatch({ type: actions.AUTH_FAIL, payload: err.message });
  }
};

export const signOut = () => async (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();
  try {
    await firebase.auth().signOut();
  } catch (err) {
    console.log(err.message);
  }
};

export const signIn = (data) => async (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();
  try {
    await firebase.auth().signInWithEmailAndPassword(data.email, data.password);
    dispatch({ type: actions.AUTH_SUCCESS });
  } catch (err) {
    let message = "";
    switch (err.code) {
      case "auth/wrong-password":
        message = "Wrong email address or password provided.";
        break;
      case "auth/user-not-found":
        message = "Wrong email address or password provided.";
        break;
      default:
        message = err.message;
        break;
    }
    dispatch({ type: actions.AUTH_FAIL, payload: message });
  }
};

export const cleanUp = () => ({
  type: actions.AUTH_CLEAN_UP,
});
