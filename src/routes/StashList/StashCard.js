import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  Grid,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { deleteStash } from "../../store/actions/stashActions";
import { useDialog } from "../../components/DialogContext";
import { useLoader } from "../../components/LoaderContext";
import { formatDistanceToNow, isBefore, addDays } from "date-fns";
import { useFirestoreConnect, isLoaded } from "react-redux-firebase";
import CanImg from "../../assets/can.jpg";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 345,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardContent: {
    position: "relative",
  },
  canText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    lineHeight: "1rem",
    paddingTop: "6px",
  },
  primaryDark: {
    color: theme.palette.primary.dark,
  },
  actions: {
    justifyContent: "flex-end",
  },
  menuItem: {
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}));

export default function StashCard(props) {
  const classes = useStyles();
  const { stash } = props;

  useFirestoreConnect([
    {
      collection: "stashes",
      doc: stash.id,
      subcollections: [{ collection: "items" }],
      storeAs: `${stash.id}-items`,
    },
  ]);

  const items = useSelector((state) => state.firestore.data[`${stash.id}-items`]);
  const profile = useSelector((state) => state.firebase.profile);
  const expirySetting =
    profile.expiry.timeperiod === "week" ? profile.expiry.amount * 7 : profile.expiry.amount;

  const dispatch = useDispatch();
  const dialog = useDialog();
  const loader = useLoader();
  const loaderRef = useRef();
  const history = useHistory();

  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setAnchorEl(null);
  };

  if (!isLoaded(items)) {
    return <div>Loading...</div>;
  }

  let itemCount = 0;
  let itemExpiringCount = 0;
  for (let key in items) {
    if (items[key] != null) {
      itemCount += items[key].amount;
      if (items[key].expiration) {
        if (isBefore(items[key].expiration.toDate(), addDays(new Date(), expirySetting))) {
          itemExpiringCount += items[key].amount;
        }
      }
    }
  }

  const deleteStashClicked = () => {
    dialog({
      variant: "confirm",
      catchOnCancel: true,
      title: "Delete stash?",
      description: "Delete this stash including all the items recorded in it. This action can not be undone.",
      buttonOK: "Delete",
      buttonNOK: "Cancel",
    })
      .then(async () => {
        closeMenu();
        loader({ open: true, container: loaderRef });
        await dispatch(deleteStash(stash.id));
      })
      .catch(() => closeMenu());
  };

  const editStashClicked = () => {
    dialog({
      variant: "stashAction",
      catchOnCancel: true,
      title: "Edit stash",
      buttonOK: "Update",
      buttonNOK: "Cancel",
      initialValues: { name: stash.name, description: stash.description },
      stashId: stash.id,
      operation: "edit",
    })
      .then()
      .catch()
      .finally(closeMenu());
  };

  return (
    <>
      <Card className={classes.root} ref={loaderRef}>
        <CardHeader
          action={
            <IconButton aria-label="settings" onClick={openMenu}>
              <MoreVertIcon />
            </IconButton>
          }
          title={stash.name}
          subheader={"Last modified: " + formatDistanceToNow(stash.lastModified.toDate()) + " ago"}
          subheaderTypographyProps={{ variant: "caption" }}
        />
        <CardContent>
          <Grid container>
            <Grid item xs={6} container justify="center" className={classes.cardContent}>
              <img src={CanImg} alt="metal can" />
              <Typography variant="h6" component="div" className={classes.canText} color="primary">
                {itemCount}

                <Typography variant="caption" component="div">
                  {itemCount <= 1 ? "item" : "items"}
                </Typography>
              </Typography>
            </Grid>
            <Grid item xs={6} container justify="center" className={classes.cardContent}>
              {!!itemExpiringCount && (
                <Typography variant="h6" component="div" className={classes.canText} color="error">
                  {itemExpiringCount}
                  <Typography variant="caption" component="div">
                    expiring
                  </Typography>
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
        <CardActions disableSpacing className={classes.actions}>
          <Button onClick={() => history.push("/stash/" + stash.id)}>
            Open <KeyboardArrowRightIcon />
          </Button>
        </CardActions>

        <Menu
          id="customized-menu"
          getContentAnchorEl={null}
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={closeMenu}
          anchorOrigin={{
            vertical: "center",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <MenuItem className={classes.menuItem} onClick={editStashClicked}>
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Edit" />
          </MenuItem>
          <MenuItem className={classes.menuItem}>
            <ListItemIcon>
              <ShareIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Share" />
          </MenuItem>
          <MenuItem className={classes.menuItem} onClick={deleteStashClicked}>
            <ListItemIcon>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Delete" />
          </MenuItem>
        </Menu>
      </Card>
    </>
  );
}

// <a href="https://www.freepik.com/free-photos-vectors/food">Food vector created by macrovector - www.freepik.com</a>
