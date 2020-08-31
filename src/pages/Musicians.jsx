import React, { useEffect } from 'react'
import { makeStyles, Grid, Container, Card, CardContent, Typography, Chip, FormControl, TextField, Input, Select, MenuItem, InputLabel, CircularProgress } from '@material-ui/core'
import api from '../utils/api';
import { instruments } from '../utils/instruments';

const useStyles = makeStyles(theme => ({
  wrapper: {
    marginTop: theme.spacing(4),
    minHeight: 'calc(100vh - 70px)'
  },
  title: {
    marginBottom: theme.spacing(3)
  },
  card: {
    padding: theme.spacing(4),
    minHeight: '65vh'
  },
  chip: {
    margin: theme.spacing(0.5)
  },
  avatar: {
    width: 130,
    height: 130,
    objectFit: 'cover',
    borderRadius: '100%',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    cursor: 'pointer'
  },
  bio: {
    marginTop: theme.spacing(2)
  },
  integrantTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1)
  },
  integrant: {
    // width: 300,
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative'
  },
  spinner: {
    position: 'absolute',
    top: 'calc(50% - 16px)',
    left: 'calc(50% - 16px)',
    zIndex: 99,
    '@media (max-width: 600px)': {
      position: 'fixed',
      top: '50vh'
    }
  },
  spinnerWrapper: {
    height: 'inherit',
    width: 'inherit'
  },
  cardLoading: {
    position: 'relative',
    minHeight: '65vh',
    padding: theme.spacing(4),
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

export default function Musicians() {

  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [values, setValues] = React.useState({
    name: '',
    instruments: []
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const loadMusicians = async () => {

    setLoading(true);
    const u = await api.post('/users/', { query: values, id: localStorage.getItem('userId') });
    setUsers(u.data.users);
    setLoading(false);
  }

  const classes = useStyles();

  useEffect(() => {
    
    loadMusicians();

  }, [values]);

  return (
    <div className={classes.wrapper}>
      <Container maxWidth="lg">
        <Card className={loading ? classes.cardLoading : classes.card}>
          <CardContent>

          {loading ?
            <div className={classes.spinnerWrapper}>
              <CircularProgress className={classes.spinner} color="primary" />
            </div> : ''
          }

            <Typography className={classes.title} variant="h4">Listagem de músicos</Typography>

            {/* FILTERS */}

            <Grid container lg={12} spacing={3}>
              <Grid item xs={12} sm={6} md={6} lg={3}>
                <TextField
                  name="name"
                  onChange={handleChange('name')}
                  fullWidth
                  type="text"
                  label="Nome"
                />
              </Grid>

              <Grid item xs={12} sm={6} md={6} lg={3}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="select-multiple-chip">Instrumentos</InputLabel>

                  <Select
                    multiple
                    value={values.instruments}
                    onChange={handleChange('instruments')}
                    input={<Input id="select-multiple-chip" />}
                    renderValue={selected => (

                      <div className={classes.chips}>
                        {selected.map(value => (
                          <Chip key={value} label={value} className={classes.chip} />
                        ))}
                      </div>

                    )}
                  >

                    {instruments.map(name => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}

                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid container xs={12} >

              {users.map((integrant, index) => (
                <Grid lg={3} xs={12} sm={6} item key={index} className={classes.integrant}>

                  <img src={integrant.avatar ? integrant.avatar : require('../assets/defaultAvatar.png')} className={classes.avatar} alt="avatar" />

                  <Typography variant="h5" className={classes.integrantTitle}>{integrant.name}</Typography>

                  <div style={{textAlign: 'center'}}>
                    {integrant.instruments.map((instrument, index) => (
                      <Chip
                        className={classes.chip}
                        key={index}
                        label={instrument}
                        color="primary"
                      />
                    ))}
                  </div>

                  <Typography className={classes.bio} align="center">
                    {integrant.bio}
                  </Typography>

                </Grid>
              ))}

            </Grid>

          </CardContent>
        </Card>
      </Container>
    </div>
  )
}
