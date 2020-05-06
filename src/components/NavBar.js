import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
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
  Divider,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import { useReactPWAInstall } from "react-pwa-install";

import { signOut } from "../store/actions/authActions";
import logo from "../assets/logo.png";
import icon from "../assets/icon.png";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    marginBottom: 20,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  installButton: {
    marginRight: theme.spacing(4),
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
  installMenuItem: {
    borderTop: "1px solid",
    borderTopColor: theme.palette.text.primary,
  },
}));

export default function NavBar(props) {
  const classes = useStyles();
  const history = useHistory();

  const auth = useSelector((state) => isLoaded(state.firebase.auth) && !isEmpty(state.firebase.auth));
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const { pwaInstall, supported, isInstalled } = useReactPWAInstall();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleInstallClicked = () => {
    handleClose();
    pwaInstall({
      title: "Install FoodStash",
      logo: icon,
      features: (
        <ul style={{ paddingLeft: "20px" }}>
          <li>Organize your food storage</li>
          <li>Get reminded when items are expiring</li>
          <li>Customize how much in advance to get notified</li>
          <li>Share stashes with family or roommates</li>
          <li>The app works offline</li>
        </ul>
      ),
      description:
        "Never wonder again what you have in your pantry, freezer or cellar! Never let food go to waste again, because you missed the expiration date. ",
    })
      .then()
      .catch();
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
                {supported() && !isInstalled() && (
                  <Button
                    color="inherit"
                    className={classes.installButton}
                    onClick={handleInstallClicked}
                    variant="outlined"
                  >
                    Install App
                  </Button>
                )}
                <Button
                  color="inherit"
                  className={classes.menuButton}
                  onClick={() => {
                    history.push("/");
                  }}
                >
                  Home
                </Button>
                <Button
                  color="inherit"
                  className={classes.menuButton}
                  onClick={() => {
                    history.push("/profile");
                  }}
                >
                  Profile
                </Button>
                <Button
                  color="inherit"
                  className={classes.menuButton}
                  onClick={() => {
                    dispatch(signOut());
                  }}
                >
                  Log out
                </Button>
              </Hidden>
              <Hidden smUp>
                <IconButton
                  edge="end"
                  className={classes.menuButton}
                  color="inherit"
                  aria-haspopup="true"
                  aria-label="menu"
                  aria-controls="navigation-menu"
                  onClick={(event) => setAnchorEl(event.currentTarget)}
                >
                  <MenuIcon />
                </IconButton>
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
                  id="navigation-menu"
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
                  {supported() && !isInstalled() && (
                    <MenuItem
                      className={(classes.menuItem, classes.installMenuItem)}
                      onClick={handleInstallClicked}
                    >
                      <Divider />
                      <ListItemText primary="Install App" />
                    </MenuItem>
                  )}
                </Menu>
              </Hidden>
            </>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
}
