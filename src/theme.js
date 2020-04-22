import { createMuiTheme } from "@material-ui/core/styles";
import lightGreen from "@material-ui/core/colors/lightGreen";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: lightGreen[500],
    },
  },
  typography: {
    caption: {
      fontSize: "0.75rem",
      fontStyle: "italic",
    },
  },
});

export default theme;
