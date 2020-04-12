import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import { IconButton, Typography } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@material-ui/core";
import { addStash } from "../../store/actions/stashActions";
import { cleanUp } from "../../store/actions/stashActions";

export default function AddStash(props) {
  const dispatch = useDispatch();
  //const error = useSelector((state) => state.stash.error);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(cleanUp());
  };

  return (
    <>
      <Typography variant="body2" color="textSecondary" component="p">
        <IconButton aria-label="add to favorites" onClick={handleOpen}>
          <AddIcon />
        </IconButton>
        Add stash
      </Typography>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create new Stash</DialogTitle>
        <Formik
          initialValues={{
            name: "",
            description: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = "Required";
            }
            return errors;
          }}
          onSubmit={async (values) => {
            await dispatch(addStash(values));
            handleClose();
          }}
        >
          {({ submitForm, isSubmitting }) => (
            <Form>
              <DialogContent>
                <DialogContentText></DialogContentText>
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
                  margin="dense"
                  fullWidth
                  multiline
                  rows={3}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={submitForm} color="primary">
                  Add
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}
