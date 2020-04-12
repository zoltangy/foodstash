import * as actions from "./actionTypes";

export const addStash = (data) => async (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();
  const firestore = firebase.firestore();
  const uid = getState().firebase.auth.uid;
  try {
    await firestore.collection("stashes").add({
      ...data,
      users: [uid],
    });
    dispatch({ type: actions.ADD_STASH_SUCCESS });
  } catch (err) {
    dispatch({ type: actions.ADD_STASH_FAIL, payload: err.message });
  }
};

export const cleanUp = () => ({
  type: actions.STASH_CLEAN_UP,
});
