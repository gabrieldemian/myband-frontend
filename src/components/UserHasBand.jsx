import React from 'react'
import api from '../utils/api';
import { Typography, CardContent, makeStyles, Container, Grid, Button, Icon, TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  avatar: {
    width: 70,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1)
  },
  bio: {
    marginTop: theme.spacing(4)
  },
  integrant: {
    width: 100
  },
  icon: {
    marginRight: theme.spacing(1)
  },
  button: {
    marginTop: theme.spacing(4)
  }
}));

export default function UserHasBand ({ bandId, creator }) {

  const classes = useStyles();
  const [band, setBand] = React.useState({integrants: []});
  const [editBand, setEditBand] = React.useState(false);
  const [values, setValues] = React.useState({
    name: '',
    bio: '',
    integrants: []
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  React.useEffect(() => {

    async function getBand () {
      const b = await api.get('/band/' + bandId);
      console.log('getBand useeffect: ', bandId);
      setBand(b.data);
    }

    getBand();

    return () => {
      setBand({});
    };
  }, []);

  const submitBand = async () => {
    console.log('new values: ', values);

    await api.put('/band/' + bandId, {
      name: values.name || band.name,
      bio: values.bio || band.bio,
      integrants: values.integrants.length === 0 ? band.integrants : values.integrants
    });

    const b = await api.get('/band/' + bandId);
    setBand(b.data);
  };

  return (
    <CardContent>
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
            <Grid item key={index} className={classes.integrant}>
              <img src={require('../assets/defaultAvatar.png')} className={classes.avatar} alt="avatar" />
              <Typography>{integrant.name}</Typography>
              <Typography>{integrant.instrument}</Typography>
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

     { creator ?
      <Button className={classes.button} color="primary" onClick={() => {
        setEditBand(!editBand);
        if (editBand) {
          submitBand();
        }
      }}>

        <Icon className={classes.icon}>{editBand ? 'done' : 'edit'}</Icon>
        {editBand ? 'Salvar' : 'Editar banda'}
      </Button>
      : null
     }

    </CardContent>
  )
}
