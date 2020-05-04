import React from "react";
import { Divider, Grid, Link, Container } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import signature from "../assets/sign.png";

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: theme.spacing(2),
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  signature: {
    marginTop: theme.spacing(2),
  },
  link: {
    fontStyle: "normal",
    fontSize: "0.75rem",
    color: theme.palette.primary.contrastText,
  },
}));

export default function Footer() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Container maxWidth="xs">
        <Grid container justify="center" spacing={0}>
          <Grid item xs={12}>
            <Divider variant="middle" />
          </Grid>
          <Grid item xs={12} container justify="center" className={classes.signature}>
            <img src={signature} alt="signature" width="50" height="44" />
          </Grid>
          <Grid item xs={12} container justify="center">
            <Link href="https://www.freepik.com/free-photos-vectors/food" className={classes.link}>
              Can art by macrovector - www.freepik.com
            </Link>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
