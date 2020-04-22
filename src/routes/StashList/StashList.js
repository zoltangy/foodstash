import React from "react";
import { useFirestoreConnect, isLoaded } from "react-redux-firebase";
import { useSelector } from "react-redux";
import { Container, Grid, Card, CardContent, Typography } from "@material-ui/core";
import StashCard from "./StashCard";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { useDialog } from "../../components/DialogContext";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 345,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    cursor: "pointer",
  },
}));

export default function StashList(props) {
  const classes = useStyles();
  const uid = useSelector((state) => state.firebase.auth.uid);
  useFirestoreConnect([{ collection: "stashes", where: ["users", "array-contains", uid] }]);
  const stashes = useSelector((state) => state.firestore.data.stashes);
  const dialog = useDialog();

  if (!isLoaded(stashes)) {
    return <div>Loading...</div>;
  }

  const addStashClicked = () => {
    dialog({
      variant: "stashAction",
      catchOnCancel: false,
      title: "Add stash",
      buttonOK: "Add",
      buttonNOK: "Cancel",
      initialValues: { name: "", description: "" },
      operation: "add",
    })
      .then()
      .catch();
  };

  return (
    <>
      <Container>
        <Grid container spacing={3} justify="center">
          <Grid item>
            <Card className={classes.root} onClick={addStashClicked}>
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p" align="center">
                  <AddIcon />
                  <br />
                  Add stash
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {stashes !== undefined && stashes !== null
            ? Object.keys(stashes)
                .filter((key) => stashes[key] != null)
                .map((key) => {
                  let stash = stashes[key];

                  return (
                    <Grid item key={key}>
                      <StashCard stash={{ id: key, ...stash }} />
                    </Grid>
                  );
                })
            : null}
        </Grid>
      </Container>
    </>
  );
}
