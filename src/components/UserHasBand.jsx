import React from 'react'
import api from '../utils/api';
import { Typography, CardContent, makeStyles, Container, Grid, Button, Icon, TextField, Chip, Tooltip  } from '@material-ui/core'
import { toast } from 'react-toastify';
import { CircularProgress } from '@material-ui/core';
import { CSSTransition } from 'react-transition-group';
import InviteMusicians from './InviteMusicians';
import DeleteIntegrant from './DeleteIntegrant';

const useStyles = makeStyles(theme => ({
  avatar: {
    width: 70,
    height: 70,
    objectFit: 'cover',
    borderRadius: '100%',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    cursor: 'pointer'
    },
  avatarCover: {
    backgroundColor: '#424242f2',
    width: '72px',
    height: '71px',
    top: '35px',
    left: '14px',
    zIndex: 2,
    borderRadius: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute'
  },
  bio: {
    marginTop: theme.spacing(4)
  },
  integrantTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1)
  },
  integrant: {
    width: 100,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative'
  },
  icon: {
    marginRight: theme.spacing(1)
  },
  iconAvatar: {
    margin: '4px',
    cursor: 'pointer'
  },
  button: {
    marginTop: theme.spacing(4),
    marginRight: theme.spacing(1)
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

export default function UserHasBand ({ bandId, creator, userId, band }) {

  const classes = useStyles();
  const [editBand, setEditBand] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [openDialog, setOpenDialog] = React.useState(false)
  const [integrantToDelete, setIntegrantToDelete] = React.useState()
  const [avatarHover, setAvatarHover] = React.useState()
  const [values, setValues] = React.useState({
    name: '',
    bio: '',
    integrants: []
  });

  const onCloseDialog = () => {
    setOpenDialog(false);
  }

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const submitBand = async () => {

    setLoading(true);

    await api.put('/band/' + bandId, {
      name: values.name || band.name,
      bio: values.bio || band.bio
    });

    setLoading(false);
    
    toast.success('Banda atualizada')

  };

  const inviteMusicians = () => {
    setOpenDialog(true);
  }

  const isLeaderOrMember = (index, avatarHover, creator, integrantId, userId) => {
    if (creator) {
      // band leader true. Only he can see all other members options
      return index === avatarHover && creator
    } else {
      // common member. He can see only his details
      return index === avatarHover && integrantId === userId 
    }
  }

  return (
    <CardContent className={loading ? classes.mainCard : ''}>

      {loading ?
        <div className={classes.wrapper}>
          <CircularProgress className={classes.spinner} color="primary"/>
        </div> : ''
      }

      <Typography variant="h5">
        Você é {creator ? 'líder' : 'membro'} da banda
      </Typography>

      {
        editBand ?
        <TextField
          margin="normal"
          required
          defaultValue={band.name}
          onChange={handleChange('name')}
          label="Nome"
        />
        :
        <Typography variant="h4" gutterBottom>
          {band.name}!
        </Typography>
      }


      <Container maxWidth="xs">
        <Grid container justify="center" spacing={3}>

          {band.integrants.map((integrant, index) => (
            <Grid onMouseEnter={(e) => setAvatarHover(index)} onMouseLeave={(e) => setAvatarHover(null)} item key={index} className={classes.integrant}>

              <img src={integrant.avatar ? integrant.avatar : require('../assets/defaultAvatar.png')} className={classes.avatar} alt="avatar" />

              <CSSTransition    // líder
                // index === avatarHover && creator
                in={ isLeaderOrMember(index, avatarHover, creator, integrant._id, userId) }
                unmountOnExit
                timeout={600}
                classNames="fade-animation"
              >
                <div className={classes.avatarCover}>

                {/* <Tooltip title="Editar membro" placement="right">
                  <Icon color="primary" className={classes.iconAvatar}>edit</Icon>
                </Tooltip> */}

                <Tooltip title={ creator && integrant._id === userId ? 'Deletar banda' : creator ? 'Expulsar da banda' : 'Sair da banda' } placement="right">
                  <Icon onClick={() => setIntegrantToDelete(integrant)} color="primary" className={classes.iconAvatar}>delete</Icon>
                </Tooltip>

                <DeleteIntegrant
                  context={creator && integrant._id === userId ? 'CreatorLeave' : creator ? 'CreatorBan' : 'MemberLeave'}
                  integrantToDelete={integrantToDelete}
                  setIntegrantToDelete={setIntegrantToDelete}
                />

                </div>
              </CSSTransition>

              <Typography className={classes.integrantTitle}>{integrant.name}</Typography>
              <Chip
                label={integrant.instrument}
                color="primary"
              />
            </Grid>
          ))}

        </Grid>
      </Container>

      {
        editBand ?
        <TextField
          margin="normal"
          required
          fullWidth
          multiline
          rows="3"
          defaultValue={band.bio}
          onChange={handleChange('bio')}
          label="Biografia da banda"
        />
        :
        <Typography className={classes.bio}>
          {band.bio}
        </Typography>

      }

      <br />

     { creator ?<>
      <Button className={classes.button} color="primary" onClick={() => {
        setEditBand(!editBand);
        if (editBand) {
          submitBand();
        }
      }}>

        <Icon className={classes.icon}>{editBand ? 'done' : 'edit'}</Icon>
        {editBand ? 'Salvar' : 'Editar banda'}
      </Button>

      <Button className={classes.button} color="primary" onClick={() => inviteMusicians()}>
        <Icon className={classes.icon}>person_add</Icon>
        Convidar músico
      </Button>
      
      <InviteMusicians
        band={band}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
        onCloseDialog={onCloseDialog}
      />
      
      </>
      : null
     }

    </CardContent>
  )
}
