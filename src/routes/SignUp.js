import React, { useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { Link as RouterLink } from "react-router-dom";
import { Link, Grid, Typography, Container, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import { useDispatch, useSelector } from "react-redux";
import { signUp, cleanUp } from "../store/actions/authActions";

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
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const error = useSelector((state) => state.auth.error);

  useEffect(() => {
    return () => {
      dispatch(cleanUp());
    };
  }, [dispatch]);

  return (
    <Container component={Paper} maxWidth="xs" className={classes.root}>
      <div className={classes.paper}>
        <Avatar className={classes.avatar}></Avatar>
        <Typography component="h1" variant="h5">
          Create Account
        </Typography>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.firstName) {
              errors.firstName = "Required";
            }
            if (!values.lastName) {
              errors.lastName = "Required";
            }
            if (!values.email) {
              errors.email = "Required";
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
              errors.email = "Invalid email address";
            }
            if (values.password.length < 8) {
              errors.password = "Too short";
            }
            return errors;
          }}
          onSubmit={async (values) => {
            await dispatch(signUp(values));
          }}
        >
          {({ submitForm, isSubmitting }) => (
            <Form className={classes.form}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Field
                    component={TextField}
                    type="text"
                    name="firstName"
                    id="firstName"
                    label="First Name"
                    autoComplete="fname"
                    variant="outlined"
                    inputProps={{ maxLength: 20 }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    component={TextField}
                    type="text"
                    name="lastName"
                    id="lastName"
                    label="Last Name"
                    variant="outlined"
                    inputProps={{ maxLength: 20 }}
                    fullWidth
                  />
                </Grid>
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
                <Grid item xs={12}>
                  <Field
                    component={TextField}
                    type="password"
                    id="password"
                    name="password"
                    label="Password"
                    variant="outlined"
                    autoComplete="off"
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
              </Grid>
              <Button
                disabled={isSubmitting}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                type="submit"
              >
                Sign Up
              </Button>
            </Form>
          )}
        </Formik>
        <Grid container justify="flex-end">
          <Grid item>
            <Link component={RouterLink} to="/signin" variant="body2">
              Already have an account? Log in
            </Link>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}
