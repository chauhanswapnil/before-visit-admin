import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import Button from '@material-ui/core/Button';

import { withRouter, Link } from "react-router-dom";

import * as ROUTES from '../../constants/routes';
import { Grid } from '@material-ui/core';

import './index.css';


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
}));

const Navigation = (props) => {
    const {children} = props;
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const setTitle = () => {
        if (props.location.pathname === ROUTES.HOME) {
            return 'Dashboard';
        }
        if (props.location.pathname === ROUTES.USERS) {
            return 'Users';
        }
        if (props.location.pathname === ROUTES.PLACES) {
            return 'Places';
        }
        if (props.location.pathname === ROUTES.CATEGORIES) {
            return 'Categories';
        }
        if (props.location.pathname === ROUTES.INTERESTS) {
            return 'Interests';
        }
        if (props.location.pathname === ROUTES.REVIEWS) {
            return 'Ratings & Reviews';
        }
        if (props.location.pathname === ROUTES.REQUESTS) {
            return 'New Business Requests';
        }
        if (props.location.pathname === ROUTES.FEEDBACK) {
            return 'Feedback';
        }
        if (props.location.pathname === ROUTES.ISSUES) {
            return 'Issues';
        }
        if (props.location.pathname === ROUTES.FAQ) {
            return 'FAQ';
        }
        if (props.location.pathname === ROUTES.ABOUTUS) {
            return 'About Us';
        }
        if (props.location.pathname.substring(0,10) === ROUTES.INTERESTS) {
            return 'Interests';
        }
        if (props.location.pathname.substring(0,11) === ROUTES.CATEGORIES) {
            return 'Categories';
        }
        if (props.location.pathname.substring(0,7) === ROUTES.PLACES) {
            return 'Places';
        }
        if (props.location.pathname.substring(0,4) === ROUTES.FAQ) {
            return 'FAQ';
        }
        console.log(props.location.pathname.substring(0,11));
    }

    const checkSelected = () => {
        if (props.location.pathname === ROUTES.HOME) {
            return [true, false, false,false,false,false,false,false,false,false,false];
        }
        if (props.location.pathname === ROUTES.USERS) {
            return [false, true, false,false,false,false,false,false,false,false,false];
        }
        if (props.location.pathname === ROUTES.PLACES) {
            return [false, false, true,false,false,false,false,false,false,false,false];
        }
        if (props.location.pathname === ROUTES.CATEGORIES) {
            return [false, false, false,true,false,false,false,false,false,false,false];
        }
        if (props.location.pathname === ROUTES.INTERESTS) {
            return [false, false, false,false,true,false,false,false,false,false,false];
        }
        if (props.location.pathname === ROUTES.REVIEWS) {
            return [false, false, false,false,false,true,false,false,false,false,false];
        }
        if (props.location.pathname === ROUTES.REQUESTS) {
            return [false, false, false,false,false,false,true,false,false,false,false];
        }
        if (props.location.pathname === ROUTES.FEEDBACK) {
            return [false, false, false,false,false,false,false,true,false,false,false];
        }
        if (props.location.pathname === ROUTES.ISSUES) {
            return [false, false, false,false,false,false,false,false,true,false,false];
        }
        if (props.location.pathname === ROUTES.FAQ) {
            return [false, false, false,false,false,false,false,false,false,true,false];
        }
        if (props.location.pathname === ROUTES.ABOUTUS) {
            return [false, false, false,false,false,false,false,false,false,false,true];
        }
        if (props.location.pathname.substring(0,10) === ROUTES.INTERESTS) {
            return [false, false, false,false,true,false,false,false,false,false,false];
        }
        if (props.location.pathname.substring(0,11) === ROUTES.CATEGORIES) {
            return [false, false, false,true,false,false,false,false,false,false,false];
        }
        if (props.location.pathname.substring(0,7) === ROUTES.PLACES) {
            return [false, false, true,false,false,false,false,false,false,false,false];
        }
        if (props.location.pathname.substring(0,4) === ROUTES.FAQ) {
            return [false, false, false,false,false,false,false,false,false,true,false];
        }
    }

    const goToPage = (index) => {
        if (index === 0) {
            return ROUTES.HOME;
        } else if ( index === 1) {
            return ROUTES.USERS;
        } else if ( index === 2) {
            return ROUTES.PLACES;
        } else if ( index === 3) {
            return ROUTES.CATEGORIES;
        } else if ( index === 4) {
            return ROUTES.INTERESTS;
        } else if ( index === 5) {
            return ROUTES.REVIEWS;
        } else if ( index === 6) {
            return ROUTES.REQUESTS;
        } else if ( index === 7) {
            return ROUTES.FEEDBACK;
        } else if ( index === 8) {
            return ROUTES.ISSUES;
        } else if ( index === 9) {
            return ROUTES.FAQ;
        } else if ( index === 10) {
            return ROUTES.ABOUTUS;
        }
    }

    return (
        <div className={classes.root}>
            <CssBaseline />
            
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
                })} >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, open && classes.hide)} >
                    <MenuIcon />
                    </IconButton>
                    <Grid container justify="flex-start" >
                    <Typography variant="h6">{setTitle()}</Typography>
                    </Grid>
                    <Grid  container justify="flex-end" >
                        <Button color="inherit" component={Link} className="appbar-link" to={ROUTES.ACCOUNT}>Account</Button>
                        <Button color="inherit" component={Link} className="appbar-link" >Logout</Button>
                    </Grid>
                </Toolbar>
            </AppBar>
      
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                paper: classes.drawerPaper,
                }} >

                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {['Dashboard','Users', 'Places', 'Categories', 'Interests', 'Ratings & Reviews', 'New Business Requests', 'Feedback', 'Issues', 'FAQ', 'About Us'].map((text, index) => (
                        <ListItem button key={text} selected={checkSelected()[index]} to={goToPage(index)} component={Link}>
                            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                ))}
                </List>
                {/* <Divider />
                <List>
                    {['All mail', 'Trash', 'Spam'].map((text, index) => (
                        <ListItem button key={text}>
                        <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                        <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List> */}
            </Drawer>

      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        {children} 
      </main>
    </div>
  );
};

export default withRouter(Navigation);