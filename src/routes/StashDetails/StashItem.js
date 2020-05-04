import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography, Box, Divider, IconButton } from "@material-ui/core";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditIcon from "@material-ui/icons/Edit";
import { modifyItem, deleteItem } from "../../store/actions/stashActions";
import { useDialog } from "../../components/DialogContext";
import StashItemForm from "./StashItemForm";
import { isExpiring } from "../../utils";

const useStyles = makeStyles((theme) => ({
  itemName: {
    wordBreak: "break-word",
  },
}));

export default function Item({ item, stashId, formRef, setFormRef }) {
  const classes = useStyles();
  const profile = useSelector((state) => state.firebase.profile);
  const dispatch = useDispatch();
  const dialog = useDialog();

  const decrease = () => {
    if (item.amount === 1) {
      dialog({
        variant: "confirm",
        catchOnCancel: true,
        title: "Delete item?",
        description: "Are you sure you want to delete this item?",
        buttonOK: "Delete",
        buttonNOK: "Cancel",
      })
        .then(() => {
          dispatch(deleteItem({ stashId, itemId: item.id }));
        })
        .catch();
    } else {
      dispatch(
        modifyItem({
          stashId,
          itemId: item.id,
          amount: item.amount - 1,
        })
      );
    }
  };

  const increase = () => {
    dispatch(
      modifyItem({
        stashId,
        itemId: item.id,
        amount: item.amount + 1,
      })
    );
  };

  const formSubmitUpdate = (values) => {
    dispatch(modifyItem({ stashId, itemId: item.id, ...values }));
    setFormRef(null);
  };

  return (
    <>
      {formRef !== item.id ? (
        <Grid item xs={12} container alignItems="center">
          <Grid item xs={6} sm={8} md={9}>
            <Box ml={3}>
              <Typography variant="h6" component="p" className={classes.itemName}>
                {item.name}
              </Typography>
            </Box>
            <Box ml={5}>
              <Typography
                variant="caption"
                color={isExpiring(item.expiration, profile.expiry) ? "error" : "initial"}
              >
                {item.expiration
                  ? "Exp.: " + formatDistanceToNow(item.expiration.toDate(), { addSuffix: true })
                  : "Exp.: -"}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={4} sm={3} md={2}>
            <IconButton aria-label="decrease amount" color="inherit" onClick={() => decrease(item.id)}>
              <ExpandMoreIcon />
            </IconButton>
            {item.amount}
            <IconButton aria-label="increase amount" color="inherit" onClick={() => increase(item.id)}>
              <ExpandLessIcon />
            </IconButton>
          </Grid>
          <Grid item xs={2} sm={1} md={1}>
            <IconButton
              aria-label="edit item"
              color="inherit"
              edge="end"
              onClick={() => {
                setFormRef(item.id);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Grid>
        </Grid>
      ) : (
        <StashItemForm
          initialValues={{
            name: item.name,
            amount: item.amount,
            expiration: item.expiration ? item.expiration.toDate() : null,
          }}
          onSubmitFunc={formSubmitUpdate}
          onCancelFunc={() => {
            setFormRef(null);
          }}
        />
      )}
      <Grid item xs={12}>
        <Divider variant="middle" />
      </Grid>
    </>
  );
}
