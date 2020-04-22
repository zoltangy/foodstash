import React from "react";
import { Backdrop } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  loader: {
    display: "inline-block",
    width: "80px",
    height: "80px",
    "&::after": {
      content: "' '",
      display: "block",
      width: "70px",
      height: "70px",
      margin: "1px",
      borderRadius: "50%",
      border: "5px solid #000",
      borderColor: "#000 transparent #000 transparent",
      animation: "$loaderAnim 1.2s linear infinite",
    },
  },
  backdrop: {
    zIndex: 2000,
    color: "#fff",
  },

  "@keyframes loaderAnim": {
    from: {
      transform: "rotate(0deg)",
    },
    to: {
      transform: "rotate(360deg)",
    },
  },
}));

export default function Loader({ open }) {
  const classes = useStyles();
  return (
    <Backdrop className={classes.backdrop} open={open}>
      <div className={classes.loader}></div>
    </Backdrop>
  );
}
