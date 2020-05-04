import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import { Link as RouterLink } from "react-router-dom";
import { Link, Grid, Typography, Container, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import { signIn, cleanUp } from "../store/actions/authActions";

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
    width: "100%",
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
    <Container maxWidth="xs">
      <Container component={Paper} maxWidth="xs" className={classes.root}>
        <div className={classes.paper}>
          <Avatar className={classes.avatar}></Avatar>
          <Typography component="h1" variant="h5">
            Log in to your account
          </Typography>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.email) {
                errors.email = "Required";
              } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = "Invalid email address";
              }
              if (!values.password) {
                errors.password = "Required";
              }
              return errors;
            }}
            onSubmit={async (values) => {
              await dispatch(signIn(values));
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
                      autoComplete="on"
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
                  <Grid item xs={12} container justify="flex-end">
                    <Link component={RouterLink} to="/recoverPassword" variant="body2">
                      Forgot password?
                    </Link>
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
                  Log In
                </Button>
                <Grid container justify="flex-end">
                  <Grid item>
                    <Link component={RouterLink} to="/signup" variant="body2">
                      Don't have an account yet? Sign up
                    </Link>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </div>
      </Container>
    </Container>
  );
}
