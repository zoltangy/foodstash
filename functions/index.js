const admin = require("firebase-admin");
const firebase_tools = require("firebase-tools");
const functions = require("firebase-functions");

admin.initializeApp();

// [START recursive_delete_function]
/**
 * Initiate a recursive delete of documents at a given path.
 *
 * The calling user must be authenticated and be listed on the users
 * field of the document
 *
 * This delete is NOT an atomic operation and it's possible
 * that it may fail after only deleting some documents.
 *
 * @param {string} data.path the document or collection path to delete.
 */
exports.recursiveDeleteStash = functions
  .runWith({
    timeoutSeconds: 540,
    memory: "2GB",
  })
  .https.onCall((data, context) => {
    const stashID = data.stashID;
    console.log(`User ${context.auth.uid} has requested to delete stash with id ${stashID}`);

    // Only allow delete if user is listed on the users field of the document
    admin
      .firestore()
      .collection("stashes")
      .doc(stashID)
      .get()
      .then((doc) => {
        if (!doc.data().users.includes(context.auth.uid)) {
          throw new functions.https.HttpsError("permission-denied", "Must have rigths to delete this stash.");
        }
        return;
      })
      .catch((err) => {
        console.log(err);
      });

    // Run a recursive delete on the given document or collection path.
    // The 'token' must be set in the functions config, and can be generated
    // at the command line by running 'firebase login:ci'.
    return firebase_tools.firestore
      .delete(`/stashes/${stashID}`, {
        project: process.env.GCLOUD_PROJECT,
        recursive: true,
        yes: true,
        token: functions.config().fb.token,
      })
      .then(() => {
        return {
          stashID: stashID,
        };
      });
  });
// [END recursive_delete_function]
