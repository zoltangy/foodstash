import React, { useState, useRef } from "react";
import { Redirect, Link as RouterLink } from "react-router-dom";
import { useFirestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import { formatDistanceToNow } from "date-fns";
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
  Link,
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
import * as utils from "../../utils";
import ShareDialog from "../../components/ShareDialog";
import Loader from "../../components/Loader";

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
  backLink: {
    marginLeft: theme.spacing(2),
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
      orderBy: ["name", "asc"],
    },
  ]);
  const stash = useSelector((state) => state.firestore.data[stashId]);
  const items = useSelector((state) => state.firestore.ordered[`${stashId}-items`]);
  const profile = useSelector((state) => state.firebase.profile);
  const dispatch = useDispatch();
  const dialog = useDialog();
  const loader = useLoader();
  const loaderRef = useRef();
  const [formRef, setFormRef] = useState(null);
  const [shareDialogToggle, setShareDialogToggle] = useState(false);

  if (!isLoaded(stash) || !isLoaded(items) || !isLoaded(profile)) {
    return <Loader open={true} />;
  } else {
    if (isEmpty(stash)) {
      return (
        <Redirect
          to={{
            pathname: "/",
          }}
        />
      );
    }
  }

  let itemCount = utils.getItemCount(items, profile.expiry);

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
        await dispatch(deleteStash(stashId));
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

  const shareStashClicked = () => {
    setShareDialogToggle(!shareDialogToggle);
  };

  const formSubmitAdd = (values) => {
    dispatch(addItem({ stashId, ...values }));
    setFormRef(null);
  };

  const ItemList = ({ itemList }) => {
    return (
      <Grid container spacing={0}>
        {itemList.length > 0 ? (
          <>
            <Grid item xs={12}>
              <Divider variant="middle" />
            </Grid>

            {itemList.map((item) => (
              <StashItem
                key={item.id}
                stashId={stashId}
                item={item}
                formRef={formRef}
                setFormRef={setFormRef}
              />
            ))}
          </>
        ) : null}
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
            <Button color="primary" startIcon={<AddIcon />} onClick={() => setFormRef(variant)}>
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
        <Grid item container xs={7}>
          <Box ml={3} width="100%">
            <Typography component="span" variant="subtitle2">
              Last modified:
            </Typography>
            <Typography color="textSecondary" component="span" variant="subtitle2">
              {" " + formatDistanceToNow(stash.lastModified.toDate(), { addSuffix: true })}
            </Typography>
          </Box>
          <Box ml={3}>
            <Typography component="span" variant="subtitle2">
              Total items:
            </Typography>
            <Typography color="textSecondary" component="span" variant="subtitle2">
              {" " + itemCount.total}
            </Typography>
            <br />
            <Typography component="span" variant="subtitle2">
              Expiring items:
            </Typography>
            <Typography
              color={!!itemCount.expiring ? "error" : "textSecondary"}
              variant="subtitle2"
              component="span"
            >
              {" " + itemCount.expiring}
            </Typography>
          </Box>
        </Grid>
        <Grid item container xs={5} justify="flex-end">
          <IconButton color="inherit" onClick={shareStashClicked} aria-label="Share stash">
            <Badge badgeContent={stash.users.length - 1} color="primary">
              <ShareIcon fontSize="small" />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={editStashClicked} aria-label="Edit stash">
            <EditIcon fontSize="small" />
          </IconButton>

          <IconButton color="inherit" onClick={deleteStashClicked} aria-label="Delete stash">
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Grid>
      </Grid>
    );
  };

  const Description = () => {
    return (
      <Grid container className={classes.description}>
        <Box px={3} pb={1}>
          <Typography component="span" variant="subtitle2">
            Description:
          </Typography>
          <Typography color="textSecondary" component="span" variant="subtitle2">
            {" " + stash.description}
          </Typography>
        </Box>
      </Grid>
    );
  };

  return (
    <Container maxWidth="md" className={classes.root}>
      <Link component={RouterLink} variant="subtitle2" to="/" className={classes.backLink} color="inherit">
        &lt; Back
      </Link>
      <Card className={classes.card} ref={loaderRef}>
        <CardHeader className={classes.cardHeader} title={stash.name}></CardHeader>
        <CardSubHeader />
        <Description />
        <AddItemButton variant="top" />
        <ItemList itemList={items} />
        {items.length > 2 && <AddItemButton variant="bottom" />}
      </Card>
      <ShareDialog openToggle={shareDialogToggle} stashId={stashId} />
    </Container>
  );
}
