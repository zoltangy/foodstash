import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Container,
  Button,
  Card,
  CardHeader,
  CardContent,
  MenuItem,
} from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import { TextField, Select } from "formik-material-ui";
import { isLoaded } from "react-redux-firebase";
import { updateProfile, updatePassword, cleanUp } from "../store/actions/authActions";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0, 0, 4, 0),
  },
  card: {
    width: "100%",
    marginTop: "60px",
    overflow: "initial",
    border: "1px solid #0003",
  },
  cardContent: {
    padding: theme.spacing(5, 3, 0, 3),
  },
  cardHeader: {
    margin: "-32px auto 0px",
    borderRadius: "16px",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    width: "66%",
    textAlign: "center",
  },
  submit: {
    margin: theme.spacing(2, 0, 5),
  },
}));

export default function Profile(props) {
  const classes = useStyles();
  const profile = useSelector((state) => state.firebase.profile);
  const updateProfileError = useSelector((state) => state.auth.updateProfile.error);
  const updateProfileLoading = useSelector((state) => state.auth.updateProfile.loading);
  const updateProfileMessage = useSelector((state) => state.auth.updateProfile.message);
  const updatePasswordError = useSelector((state) => state.auth.updatePassword.error);
  const updatePasswordLoading = useSelector((state) => state.auth.updatePassword.loading);
  const updatePasswordMessage = useSelector((state) => state.auth.updatePassword.message);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(cleanUp());
    };
  }, [dispatch]);

  if (!isLoaded(profile)) {
    return <div></div>;
  }

  return (
    <Container maxWidth="md" className={classes.root}>
      <Card className={classes.card}>
        <CardHeader className={classes.cardHeader} title="Profile"></CardHeader>
        <CardContent className={classes.cardContent}>
          <Formik
            initialValues={{
              firstName: profile.firstName,
              lastName: profile.lastName,
              email: profile.email,
              amount: profile.expiry.amount,
              timeperiod: profile.expiry.timeperiod,
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
              return errors;
            }}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              await dispatch(
                updateProfile({
                  firstName: values.firstName,
                  lastName: values.lastName,
                  email: values.email,
                  expiry: {
                    amount: values.amount,
                    timeperiod: values.timeperiod,
                  },
                })
              );
              setSubmitting(false);
              resetForm();
            }}
          >
            {({ submitForm, isSubmitting }) => (
              <Form className={classes.form}>
                <Grid container direction="column" spacing={2}>
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
                      disabled={isSubmitting || updateProfileLoading}
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
                      disabled={isSubmitting || updateProfileLoading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TextField}
                      type="email"
                      name="email"
                      id="email"
                      label="Email Address"
                      variant="outlined"
                      fullWidth
                      disabled={isSubmitting || updateProfileLoading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} container>
                    <Grid item xs={6}>
                      <Field
                        component={TextField}
                        type="number"
                        id="amount"
                        name="amount"
                        label="Expiry notification period"
                        variant="outlined"
                        inputProps={{ min: 1 }}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={1}></Grid>
                    <Grid item xs={5}>
                      <Field
                        component={Select}
                        id="timeperiod"
                        name="timeperiod"
                        variant="outlined"
                        inputProps={{ "aria-label": "time period" }}
                        fullWidth
                      >
                        <MenuItem value="day">day(s)</MenuItem>
                        <MenuItem value="week">week(s)</MenuItem>
                      </Field>
                    </Grid>
                  </Grid>
                  {updateProfileError && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="error">
                        {updateProfileError}
                      </Typography>
                    </Grid>
                  )}
                  {updateProfileMessage && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="primary">
                        {updateProfileMessage}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6} container justify="flex-end">
                    <Button
                      disabled={isSubmitting || updateProfileLoading}
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      type="submit"
                    >
                      {updateProfileLoading ? "Updating..." : "Update Profile"}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>

          <Formik
            initialValues={{
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.currentPassword) {
                errors.currentPassword = "Required";
              }
              if (!values.newPassword) {
                errors.newPassword = "Required";
              }
              if (values.newPassword.length < 8) {
                errors.newPassword = "Too short";
              }
              if (!values.confirmPassword) {
                errors.confirmPassword = "Required";
              }
              if (values.newPassword === values.currentPassword) {
                errors.newPassword = "New password match current password";
              }
              if (values.newPassword !== values.confirmPassword) {
                errors.confirmPassword = "New passwords don't match";
              }

              return errors;
            }}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              await dispatch(updatePassword(values));
              setSubmitting(false);
              resetForm();
            }}
          >
            {({ submitForm, isSubmitting }) => (
              <Form className={classes.form}>
                <Grid container direction="column" spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TextField}
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      label="Current password"
                      variant="outlined"
                      autoComplete="off"
                      fullWidth
                      disabled={isSubmitting || updatePasswordLoading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TextField}
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      label="New password"
                      variant="outlined"
                      autoComplete="off"
                      fullWidth
                      disabled={isSubmitting || updatePasswordLoading}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Field
                      component={TextField}
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      label="Confirm new password"
                      variant="outlined"
                      autoComplete="off"
                      fullWidth
                      disabled={isSubmitting || updatePasswordLoading}
                    />
                  </Grid>
                  {updatePasswordError && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="error">
                        {updatePasswordError}
                      </Typography>
                    </Grid>
                  )}
                  {updatePasswordMessage && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="primary">
                        {updatePasswordMessage}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12} sm={6} container justify="flex-end">
                    <Button
                      disabled={isSubmitting || updatePasswordLoading}
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                      type="submit"
                    >
                      {updatePasswordLoading ? "Changing..." : "Change password"}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </Container>
  );
}
