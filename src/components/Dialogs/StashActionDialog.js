import React from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import { DialogContent, DialogActions, Button } from "@material-ui/core";
import { addStash, modifyStash, cleanUp } from "../../store/actions/stashActions";

export default function StashActionDialog(props) {
  const dispatch = useDispatch();
  return (
    <Formik
      initialValues={props.initialValues}
      validate={(values) => {
        const errors = {};
        if (!values.name) {
          errors.name = "Required";
        }
        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => {
        if (props.operation === "add") {
          await dispatch(addStash(values));
        } else {
          await dispatch(modifyStash({ stashId: props.stashId, ...values }));
        }
        setSubmitting(false);
        await dispatch(cleanUp());
        props.onSubmit();
      }}
    >
      {({ isSubmitting }) => (
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
            <Button onClick={props.onClose} color="primary" disabled={isSubmitting}>
              {props.buttonNOK}
            </Button>
            <Button type="submit" color="primary" disabled={isSubmitting}>
              {props.buttonOK}
            </Button>
          </DialogActions>
        </Form>
      )}
    </Formik>
  );
}
