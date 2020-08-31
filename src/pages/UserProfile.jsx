import React, { useEffect } from 'react'
import api from '../utils/api';
import { makeStyles } from '@material-ui/styles';
import variables from '../utils/variables';
import { Container, Card, CardContent, Grid, Typography, Chip, Button, Icon, TextField, Tooltip } from '@material-ui/core';
import UserHasntBand from '../components/UserHasntBand';
import { useStateValue } from '../services/StateProvider';
import UserHasBand from '../components/UserHasBand';
import SelectInstruments from '../components/SelectInstruments';
import { toast } from 'react-toastify';
import { CircularProgress } from '@material-ui/core';
// import socket from '../utils/socket';
import { CSSTransition } from 'react-transition-group';
import changeAvatar from '../components/ChangeAvatar';

export default function UserProfile({ socket, socketConnected }) {

  const useStyles = makeStyles(theme => ({
    root: {
      marginTop: theme.spacing(4),
      padding: 0,
      textAlign: 'center',
      minHeight: 'calc(100vh - 70px)'
    },
    avatar: {
      width: 180,
      height: 180,
      objectFit: 'cover',
      borderRadius: '100%',
      display: 'block',
      margin: '0 auto',
      cursor: 'pointer'
    },
    avatarWrapper: {
      width: 'min-content',
      margin: 'auto',
      position: 'relative'
    },
    iconAvatar: {
      margin: '4px',
      cursor: 'pointer'
    },
    avatarCover: {
      backgroundColor: '#424242f2',
      width: '181px',
      height: '180px',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 2,
      borderRadius: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute'
    },
    title: {
      fontWeight: 'bold',
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
    },
    spinner: {
      position: 'absolute',
      top: 'calc(50% - 16px)',
      left: 'calc(50% - 16px)',
      zIndex: 99,
    },
    wrapper: {
      height: 'inherit',
      width: 'inherit'
    },
    mainCard: {
      position: 'relative',
      '&:before': {
        backgroundColor: '#424242ad',
        width: '100%',
        height: '100%',
        content: "''",
        top: 0,
        left: 0,
        zIndex: 2,
        position: 'absolute'
      }
    }
  }));

  const [editProfile, setEditProfile] = React.useState(false);
  const [user, setUser] = React.useState({});
  const [hoveringAvatar, setHoveringAvatar] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingAvatar, setLoadingAvatar] = React.useState(false);
  const [ { userGlobal }, dispatch ] = useStateValue();
  const [values, setValues] = React.useState({
    name: '',
    bio: '',    // valores temporários quando estiver editando campos
    instruments: []
  });


  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  async function loadUser(newUser = {}) {

    if (newUser.type !== 'avatar') setLoading(true);
    const u = await api.get('/user/' + localStorage.getItem('userId'));
    setUser(u.data);

    setValues({ ...values, instruments: u.data.instruments });

    setLoading(false);
    setLoadingAvatar(false);
    // if (newUser) console.log(newUser);
    if (newUser.sender) toast.success(newUser.msg);
  }

  useEffect(() => {

    // const socket = io(variables.serverURL, {
    //   query: { user: localStorage.getItem('userId')}
    // });

    console.log('user profile: ', socket, socketConnected);

    // if (!socketConnected) return;

    loadUser();

    socket.on('userUpdated', newUser => {
      console.log('socket on userUpdated: ', newUser);
      loadUser(newUser);
    });

    // return () => socket.close();

  }, [socket]);



  const updateBand = (band) => {
    console.log('updatting band: ', band)
    loadUser();
  }

  const editUser = async () => {
    console.log('values', values)
    if (user.band) {
      await api.put('/user/' + user._id, {
        bio: values.bio || user.bio,
        name: values.name || user.name,
        bandId: user.band._id,
        instruments: values.instruments.length === 0 ? user.instruments : values.instruments
      });
    } else {
      await api.put('/user/' + user._id, {
        bio: values.bio || user.bio,
        name: values.name || user.name,
        instruments: values.instruments.length === 0 ? user.instruments : values.instruments
      });
    }

    await loadUser();
  }

  const classes = useStyles();

  return (
    <Container maxWidth="lg">
      <div className={classes.root}>

        <Grid container spacing={8}>
          <Grid item md={6} xs={12}>
            <Card>
              {user.band
                ?
                <UserHasBand
                  creator={user._id === user.band.creator ? true : false}
                  userId={user._id}
                  bandId={user.band._id}
                  band={user.band}
                />
                :
                <UserHasntBand
                  userName={user.name}
                  updateBand={updateBand}
                  instruments={user.instruments}
                />
              }
            </Card>
          </Grid>

          <Grid item md={6} xs={12}>
            <Card style={{minHeight: loading ? '50vh' : ''}}>
              <CardContent className={loading ? classes.mainCard : ''}>
                {loading ?
                  <div className={classes.wrapper}>
                    <CircularProgress className={classes.spinner} color="primary" />
                  </div> : ''
                }
                <Container>
                  <div
                    className={classes.avatarWrapper}
                    onClick={() => setHoveringAvatar(!hoveringAvatar)}
                    onMouseEnter={() => setHoveringAvatar(true)}
                    onMouseLeave={() => setHoveringAvatar(false)}
                  >
                    <img
                      src={user.avatar ? user.avatar : require('../assets/defaultAvatar.png')}
                      className={classes.avatar}
                      alt="avatar"
                    />

                    <input
                      onChange={(event) => changeAvatar(event, setLoadingAvatar, loadUser)}
                      id="upload"
                      style={{ display: 'none' }}
                      type='file'
                      accept=".png, .jpg, .jpeg"
                    />

                    <CSSTransition
                      in={hoveringAvatar || loadingAvatar}
                      unmountOnExit
                      timeout={600}
                      classNames="fade-animation"
                    >
                      <div className={classes.avatarCover}>

                        {
                          loadingAvatar ?
                            <CircularProgress className={classes.spinner} color="primary" />
                            :
                            <Tooltip title='Trocar de foto' placement="top">
                              <label class="button" htmlFor="upload">
                                <Icon
                                  component="span"
                                  color="primary"
                                  className={classes.iconAvatar}
                                >
                                  photo_camera
                              </Icon>
                              </label>
                            </Tooltip>
                        }

                      </div>
                    </CSSTransition>
                  </div>

                  {editProfile
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
                          rows="4"
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
      </div>
    </Container>
  )
}
