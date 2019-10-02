import React, { useEffect } from 'react'
import api from '../utils/api';
import { makeStyles } from '@material-ui/styles';
import { Container, Card, CardContent, Grid, Typography, Chip, Button, Icon, TextField } from '@material-ui/core';
import UserHasntBand from '../components/UserHasntBand';
import UserHasBand from '../components/UserHasBand';
import { useStateValue } from '../services/StateProvider';
import SelectInstruments from '../components/SelectInstruments';

export default function UserProfile() {

  const useStyles = makeStyles(theme => ({
    root: {
      marginTop: theme.spacing(4),
      textAlign: 'center'
    },
    avatar: {
      width: 180,
      borderRadius: '100%',
      display: 'block',
      margin: '0 auto'
    },
    title: {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(1)
    },
    subtitle: {
      marginBottom: theme.spacing(1),
      marginTop: theme.spacing(3)
    },
    chip: {
      margin: 3,
    },
    icon: {
      marginRight: theme.spacing(1)
    },
    button: {
      marginTop: theme.spacing(4)
    }
  }));

  const [editProfile, setEditProfile] = React.useState(false);
  const [user, setUser] = React.useState({});
  const [ {userGlobal}, dispatch ] = useStateValue();
  const [values, setValues] = React.useState({
    name: user.name,
    bio: user.bio,
    instruments: []
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };
  
  useEffect(() => {
    
    async function loadUser() {

      const u = await api.get('/user/' + localStorage.getItem('userId'));
      setUser(u.data);
      setValues({...values, instruments: u.data.instruments});
    }

    loadUser();

    return () => setUser({});
    
  }, [userGlobal]);
  
  const updateBand = (band) => {
    console.log('updatting band: ', band)
    setUser({...user, band: band});
  }

  const editUser = async () => {

    await api.put('/user/' + user._id, {
      bio: values.bio || user.bio,
      name: values.name || user.name,
      instruments: values.instruments.length === 0 ? user.instruments : values.instruments
    });

    dispatch({
      type: 'acceptInvite',
      acceptInvite: { acceptInvite: true}
    });
  
  }

  const classes = useStyles();

  return (
    <Container maxWidth="lg">
      <div className={classes.root}>
        <CardContent>
          <Grid container spacing={8}>
            <Grid item md={6} xs={12}>
              <Card>
                {user.band !== undefined
                  ?
                  <UserHasBand
                  band={user.band}
                  creator={user._id === user.band.creator ? true : false}
                  bandId={user.band._id}
                  />
                  :
                  <UserHasntBand
                    updateBand={updateBand}
                    userName={user.name}
                    instruments={user.instruments}
                  />
                }
              </Card>
                {/* {console.log('creator or not', user._id === user.band.creator ? true : false)} */}
            </Grid>

            {/* {console.log('USER', user)} */}

            <Grid item md={6} xs={12}>
              <Card>
                <CardContent>
                  <Container>
                    <img src={require('../assets/patricia.jpeg')} className={classes.avatar} alt="avatar" />

                    { editProfile
                      ?
                      <>
                        <TextField
                          margin="normal"
                          required
                          defaultValue={user.name}
                          onChange={handleChange('name')}
                          label="Nome"
                        />
                        <TextField
                          fullWidth
                          margin="normal"
                          required
                          multiline
                          rows="2"
                          defaultValue={user.bio}
                          onChange={handleChange('bio')}
                          label="Sobre você"
                        />
                          
                        <SelectInstruments
                          instruments={values.instruments}
                          handleChange={handleChange('instruments')}
                        />
                      </>
                      :
                      <>
                        <Typography variant="h4" className={classes.title}>{user.name}</Typography>
                        <Typography>{user.bio}</Typography>
                        <Typography variant="h5" className={classes.subtitle}>Seus instrumentos</Typography>
                        {user.instruments !== undefined ? (user.instruments.map((instrument, index) => (
                          <Chip
                            key={index}
                            label={instrument}
                            className={classes.chip}
                            color="primary"
                          />
                        ))) : null}
                      </>
                    }

                    <br />

                    <Button className={classes.button} color="primary" onClick={() => {
                      setEditProfile(!editProfile);
                      if (editProfile) {
                        editUser();
                      }
                    }}>
                      <Icon className={classes.icon}>{editProfile ? 'done' : 'edit'}</Icon>
                      {editProfile ? 'Salvar' : 'Editar perfil'}
                    </Button>

                  </Container>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

        </CardContent>
      </div>
    </Container>
  )
}
