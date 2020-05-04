import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    }      
}));

function HideOnScroll(props) {
  const { children, window } = props;
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};


export default function Navbar(props) {
  const classes = useStyles();

    return (
    <Fragment>
        <CssBaseline />
        <HideOnScroll {...props}>
            <div className={classes.root} style={{marginBottom: '5%'}}>
                <AppBar>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="open drawer"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography className={classes.title} variant="h5" noWrap>
                            <a href="/" style={{textDecoration: "none", color: "white"}}>Criptocoins</a>
                        </Typography>
                        
                        <Typography className={classes.title} variant="h6" noWrap>
                            <a href="/top5" style={{textDecoration: "none", color: "white"}}>Top 5</a>
                        </Typography>
                        <Typography className={classes.title} variant="h6" noWrap>
                        <a href="/top20" style={{textDecoration: "none", color: "white"}}>Top 20</a>
                        </Typography>
                    </Toolbar>
                </AppBar>
            </div>
        </HideOnScroll>
    </Fragment>
    );
}