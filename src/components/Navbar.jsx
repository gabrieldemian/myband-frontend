
import React from 'react'
import { makeStyles, Toolbar, Hidden, AppBar, IconButton, Button, SwipeableDrawer, List, ListItem, ListItemText, Icon, Badge, Menu, MenuItem, Container } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';
import Notifications from './Notifications';

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
  { text: 'BANDAS', path: '/bands' },
  { text: 'MÚSICOS', path: '/musicians' },
  { text: 'MEU PERFIL', path: '/' }
];

export default function Navbar(props) {

  const [side, setSide] = React.useState(false);
  const [profileMenu, setProfileMenu] = React.useState(false);

  const [notifications, setNotifications] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [invites, setInvites] = React.useState([]);

  const classes = useStyles();

  const logoff = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('logged');
    props.history.push('/login');
    setProfileMenu(false);
  }

  React.useEffect(() => {

    const socket = io('http://localhost:3001', {
      query: { user: localStorage.getItem('userId')}
    });
    
    socket.on('notifications', notifications => {
      console.log('socket on notifications: ', notifications);
      setInvites(notifications);
    });

  }, [props.history.location.pathname, invites]);

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
      <MenuItem onClick={() => console.log('click')}>Minha Conta</MenuItem>
      <MenuItem onClick={logoff}>Deslogar</MenuItem>
    </Menu>
  );

  const renderNotifications = (
    <Menu anchorEl={anchorEl} onClose={() => setNotifications(false)} open={notifications}>
      <Notifications setInvites={setInvites} invites={invites}/>
    </Menu>
  )

  const handleProfileOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setProfileMenu(true)
  }

  const handleNotificationsOpen = (event) => {
    setAnchorEl(event.currentTarget);
    setNotifications(true)
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
                  <Badge badgeContent={invites.length} color="secondary">
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