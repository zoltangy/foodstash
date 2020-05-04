import React from "react";
import { Grid, Typography, Container, Button, Link, Card } from "@material-ui/core";
import { Link as RouterLink, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(4, 0, 4, 0),
  },
  card: {
    padding: theme.spacing(6, 4, 6, 4),
    backgroundColor: "rgba(255, 255, 255, 0.6);",
  },
  button: {
    marginTop: theme.spacing(6),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(1, 6, 1, 6),
  },
}));

export default function LandingPage(props) {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Container maxWidth="md" className={classes.root}>
      <Card className={classes.card}>
        <Grid container justify="center" alignItems="center" direction="column" spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4">
              Organize your food storage.
              <br /> Don't let food expire on you again.
            </Typography>
            <Typography variant="h6">
              Create your stashes, track expiration dates, get reminders. It's free.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              color="primary"
              variant="contained"
              className={classes.button}
              onClick={() => {
                history.push("/signup");
              }}
            >
              Sign Up here
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Link component={RouterLink} to="/signin" variant="body2">
              Already have an account? Log in
            </Link>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}
