import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import { DatePicker } from "formik-material-ui-pickers";
import { Grid, Box, IconButton } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";

const useStyles = makeStyles((theme) => ({
  form: {
    width: "100%",
  },
}));

export default function StashItemForm({ initialValues, onSubmitFunc, onCancelFunc }) {
  const classes = useStyles();

  return (
    <Formik
      initialValues={initialValues}
      validate={(values) => {
        const errors = {};
        if (!values.name) {
          errors.name = "Required";
        }
        if (values.amount < 1) {
          errors.amount = "Must be greater than zero";
        }
        return errors;
      }}
      onSubmit={(values) => onSubmitFunc(values)}
    >
      {({ submitForm, isSubmitting }) => (
        <Form className={classes.form}>
          <Grid item xs={12} container alignItems="center">
            <Grid item xs={10} container justify="flex-start">
              <Box ml={3}>
                <Field
                  component={TextField}
                  type="text"
                  id="name"
                  name="name"
                  label="Item name"
                  margin="dense"
                  inputProps={{ maxLength: 30, size: 30 }}
                  autoFocus
                />
              </Box>
              <Box ml={3}>
                <Field
                  component={DatePicker}
                  label="Expiration date"
                  name="expiration"
                  id="expiration"
                  margin="dense"
                  format="PPP"
                  inputProps={{ size: 15 }}
                  clearable
                />
              </Box>
              <Box ml={3}>
                <Field
                  component={TextField}
                  type="number"
                  id="amount"
                  name="amount"
                  label="Amount"
                  margin="dense"
                  inputProps={{ min: 1, size: 5 }}
                />
              </Box>
            </Grid>
            <Grid item xs={2} container justify="center">
              <IconButton
                aria-label="account of current user"
                color="primary"
                onClick={submitForm}
                disabled={isSubmitting}
              >
                <CheckIcon />
              </IconButton>
              <IconButton
                aria-label="account of current user"
                color="secondary"
                onClick={onCancelFunc}
                disabled={isSubmitting}
              >
                <ClearIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
