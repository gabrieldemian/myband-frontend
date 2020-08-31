import React from 'react'
import { List, ListItem, ListItemText, Typography, Divider, makeStyles, Button } from '@material-ui/core';
import api from '../utils/api';
import { toast } from 'react-toastify';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  },
  notificationTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1)
  }
}));

export default function Notifications({ notifications, getNotifications, setOpenNotificationMenu }) {

  const classes = useStyles();

  const reject = async (index) => {

    await api.delete('/notification', {
      headers: {
        index,
        userid: localStorage.getItem('userId')
      }
    });

    getNotifications();
  };
  
  const accept = async (bandId, index, instrument) => {
    
    const acceptNotification = await api.get('/notification', {
      headers: {
        bandid: bandId,
        index,
        instrument,
        userId: localStorage.getItem('userId')
      }
    });

    if (acceptNotification.data.success) {

      setOpenNotificationMenu(false);
      getNotifications();
      toast.success('Parabéns, você entrou na banda!')

    } else {

      toast.error(acceptNotification.data.msg)
    }

    
  };

  return (
    <List dense={true} className={classes.root}>
      {notifications.length > 0 ? (notifications.map((notification, index) => (
        <div key={index}>

        <ListItem>

          <ListItemText
            primary={
              <>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  <Typography className={classes.notificationTitle}>Convite de banda</Typography>
                  {notification.description}
                </Typography>
                <br />
                {notification.type === 'band' ?
                  <Button onClick={() => accept(notification.bandId, index, notification.instrument)} color="primary">Aceitar</Button>:
                  ''
                }
                <Button onClick={() => reject(index)} color="secondary">{notification.type === 'band' ? 'Rejeitar' : 'Fechar'}</Button>
              </>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        </div>
      ))) : (
        <ListItem>
          <ListItemText>
            Você ainda não tem notificações
          </ListItemText>
        </ListItem>
      )}
    </List>
  )
}
