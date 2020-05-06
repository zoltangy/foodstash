import React from "react";
import { DialogContent, DialogContentText, DialogActions, Button } from "@material-ui/core";

export default function ConfirmDialog(props) {
  return (
    <>
      <DialogContent>
        <DialogContentText>{props.description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={props.onClose} autoFocus>
          {props.buttonNOK}
        </Button>
        <Button color="primary" onClick={props.onSubmit}>
          {props.buttonOK}
        </Button>
      </DialogActions>
    </>
  );
}
