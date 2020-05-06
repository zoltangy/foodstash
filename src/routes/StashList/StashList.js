import React from "react";
import { useFirestoreConnect, isLoaded } from "react-redux-firebase";
import { useSelector } from "react-redux";
import { Container, Grid, Card, CardContent, Typography } from "@material-ui/core";
import StashCard from "./StashCard";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { useDialog } from "../../components/Dialogs/DialogContext";
import Loader from "../../components/Loader";

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(4),
  },
  card: {
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
  useFirestoreConnect([
    {
      collection: "stashes",
      where: ["users", "array-contains", uid],
      orderBy: ["lastModified", "desc"],
      storeAs: "stashList",
    },
  ]);
  const stashes = useSelector((state) => state.firestore.ordered.stashList);
  const dialog = useDialog();

  if (!isLoaded(stashes)) {
    return <Loader open={true} />;
  }

  const addStashClicked = () => {
    dialog({
      variant: "addStash",
      title: "Add stash",
      initialValues: { name: "", description: "" },
    })
      .then()
      .catch();
  };

  return (
    <Container className={classes.root}>
      <Grid container spacing={3} justify="center">
        <Grid item>
          <Card className={classes.card} onClick={addStashClicked}>
            <CardContent>
              <Typography variant="body2" color="primary" component="p" align="center">
                <AddIcon />
                <br />
                Add stash
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        {stashes.map((stash) => (
          <Grid item key={stash.id}>
            <StashCard stash={stash} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
