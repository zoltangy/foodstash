import React, { createContext, useContext, useState, useRef } from "react";
import { Dialog, DialogTitle } from "@material-ui/core";

import ConfirmDialog from "./ConfirmDialog";
import StashActionDialog from "./StashActionDialog";
import StashShareDialog from "./StashShareDialog";

const DialogContext = createContext(Promise.reject);

export const useDialog = () => useContext(DialogContext);

export const DialogProvider = ({ children }) => {
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
            <ConfirmDialog
              onClose={handleClose}
              onSubmit={handleSubmit}
              description={dialogState.description}
              buttonNOK={dialogState.buttonNOK}
              buttonOK={dialogState.buttonOK}
            />
          )}

          {dialogState.variant === "addStash" && (
            <StashActionDialog
              onClose={handleClose}
              onSubmit={handleSubmit}
              initialValues={dialogState.initialValues}
              operation="add"
              stashId={dialogState.stashId}
              buttonNOK="Cancel"
              buttonOK="Add"
            />
          )}

          {dialogState.variant === "editStash" && (
            <StashActionDialog
              onClose={handleClose}
              onSubmit={handleSubmit}
              initialValues={dialogState.initialValues}
              operation="edit"
              stashId={dialogState.stashId}
              buttonNOK="Cancel"
              buttonOK="Update"
            />
          )}

          {dialogState.variant === "shareStash" && (
            <StashShareDialog onClose={handleClose} onSubmit={handleSubmit} stashId={dialogState.stashId} />
          )}
        </Dialog>
      )}
    </>
  );
};
