import React from 'react'
import { List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider, makeStyles, Button } from '@material-ui/core';
import api from '../utils/api';
import { useStateValue } from '../services/StateProvider';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  inline: {
    display: 'inline',
  }
}));

export default function Notifications({ invites, setInvites }) {

  const classes = useStyles();
  const [ {userGlobal}, dispatch ] = useStateValue();

  const reject = async (index) => {

    const deleteNotification = await api.delete('/invite', {
      headers: {
        index,
        userid: localStorage.getItem('userId')
      }
    });

    setInvites(deleteNotification.data.invites);
  };
  
  const accept = async (bandId, index, instrument) => {
    
    const acceptNotification = await api.get('/invite', {
      headers: {
        bandid: bandId,
        index,
        instrument,
        userId: localStorage.getItem('userId')
      }
    });

    dispatch({
      type: 'acceptInvite',
      acceptInvite: { acceptInvite: true}
    });

    setInvites(acceptNotification.data.invites);
  };

  return (
    <List dense={true} className={classes.root}>
      {invites.length > 0 ? (invites.map((invite, index) => (
        <div key={index}>

        <ListItem alignItems="flex-start">

          <ListItemAvatar>
            <Avatar alt={invite.bandName} src={require("../assets/patricia.jpeg")} />
          </ListItemAvatar>

          <ListItemText
            primary="Convite de banda"
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  className={classes.inline}
                  color="textPrimary"
                >
                  Você foi convidado para tocar {invite.instrument} na banda "{invite.bandName}"
                </Typography>
                <br />
                <Button onClick={() => accept(invite.bandId, index, invite.instrument)} color="primary">Aceitar</Button>
                <Button onClick={() => reject(index)} color="secondary">Rejeitar</Button>
              </React.Fragment>
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
