import React from 'react'
import { Dialog, Container, Grid, TextField, Button, Chip, Select, MenuItem, FormControl, InputLabel, Input, Typography, FormHelperText } from '@material-ui/core';
import AutoComplete from './AutoComplete';
import { makeStyles, useTheme } from '@material-ui/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { Formik } from 'formik';
import api from '../utils/api';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

const useStyles = makeStyles(theme => ({
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  avatar: {
    width: 70,
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1)
  },
  chip: {
    margin: 2,
  },
  integrant: {
    width: 200,
    textAlign: 'center'
  },
  formControl: {
    width: '100%'
  },
  dialog: {
    maxWidth: 650
  }
}));

export default function CreateBand(propsComponent) {

  const theme = useTheme();
  // const [isSubmitionCompleted, setSubmitionCompleted] = React.useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [invites, setInvites] = React.useState([]);
  const [valuesForm, setValuesForm] = React.useState({
    name: '',
    bio: '',
    instrument: '',
    invites: [],
    genres: []
  });

  const genres = [
    'Alternativo',
    'Rock',
    'Blues',
    'Metal',
    'Heavy Metal',
    'Reggae',
    'MPB'
  ]

  return (
    <Dialog
      onClose={propsComponent.onClose}
      open={propsComponent.open}
      maxWidth="md"
      fullWidth={true}
      fullScreen={fullScreen}
    >
      <Formik
        initialValues={{ ...valuesForm, invites }}
        onSubmit={async (values, { setSubmitting }) => {

          setSubmitting(true);

          const invites = values.invites.map(inn => {
            return {_id: inn._id, instrument: inn.instrument}
          })

          // first create the band
          const newBand = await api.post('/band', {
            creator: localStorage.getItem('userId'),
            name: values.name,
            bio: values.bio,
            genres: values.genres,
            integrants: [{
              name: propsComponent.userName,
              _id: localStorage.getItem('userId'),
              instrument: values.instrument
            }]
          });

          if (newBand.data.err) {
            toast.error(newBand.data.err);
            return console.log('band error: ', newBand.data);
          }

          // and then send the invite list to the server
          await api.post('/invite', {
            bandId: newBand.data._id,
            bandName: newBand.data.name,
            invites
          });

          console.log('create band: ', newBand.data)
          setSubmitting(false);
          propsComponent.updateBand(newBand.data);
          propsComponent.setOpen(false);
          toast.success('Banda criada com sucesso!');
        }}

        validationSchema={Yup.object().shape({
          name: Yup.string()
            .required('Campo obrigatório'),
          bio: Yup.string()
            .required('Campo obrigatório')
            .min(10, 'No mínimo 10 caracteres'),
          genres: Yup.array()
            .required('Campo obrigatório'),
          instrument: Yup.string()
            .required('Campo obrigatório'),
          invites: Yup.array()
            .of(
              Yup.object().shape({
                instrument: Yup.string()
                  .required('Escolha um instrumento')
              })
            )
            .required('Campo obrigatório'),
        })}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            isSubmitting,
            isValid,
            handleChange,
            handleBlur,
            handleSubmit
          } = props;
          return (
            <Container>
            <form onSubmit={handleSubmit} noValidate>
              <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  onChange={handleChange('name')}
                  name="name"
                  fullWidth
                  required
                  onBlur={handleBlur}
                  helperText={(errors.name && touched.name) && errors.name}
                  margin="normal"
                  label="Nome da banda"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  onChange={handleChange('bio')}
                  fullWidth
                  onBlur={handleBlur}
                  helperText={(errors.bio && touched.bio) && errors.bio}
                  name="bio"
                  margin="normal"
                  multiline
                  rows="2"
                  required
                  label="Descrição da banda"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="select-multiple-chip">Gêneros musicais</InputLabel>

                  <Select
                    multiple
                    name="genres"
                    helperText={(errors.genres && touched.genres) && errors.genres}
                    onBlur={handleBlur}
                    value={values.genres}
                    onChange={handleChange('genres')}
                    input={<Input id="select-multiple-chip" />}
                    renderValue={selected => (

                      <div className={classes.chips}>
                        {selected.map(value => (
                          <Chip key={value} label={value} className={classes.chip} />
                        ))}
                      </div>

                    )}
                  >

                    {genres.map(name => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}

                  </Select>
                  <FormHelperText>{(errors.genres && touched.genres) && errors.genres}</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="select-multiple-chip">O que você irá tocar?</InputLabel>

                  <Select
                    value={values.instrument}
                    onChange={handleChange('instrument')}
                    onBlur={handleBlur}
                    name="instrument"
                    helperText={(errors.instrument && touched.instrument) && errors.instrument}
                    input={<Input id="select-multiple-chip" />}
                    renderValue={selected => (
                      <div className={classes.chips}>
                        {
                          <Chip label={selected} className={classes.chip} />
                        }
                      </div>
                    )}>

                    {propsComponent.instruments.map(name => (
                      <MenuItem key={name} value={name}>
                        {name}
                      </MenuItem>
                    ))}
                  </Select>
                  
                  <FormHelperText>{(errors.instrument && touched.instrument) && errors.instrument}</FormHelperText>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <AutoComplete
                  name="invites"
                  handleChange={handleChange('invites')}
                  helperText={(errors.invites && touched.invites) && errors.invites}
                  onBlur={handleBlur}
                />
              </Grid>

              <Grid item container spacing={4}>

                {(values.invites.map((invite, index) => (

                  <Grid item key={index} className={classes.integrant}>

                    <img src={require('../assets/defaultAvatar.png')} className={classes.avatar} alt="avatar" />

                    <Typography gutterBottom>{invite.name}</Typography>
                    <Typography>{invite.instrument !== '' ? invite.instrument : ''}</Typography>

                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="role">Irá tocar...</InputLabel>
                      <Select
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        onBlur={handleBlur}
                        value={values.invites[index].instrument}
                        name={`invites[${index}].instrument`}
                        onChange={(e) => {
                          invite.instrument = e.target.value
                        }}
                        inputProps={{
                          name: 'Instrumento',
                          id: 'role'
                        }}
                      >
                        {invite.instruments.map((instrument, index) => (
                          <MenuItem key={index} value={instrument}>{instrument}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormHelperText>
                      {(errors.invites && touched.invites) && errors.invites}
                    </FormHelperText>
                  </Grid>
                )))}
              </Grid>

              <Grid item xs={12}>
                <Button
                  style={{ margin: '20px 0' }}
                  type="submit"
                  disabled={!isValid}
                  onClick={() => {
                    console.log('invites', values.invites)
                  }}
                  variant="contained"
                  color="primary"
                >
                  Criar banda
                </Button>

                <Button
                  style={{ margin: '20px 8px' }}
                  onClick={() => {
                    propsComponent.setOpen(false)
                  }}
                  variant="contained"
                  color="secondary"
                >
                  Cancelar
                </Button>
              </Grid>

            </Grid>

            </form>
            </Container>
          );
        }}
      </Formik>
    </Dialog>
  )
}
