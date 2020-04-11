import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Link as RouterLink } from "react-router-dom";
import { Link, Grid, Box, Typography, Container } from "@material-ui/core";
//import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import { Formik, Form, Field } from "formik";
import { TextField } from "formik-material-ui";
import { useDispatch } from "react-redux";
import { signUp } from "../store/actions/authActions";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://material-ui.com/">
        FoodStash
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
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

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
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
          onSubmit={async (values, { setSubmitting }) => {
            await dispatch(signUp(values));
            setSubmitting(false);
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
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Field
                    component={TextField}
                    type="text"
                    name="lastName"
                    id="lastName"
                    label="Last Name"
                    autoComplete="lname"
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
                    autoComplete="email"
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
                    autoComplete="current-password"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Button
                onClick={submitForm}
                disabled={isSubmitting}
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Sign Up
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link component={RouterLink} to="/signin" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}
