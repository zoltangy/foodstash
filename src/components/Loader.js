import React from "react";
import { makeStyles } from "@material-ui/core/styles";

//TODO: center on page
const useStyles = makeStyles((theme) => ({
  loader: {
    display: "inline-block",
    width: "40px",
    height: "40px",
    "&::after": {
      content: "' '",
      display: "block",
      width: "30px",
      height: "30px",
      margin: "1px",
      borderRadius: "50%",
      border: "5px solid #000",
      borderColor: "#000 transparent #000 transparent",
      animation: "$loaderAnim 1.2s linear infinite",
    },
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

export default function Loader() {
  const classes = useStyles();
  return <div className={classes.loader}></div>;
}
