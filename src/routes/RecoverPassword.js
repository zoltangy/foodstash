import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Button from "@material-ui/core/Button";
import { Grid, Typography, Container, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import { cleanUp } from "../store/actions/authActions";
import { recoverPassword } from "../store/actions/authActions";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(4),
    marginTop: theme.spacing(8),
    backgroundColor: "rgba(255, 255, 255, 0.85);",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function RecoverPassword() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.recoverPassword.error);
  const message = useSelector((state) => state.auth.recoverPassword.message);

  useEffect(() => {
    return () => {
      dispatch(cleanUp());
    };
  }, [dispatch]);

  return (
    <Container maxWidth="xs">
      <Container component={Paper} maxWidth="xs" className={classes.root}>
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <Formik
            initialValues={{
              email: "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.email) {
                errors.email = "Required";
              } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = "Invalid email address";
              }
              return errors;
            }}
            onSubmit={async (values, { setSubmitting }) => {
              await dispatch(recoverPassword(values.email));
              setSubmitting(false);
            }}
          >
            {({ submitForm, isSubmitting }) => (
              <Form className={classes.form}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Field
                      component={TextField}
                      type="email"
                      name="email"
                      id="email"
                      label="Email Address"
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  {error && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="error">
                        {error}
                      </Typography>
                    </Grid>
                  )}
                  {message && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="primary">
                        {message}
                      </Typography>
                    </Grid>
                  )}

                  <Button
                    disabled={isSubmitting}
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    type="submit"
                  >
                    {isSubmitting ? "Sending email..." : "Reset password"}
                  </Button>
                </Grid>
              </Form>
            )}
          </Formik>
        </div>
      </Container>
    </Container>
  );
}
