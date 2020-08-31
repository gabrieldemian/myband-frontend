import React, { useState } from 'react'
import { Dialog, Button, Grid, MenuItem, InputLabel, FormControl, Typography, Container, Select, FormHelperText } from '@material-ui/core'
import { Formik } from 'formik'
import { makeStyles } from '@material-ui/styles'
import AutoComplete from './AutoComplete';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import api from '../utils/api';

const useStyles = makeStyles(theme => ({
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  avatar: {
    width: 70,
    height: 70,
    objectFit: 'cover',
    borderRadius: '100%',
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

export default function InviteMusicians({openDialog, onCloseDialog, setOpenDialog, band}) {

  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [valuesForm, setValuesForm] = useState({
    notifications: [],
  });
  
  const classes = useStyles();

  return (
    <Dialog
      open={openDialog}
      onClose={onCloseDialog}
      maxWidth="sm"
      fullWidth={true}
    >
      <Formik
        initialValues={{ ...valuesForm, notifications }}
        onSubmit={async (values, { setSubmitting }) => {

          setSubmitting(true);

          const notifications = values.notifications.map(inn => {
            return {_id: inn._id, instrument: inn.instrument}
          });

          // send the notification list to the server
          await api.post('/notification', {
            bandId: band._id,
            bandName: band.name,
            type: 'band',
            notifications
          });

          setSubmitting(false);
          toast.success('Músicos convidados com sucesso!');
          onCloseDialog();

          console.log('values: ', values);
        }}

        validationSchema={Yup.object().shape({
          notifications: Yup.array()
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
                <AutoComplete
                  name="notifications"
                  handleChange={handleChange('notifications')}
                  helperText={(errors.notifications && touched.notifications) && errors.notifications}
                  onBlur={handleBlur}
                />
              </Grid>

              <Grid item container spacing={4}>

                {values.notifications ? (values.notifications.map((notification, index) => (

                  <Grid item key={index} className={classes.integrant}>

                    <img src={ notification.avatar ? notification.avatar : require('../assets/defaultAvatar.png')} className={classes.avatar} alt="avatar" />

                    <Typography gutterBottom>{notification.name}</Typography>
                    <Typography>{notification.instrument !== '' ? notification.instrument : ''}</Typography>

                    <FormControl className={classes.formControl}>
                      <InputLabel htmlFor="role">Irá tocar...</InputLabel>
                      <Select
                        onClose={() => setOpen(false)}
                        onOpen={() => setOpen(true)}
                        onBlur={handleBlur}
                        value={values.notifications[index].instrument}
                        name={`notifications[${index}].instrument`}
                        onChange={(e) => {
                          notification.instrument = e.target.value
                        }}
                        inputProps={{
                          name: 'Instrumento',
                          id: 'role'
                        }}
                      >
                        {notification.instruments.map((instrument, index) => (
                          <MenuItem key={index} value={instrument}>{instrument}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <FormHelperText>
                      {(errors.notifications && touched.notifications) && errors.notifications}
                    </FormHelperText>
                  </Grid>
                ))) : ''}
              </Grid>

              <Grid item xs={12}>
                <Button
                  style={{ margin: '20px 0' }}
                  type="submit"
                  disabled={!isValid}
                  onClick={() => {
                    console.log('notifications', values.notifications)
                  }}
                  variant="contained"
                  color="primary"
                >
                  Enviar convites
                </Button>

                <Button
                  style={{ margin: '20px 8px' }}
                  onClick={() => {
                    setOpenDialog(false)
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
