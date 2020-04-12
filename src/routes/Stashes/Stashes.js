import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useFirestoreConnect } from "react-redux-firebase";
import { useSelector } from "react-redux";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Box,
} from "@material-ui/core";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import AddStash from "./AddStash";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  descr: {
    whiteSpace: "pre-wrap",
  },
}));

export default function Stashes(props) {
  const classes = useStyles();
  const uid = useSelector((state) => state.firebase.auth.uid);
  useFirestoreConnect([{ collection: "stashes", where: ["users", "array-contains", uid] }]);

  const stashes = useSelector((state) => state.firestore.data.stashes);

  for (let key in stashes) {
    console.log(stashes[key]);
  }
  return (
    <>
      <Box display="flex">
        <Card className={classes.root}>
          <CardContent>
            <AddStash />
          </CardContent>
        </Card>
        {stashes !== undefined
          ? Object.keys(stashes).map((key) => {
              let stash = stashes[key];
              let description = stash.description || "";
              description = description.replace("\\n", "\n");
              return (
                <Card className={classes.root} key={key}>
                  <CardHeader
                    avatar={
                      <Avatar aria-label="recipe" className={classes.avatar}>
                        R
                      </Avatar>
                    }
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title={stash.name}
                    subheader="September 14, 2016"
                  />

                  <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p" className={classes.descr}>
                      {description}
                    </Typography>
                  </CardContent>
                  <CardActions disableSpacing>
                    <IconButton aria-label="add to favorites">
                      <FavoriteIcon />
                    </IconButton>
                    <IconButton aria-label="share">
                      <ShareIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              );
            })
          : null}
      </Box>
    </>
  );
}
