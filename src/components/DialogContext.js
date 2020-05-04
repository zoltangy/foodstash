import React, { createContext, useContext, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import { addStash, modifyStash, cleanUp } from "../store/actions/stashActions";

const DialogContext = createContext(Promise.reject);

export const useDialog = () => useContext(DialogContext);

export const DialogProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [dialogState, setDialogState] = useState(null);

  const awaitingPromiseRef = useRef();

  const openDialog = (options) => {
    setDialogState(options);
    return new Promise((resolve, reject) => {
      awaitingPromiseRef.current = { resolve, reject };
    });
  };

  const handleClose = () => {
    if (dialogState.catchOnCancel && awaitingPromiseRef.current) {
      awaitingPromiseRef.current.reject();
    }
    setDialogState(null);
  };

  const handleSubmit = () => {
    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.resolve();
    }
    setDialogState(null);
  };

  return (
    <>
      <DialogContext.Provider value={openDialog} children={children} aria-labelledby="dialog-title" />
      {dialogState && (
        <Dialog open={Boolean(dialogState)} maxWidth="xs" fullWidth>
          <DialogTitle id="dialog-title">{dialogState.title}</DialogTitle>

          {dialogState.variant === "confirm" && (
            <>
              <DialogContent>
                <DialogContentText>{dialogState.description}</DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button color="primary" onClick={handleClose} autoFocus>
                  {dialogState.buttonNOK}
                </Button>
                <Button color="primary" onClick={handleSubmit}>
                  {dialogState.buttonOK}
                </Button>
              </DialogActions>
            </>
          )}

          {dialogState.variant === "stashAction" && (
            <Formik
              initialValues={dialogState.initialValues}
              validate={(values) => {
                const errors = {};
                if (!values.name) {
                  errors.name = "Required";
                }
                return errors;
              }}
              onSubmit={async (values, { setSubmitting }) => {
                if (dialogState.operation === "add") {
                  await dispatch(addStash(values));
                } else {
                  await dispatch(modifyStash({ stashId: dialogState.stashId, ...values }));
                }
                setSubmitting(false);
                await dispatch(cleanUp());
                handleSubmit();
              }}
            >
              {({ submitForm, isSubmitting }) => (
                <Form autoComplete="off">
                  <DialogContent>
                    <Field
                      component={TextField}
                      type="text"
                      id="name"
                      name="name"
                      label="Stash name"
                      margin="dense"
                      inputProps={{ maxLength: 20 }}
                      fullWidth
                      autoFocus
                    />
                    <Field
                      component={TextField}
                      type="text"
                      id="description"
                      name="description"
                      label="Stash description (optional)"
                      inputProps={{ maxLength: 120 }}
                      margin="dense"
                      fullWidth
                      multiline
                      rows={3}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose} color="primary" disabled={isSubmitting}>
                      {dialogState.buttonNOK}
                    </Button>
                    <Button type="submit" color="primary" disabled={isSubmitting}>
                      {dialogState.buttonOK}
                    </Button>
                  </DialogActions>
                </Form>
              )}
            </Formik>
          )}
        </Dialog>
      )}
    </>
  );
};
