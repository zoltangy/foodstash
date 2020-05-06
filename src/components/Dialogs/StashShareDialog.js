import React, { useEffect } from "react";
import { compose } from "redux";
import { useDispatch, useSelector, connect } from "react-redux";
import { firestoreConnect, populate, isLoaded } from "react-redux-firebase";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import { DialogContent, DialogContentText, DialogActions, Button, Typography } from "@material-ui/core";
import { shareStash, cleanUp } from "../../store/actions/stashActions";

function StashShareDialog(props) {
  const stash = useSelector(
    ({
      firestore: {
        data: { stashes },
      },
    }) => stashes && stashes[props.stashId]
  );

  const users = useSelector((state) => state.firestore.data.users);
  const uid = useSelector((state) => state.firebase.auth.uid);
  const dispatch = useDispatch();
  const error = useSelector((state) => state.stash.shareStash.error);
  const message = useSelector((state) => state.stash.shareStash.message);

  useEffect(() => {
    return () => {
      dispatch(cleanUp());
    };
  }, [dispatch]);

  const getEmailOfSharedUsers = () => {
    let emailList = [];
    stash.users.forEach((userid) => {
      if (userid !== uid) {
        emailList.push(users[userid].email);
      }
    });
    return emailList;
  };

  const SharedWidthList = () => {
    let shareList = [];
    if (isLoaded(stash) && isLoaded(users)) {
      shareList = getEmailOfSharedUsers();
    }
    return (
      <>
        {shareList.length > 0 && (
          <>
            Already shared with:
            <ul>
              {shareList.map((email) => (
                <li key={email}>{email}</li>
              ))}
            </ul>
          </>
        )}
      </>
    );
  };

  return (
    <Formik
      initialValues={{ email: "" }}
      validate={(values) => {
        const errors = {};
        if (!values.email) {
          errors.email = "Required";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
          errors.email = "Invalid email address";
        }
        return errors;
      }}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        await dispatch(shareStash({ stashId: props.stashId, email: values.email }));
        setSubmitting(false);
        resetForm();
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <DialogContent>
            <SharedWidthList />
            <DialogContentText>
              Enter the email address of the person you would like to share this stash with:
            </DialogContentText>
            <Field
              component={TextField}
              type="email"
              name="email"
              id="email"
              label="Email Address"
              variant="outlined"
              fullWidth
            />
            {error && (
              <Typography variant="subtitle2" color="error">
                {error}
              </Typography>
            )}
            {message && (
              <Typography variant="subtitle2" color="primary">
                {message}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={props.onClose} color="primary" disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              {isSubmitting ? "Sharing..." : "Share"}
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
}

const withPopulatedUsers = compose(
  firestoreConnect((props) => [
    {
      collection: "stashes",
      doc: props.stashId,
      populates: [{ child: "users", root: "users" }],
    },
  ]),
  connect((state, props) => ({
    stashes: populate(state.firestore, "stashes", [{ child: "users", root: "users" }]),
  }))
);

export default withPopulatedUsers(StashShareDialog);
