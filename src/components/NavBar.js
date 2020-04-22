import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { signOut } from "../store/actions/authActions";
import { isLoaded, isEmpty } from "react-redux-firebase";
import {
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  ListItemText,
  Hidden,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import logo from "../assets/logo.png";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: 20,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  menuItem: {
    paddingRight: theme.spacing(5),
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}));

export default function NavBar(props) {
  const classes = useStyles();
  const history = useHistory();

  const auth = useSelector((state) => isLoaded(state.firebase.auth) && !isEmpty(state.firebase.auth));
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
          <Typography variant="h6" className={classes.title}></Typography>

          {!auth && (
            <>
              <Button
                color="inherit"
                onClick={() => {
                  history.push("/signup");
                }}
              >
                Sign Up
              </Button>

              <Button
                color="inherit"
                onClick={() => {
                  history.push("/signin");
                }}
              >
                Login
              </Button>
            </>
          )}
          {auth && (
            <>
              <Hidden xsDown>
                <Button
                  color="inherit"
                  className={classes.menuButton}
                  onClick={() => {
                    history.push("/stashlist");
                  }}
                >
                  My Stashes
                </Button>
              </Hidden>
              <IconButton
                edge="end"
                className={classes.menuButton}
                color="inherit"
                aria-haspopup="true"
                aria-label="menu"
                onClick={(event) => setAnchorEl(event.currentTarget)}
              >
                <MenuIcon />
              </IconButton>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Menu
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          className={classes.menuItem}
          onClick={() => {
            handleClose();
            history.push("/");
          }}
        >
          <ListItemText primary="Home" />
        </MenuItem>
        <Hidden smUp>
          <MenuItem
            className={classes.menuItem}
            onClick={() => {
              handleClose();
              history.push("/stashlist");
            }}
          >
            <ListItemText primary="My Stashes" />
          </MenuItem>
        </Hidden>
        <MenuItem
          className={classes.menuItem}
          onClick={() => {
            handleClose();
            history.push({ pathname: "/profile" });
          }}
        >
          <ListItemText primary="Profile" />
        </MenuItem>
        <MenuItem
          className={classes.menuItem}
          onClick={() => {
            handleClose();
            dispatch(signOut());
          }}
        >
          <ListItemText primary="Log out" />
        </MenuItem>
      </Menu>
    </div>
  );
}
