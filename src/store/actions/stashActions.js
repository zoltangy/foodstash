import * as actions from "./actionTypes";

export const addStash = (data) => async (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();
  const firestore = firebase.firestore();
  const uid = getState().firebase.auth.uid;
  try {
    await firestore.collection("stashes").add({
      ...data,
      users: [uid],
      lastModified: firebase.firestore.Timestamp.now(),
    });
    dispatch({ type: actions.ADD_STASH_SUCCESS });
  } catch (err) {
    dispatch({ type: actions.ADD_STASH_FAIL, payload: err.message });
  }
};

export const modifyStash = ({ stashId, ...rest }) => async (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();
  const firestore = firebase.firestore();
  try {
    await firestore
      .collection("stashes")
      .doc(stashId)
      .update({
        ...rest,
        lastModified: firebase.firestore.Timestamp.now(),
      });
    dispatch({ type: actions.MODIFY_STASH_SUCCESS });
  } catch (err) {
    dispatch({ type: actions.MODIFY_STASH_FAIL, payload: err.message });
  }
};

export const shareStash = ({ stashId, email }) => async (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();
  const firestore = firebase.firestore();
  try {
    const doc = await firestore.collection("users").where("email", "==", email).get();
    if (doc.size === 0) {
      throw new Error("No registered user with this email address");
    }
    let userid;
    doc.forEach((element) => {
      userid = element.id;
    });
    await firestore
      .collection("stashes")
      .doc(stashId)
      .update({
        users: firebase.firestore.FieldValue.arrayUnion(userid),
        lastModified: firebase.firestore.Timestamp.now(),
      });

    dispatch({ type: actions.SHARE_STASH_SUCCESS, payload: "Stash shared successfully." });
  } catch (err) {
    dispatch({ type: actions.SHARE_STASH_FAIL, payload: err.message });
  }
};

export const cleanUp = () => ({
  type: actions.STASH_CLEAN_UP,
});

export const deleteStash = (data) => async (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();

  var deleteFn = firebase.functions().httpsCallable("recursiveDeleteStash");
  try {
    await deleteFn({ stashID: data });
    dispatch({ type: actions.DELETE_STASH_SUCCESS });
  } catch (err) {
    dispatch({ type: actions.DELETE_STASH_FAIL, payload: err });
  }
};

export const addItem = ({ stashId, ...rest }) => async (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();
  const firestore = firebase.firestore();
  try {
    await firestore
      .collection("stashes")
      .doc(stashId)
      .collection("items")
      .add({
        ...rest,
      });
    await firestore.collection("stashes").doc(stashId).update({
      lastModified: firebase.firestore.Timestamp.now(),
    });
    dispatch({ type: actions.ADD_ITEM_SUCCESS });
  } catch (err) {
    dispatch({ type: actions.ADD_ITEM_FAIL, payload: err.message });
  }
};

export const modifyItem = ({ stashId, itemId, ...rest }) => async (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();
  const firestore = firebase.firestore();
  try {
    await firestore
      .collection("stashes")
      .doc(stashId)
      .collection("items")
      .doc(itemId)
      .update({
        ...rest,
      });
    await firestore.collection("stashes").doc(stashId).update({
      lastModified: firebase.firestore.Timestamp.now(),
    });
    dispatch({ type: actions.MODIFY_ITEM_SUCCESS });
  } catch (err) {
    dispatch({ type: actions.MODIFY_ITEM_FAIL, payload: err.message });
  }
};

export const deleteItem = ({ stashId, itemId }) => async (dispatch, getState, { getFirebase }) => {
  const firebase = getFirebase();
  const firestore = firebase.firestore();
  try {
    await firestore.collection("stashes").doc(stashId).collection("items").doc(itemId).delete();
    await firestore.collection("stashes").doc(stashId).update({
      lastModified: firebase.firestore.Timestamp.now(),
    });
    dispatch({ type: actions.DELETE_ITEM_SUCCESS });
  } catch (err) {
    dispatch({ type: actions.DELETE_ITEM_FAIL, payload: err.message });
  }
};
