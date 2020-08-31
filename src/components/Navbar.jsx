
import React, { useState, useEffect } from 'react'
import { makeStyles, Toolbar, Hidden, AppBar, IconButton, Button, SwipeableDrawer, List, ListItem, ListItemText, Icon, Badge, Menu, MenuItem, Container } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';
import Notifications from './Notifications';
import api from '../utils/api';
// import socket from '../utils/socket';

const useStyles = makeStyles(theme => ({
  button: {
    marginRight: theme.spacing(2)
  },
  logo: {
    marginRight: theme.spacing(5)
  },
  end: {
    marginLeft: 'auto',
  },
  sideNav: {
    width: 250,
    [theme.breakpoints.down('xs')]: {
      width: 180
    }
  }
}));

const buttons = [
  // { text: 'BANDAS', path: '/bands' },
  { text: 'MÚSICOS', path: '/musicians' },
  { text: 'MEU PERFIL', path: '/' }
];

export default function Navbar(props) {

  const [side, setSide] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [openNotificationMenu, setOpenNotificationMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  const classes = useStyles();

  async function getNotifications() {

    if (localStorage.getItem('userId')) {
      const u = await api.get('/notification/' + localStorage.getItem('userId'));
      if (u.data.success) setNotifications(u.data.notifications);
      else return
    }
  }

  const logoff = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    props.history.push('/login');
    setProfileMenu(false);
  }

  useEffect(() => {

    // console.log('socket?', props.socket.query)

    if (!props.socketConnected) return;

    getNotifications();

    console.log('socket?', props.socket.query)
    console.log('getting socket?', props.socket, props.socketConnected);

    props.socket.on('notify', data => {
      console.log('on notify', data);
      setNotifications(data);
    });

  }, [props.socket]);
  

  const toggleDrawer = (open) => event => {

    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setSide(open);
  };


  const sideNav = () => (
    <div
      className={classes.sideNav}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {buttons.map((item, index) => (

          <Link to={item.path} key={index} style={{ color: 'white' }}>
            <ListItem button>
              <ListItemText>
                {item.text}
              </ListItemText>
            </ListItem>
          </Link>

        ))}
      </List>
    </div>
  );

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={profileMenu}
      onClose={() => setProfileMenu(false)}
    >
      {/* <MenuItem onClick={() => console.log('click')}>Minha Conta</MenuItem> */}
      <MenuItem onClick={logoff}>Deslogar</MenuItem>
    </Menu>
  );

  const renderNotifications = (
    <Menu anchorEl={anchorEl} onClose={() => setOpenNotificationMenu(false)} open={openNotificationMenu}>
      <Notifications getNotifications={getNotifications} notifications={notifications} setOpenNotificationMenu={setOpenNotificationMenu} />
    </Menu>
  )

  const handleProfileOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setProfileMenu(true)
  }

  const handleNotificationsOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenNotificationMenu(true)
  }

  return (
    props.location.pathname !== '/login' ? (
      <>
        <AppBar className={classes.appBar} position="static">
          <Container maxWidth="lg">
            <Toolbar variant="dense">

              <IconButton
                onClick={toggleDrawer(true)}
                className={classes.button}
                color="inherit"
                aria-label="menu"
              >

                <MenuIcon />

              </IconButton>

              <SwipeableDrawer
                open={side}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
              >
                {sideNav()}
              </SwipeableDrawer>

              <Hidden only={['xs']}>

                {buttons.map((button, index) => (
                  <Link to={button.path} key={index}>
                    <Button className={classes.button}>
                      {button.text}
                    </Button>
                  </Link>
                ))}

              </Hidden>

              <div className={classes.end}>

                <IconButton onClick={handleNotificationsOpen} aria-label="notifications" color="inherit">
                  <Badge badgeContent={notifications.length} color="secondary">
                    <Icon>notifications_icon</Icon>
                  </Badge>
                </IconButton>

                {renderNotifications}
                {renderMenu}

                <IconButton
                  edge="end"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  onClick={handleProfileOpen}
                  color="inherit"
                >
                  <Icon>account_circle</Icon>
                </IconButton>
              </div>
            </Toolbar>
          </Container>
        </AppBar>

      </>
    ) : ''
  )
}