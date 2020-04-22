import React, { useState, useRef } from "react";
import { Redirect } from "react-router-dom";
import { useFirestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { formatDistanceToNow, isBefore, addDays } from "date-fns";
import {
  Container,
  Grid,
  Typography,
  Box,
  Divider,
  IconButton,
  Card,
  CardHeader,
  Badge,
  Button,
} from "@material-ui/core";

import { addItem, deleteStash } from "../../store/actions/stashActions";
import { useDialog } from "../../components/DialogContext";
import EditIcon from "@material-ui/icons/Edit";
import AddIcon from "@material-ui/icons/Add";
import ShareIcon from "@material-ui/icons/Share";
import DeleteIcon from "@material-ui/icons/Delete";
import { useLoader } from "../../components/LoaderContext";
import StashItem from "./StashItem";
import StashItemForm from "./StashItemForm";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(0),
    paddingBottom: theme.spacing(4),
  },
  card: {
    width: "100%",
    marginTop: "60px",
    overflow: "initial",
    border: "1px solid #0003",
  },
  cardHeader: {
    margin: "-32px auto 0px",
    borderRadius: "16px",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    width: "66%",
    textAlign: "center",
  },
  description: {
    borderBottom: "2px solid #0003",
    whiteSpace: "pre-wrap",
  },
}));

export default function StashDetails(props) {
  const stashId = props.match.params.id;
  const classes = useStyles();

  useFirestoreConnect([
    { collection: "stashes", doc: stashId, storeAs: stashId },
    {
      collection: "stashes",
      doc: stashId,
      subcollections: [{ collection: "items" }],
      storeAs: `${stashId}-items`,
    },
  ]);
  const stash = useSelector((state) => state.firestore.data[stashId]);
  const items = useSelector((state) => state.firestore.data[`${stashId}-items`]);
  const profile = useSelector((state) => state.firebase.profile);
  const dispatch = useDispatch();
  const dialog = useDialog();
  const loader = useLoader();
  const loaderRef = useRef();
  const [formRef, setFormRef] = useState(null);

  if (!isLoaded(stash) || !isLoaded(items)) {
    return <div>Loading...</div>;
  } else {
    if (isEmpty(stash)) {
      return (
        <Redirect
          to={{
            pathname: "/stashlist",
          }}
        />
      );
    }
  }

  const expirySetting =
    profile.expiry.timeperiod === "week" ? profile.expiry.amount * 7 : profile.expiry.amount;

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
      catchOnCancel: false,
      title: "Delete stash?",
      description: "Delete this stash including all the items recorded in it. This action can not be undone.",
      buttonOK: "Delete",
      buttonNOK: "Cancel",
    })
      .then(async () => {
        loader({ open: true, container: loaderRef });
        dispatch(deleteStash(stashId));
      })
      .catch();
  };

  const editStashClicked = () => {
    dialog({
      variant: "stashAction",
      catchOnCancel: true,
      title: "Edit stash",
      buttonOK: "Update",
      buttonNOK: "Cancel",
      initialValues: { name: stash.name, description: stash.description },
      stashId: stashId,
      operation: "edit",
    });
  };

  const shareStashClicked = () => {};

  const formSubmitAdd = (values) => {
    dispatch(addItem({ stashId, ...values }));
    setFormRef(null);
  };

  const Description = () => {
    return (
      <Grid container className={classes.description}>
        <Box px={3} pb={1}>
          <Typography component="span" variant="subtitle2">
            Description:
          </Typography>
          {" " + stash.description}
        </Box>
      </Grid>
    );
  };

  const ItemList = ({ itemList }) => {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Divider variant="middle" />
        </Grid>
        {itemList !== null
          ? Object.keys(itemList)
              .filter((key) => itemList[key] != null)
              .map((key) => (
                <StashItem
                  key={key}
                  stashId={stashId}
                  item={{ id: key, ...itemList[key] }}
                  formRef={formRef}
                  setFormRef={setFormRef}
                />
              ))
          : //TODO
            "No items yet!"}
      </Grid>
    );
  };

  const AddItemButton = ({ variant }) => {
    return (
      <Box py={2}>
        {formRef === variant ? (
          <StashItemForm
            initialValues={{
              name: "",
              amount: 1,
              expiration: null,
            }}
            onSubmitFunc={formSubmitAdd}
            onCancelFunc={() => {
              setFormRef(null);
            }}
          />
        ) : (
          <Grid container justify="center">
            <Button
              aria-label="account of current user"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setFormRef(variant)}
            >
              Add Item
            </Button>
          </Grid>
        )}
      </Box>
    );
  };

  const CardSubHeader = () => {
    return (
      <Grid container alignItems="center">
        <Grid item container xs={6}>
          <Box ml={3} width="100%">
            <Typography component="span" variant="subtitle2">
              Last modified:
            </Typography>
            {" " + formatDistanceToNow(stash.lastModified.toDate()) + " ago"}
          </Box>
          <Box ml={3}>
            <Typography component="span" variant="subtitle2">
              Total items:
            </Typography>
            {" " + itemCount + "  (expiring: "}
            <Typography color={!!itemExpiringCount ? "error" : "inherit"} component="span">
              {itemExpiringCount}
            </Typography>
            {")"}
          </Box>
        </Grid>
        <Grid item container xs={6} justify="flex-end">
          <IconButton color="inherit" onClick={shareStashClicked}>
            <Badge badgeContent={1} color="secondary">
              <ShareIcon fontSize="small" />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={editStashClicked}>
            <EditIcon fontSize="small" />
          </IconButton>

          <IconButton color="inherit" onClick={deleteStashClicked}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Grid>
      </Grid>
    );
  };

  return (
    <Container maxWidth="md" className={classes.root}>
      <Card className={classes.card} ref={loaderRef}>
        <CardHeader className={classes.cardHeader} title={stash.name}></CardHeader>
        <CardSubHeader />
        <Description />
        <AddItemButton variant="top" />
        <ItemList itemList={items} />
        <AddItemButton variant="bottom" />
      </Card>
    </Container>
  );
}
