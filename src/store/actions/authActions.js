import * as actions from "./actionTypes";

export const signUp = (data) => async (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();
  try {
    await firebase.auth().createUserWithEmailAndPassword(data.email, data.password);
    await firebase.updateProfile({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      expiry: {
        amount: "2",
        timeperiod: "week",
      },
    });
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

export const updateProfile = (data) => async (dispatch, getState, { getFirebase }) => {
  dispatch({ type: actions.AUTH_UPDATE_PROFILE_START });
  const firebase = getFirebase();
  try {
    await firebase.updateProfile({ ...data });
    await firebase.auth().currentUser.updateEmail(data.email);
    dispatch({ type: actions.AUTH_UPDATE_PROFILE_SUCCESS, payload: "Profile updated successfully" });
  } catch (err) {
    dispatch({ type: actions.AUTH_UPDATE_PROFILE_FAIL, payload: err.message });
  }
};

export const updatePassword = (data) => async (dispatch, getState, { getFirebase }) => {
  dispatch({ type: actions.AUTH_UPDATE_PASSWORD_START });
  const firebase = getFirebase();
  const user = firebase.auth().currentUser;
  const credential = firebase.auth.EmailAuthProvider.credential(user.email, data.currentPassword);
  try {
    await user.reauthenticateWithCredential(credential);
    await user.updatePassword(data.newPassword);
    dispatch({ type: actions.AUTH_UPDATE_PASSWORD_SUCCESS, payload: "Password changed successfully" });
  } catch (err) {
    let message = err.message;
    if (err.code === "auth/wrong-password") {
      message = "The current password is incorrect";
    }
    dispatch({ type: actions.AUTH_UPDATE_PASSWORD_FAIL, payload: message });
  }
};

export const recoverPassword = (email) => async (dispatch, getState, { getFirebase }) => {
  dispatch({ type: actions.AUTH_RECOVER_PASSWORD_START });
  const firebase = getFirebase();
  try {
    await firebase.auth().sendPasswordResetEmail(email);
    dispatch({
      type: actions.AUTH_RECOVER_PASSWORD_SUCCESS,
      payload: "The email to reset your password has been sent successfully.",
    });
  } catch (err) {
    let message = "";
    if (err.code === "auth/user-not-found") {
      message = "No user found with this email address";
    }
    dispatch({ type: actions.AUTH_RECOVER_PASSWORD_FAIL, payload: message });
  }
};
