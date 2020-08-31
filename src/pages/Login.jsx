import React, { useEffect } from 'react'
import { makeStyles, ThemeProvider } from '@material-ui/styles';
import { Grid, Card, CardContent, Typography, TextField, Button, Link, createMuiTheme } from '@material-ui/core';
import RegisterInputs from '../components/RegisterInputs';
import { CSSTransition } from 'react-transition-group';
import { register, login } from '../services/AuthHandler';
import { Formik } from 'formik'
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { useStateValue } from '../services/StateProvider';

const theme = createMuiTheme({
  palette: {
    type: 'light'
  },
});

const useStyles = makeStyles(theme => ({
  wrapper: {
    height: '100vh',
    background: 'white'
  },
  card: {
    flexGrow: 1,
    boxShadow: '0 5px 30px rgba(0, 0, 0, 0.2)',
    background: 'white'
  },
  gradient: {
    display: 'flex',
    background: 'linear-gradient(45deg, rgba(66, 183, 245, 1) 0%, rgba(66, 245, 189, 0.5) 100%)',
    position: 'absolute',
    width: '100%',
    height: '100%'
  },
  grid: {
    margin: 'auto'
  },
  button: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2)
  },
  logo: {
    marginBottom: theme.spacing(2),
    fontWeight: 'bold'
  }
}));

const loginValidate = {
  email: Yup.string()
    .required('Digite seu email')
    .matches(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Email inválido'
    ),
  password: Yup.string()
    .required('Digite sua senha')
    .min(6, 'Senha muito curta')
    .max(30, 'Senha muito longa'),
}

const registerValidate = {
  name: Yup.string()
    .required('Digite seu nome')
    .max(30, 'Nome muito longo'),
  bio: Yup.string()
    .required('Digite sua biografia')
    .min(10, 'No mínimo 10 caracteres')
    .max(100, 'Biografia muito longa'),
  instruments: Yup.array()
    .of(
      Yup.string()
    )
    .required('Escolha no mínimo 1 instrumento'),
}

export default function Login({ history }) {

  const classes = useStyles();
  const [registerUser, setRegisterUser] = React.useState(false);
  const [{ userGlobal }, dispatch ] = useStateValue();
  const [yupValidation, setYupValidation] = React.useState({
    yup: () => Yup.object().shape({
      ...loginValidate
    })
  })

  const [values, setValues] = React.useState({
    email: '',
    password: '',
    name: '',
    bio: '',
    instruments: []
  });

  useEffect(() => {

    if (registerUser) {
      setYupValidation({
        yup: () => Yup.object().shape({
          ...loginValidate, ...registerValidate
        })
      })
    } else {
      setYupValidation({
        yup: () => Yup.object().shape({
          ...loginValidate
        })
      })
    }

  }, [registerUser]);

  const doLogin = (values) => {
    login(values.email, values.password)
      .then((data) => {

        if (data.success) {
          dispatch({
            type: 'changeLogged',
            newUser: { ...userGlobal, logged: true }
          })

          history.push('/');
        } else {
          toast.error(data.err);
        }

      }, (error) => {
        toast.error(error);
      })
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.wrapper}>
        <div id="gradient" className={classes.gradient}>
          <Grid container item xs={9} sm={5} md={5} lg={2} className={classes.grid}>
            <Card className={classes.card}>
              <CardContent>

                <Grid align="center">

                  <Typography variant="h4" className={classes.logo}>Apolíneo</Typography>

                  <Formik
                    validateOnChange
                    validateOnBlur
                    initialValues={{ ...values }}
                    onSubmit={async (values, { setSubmitting }) => {

                      if (!registerUser) {
                        // Login
                        doLogin(values);
                  
                      } else {
                  
                        // Register
                  
                        register(values).then((data) => {
                          if (!data.success) {
                            toast.error(data.err);
                          } else {
                            doLogin(values);
                          }
                        }, (error) => {
                          console.log('error?', error)
                        })
                  
                      }

                    }}

                    validationSchema={
                      yupValidation.yup
                    }
                  >
                    {(props) => {
                      const {
                        values,
                        touched,
                        errors,
                        validateForm,
                        validateField,
                        isValid,
                        handleChange,
                        handleBlur,
                        handleSubmit
                      } = props;
                      return (
                        <form onSubmit={handleSubmit} noValidate>

                          <TextField
                            required
                            name="email"
                            error={(errors.email && touched.email)}
                            onChange={handleChange('email')}
                            // onKeyUp={() => validateField('email')}
                            onBlur={handleBlur}
                            helperText={(errors.email && touched.email) && errors.email}
                            fullWidth
                            type="email"
                            label="Email"
                          />

                          <TextField
                            required
                            name="password"
                            error={(errors.password && touched.password)}
                            onChange={handleChange('password')}
                            onBlur={handleBlur}
                            helperText={(errors.password && touched.password) && errors.password}
                            fullWidth
                            type="password"
                            label="Senha"
                          />

                          <CSSTransition
                            in={registerUser}
                            unmountOnExit
                            timeout={300}
                            classNames="register-animation"
                          >
                            <RegisterInputs
                              name={values.name}
                              handleChange={handleChange}
                              handleBlur={handleBlur}
                              touched={{ name: touched.name, instruments: touched.instruments, bio: touched.bio }}
                              errors={{ name: errors.name, instruments: errors.instruments, bio: errors.bio }}
                              instruments={values.instruments}
                            />
                          </CSSTransition>

                          <Button disabled={!isValid} type="submit" color="primary" fullWidth variant="contained" className={classes.button}>
                            {registerUser ? 'Registrar' : 'Logar'}
                          </Button>

                          <Link onMouseLeave={() => validateForm()} onClick={() => {
                            validateField('')
                            setRegisterUser(!registerUser)
                          }} style={{ textDecoration: 'none' }} >
                            {registerUser ? 'Já tenho cadastro' : 'Não tenho cadastro'}
                          </Link>

                        </form>
                      );
                    }}
                  </Formik>

                  {/* <form onSubmit={onSubmit}>
                    

                    <TextField
                      required
                      name="email"
                      onChange={handleChange('email')}
                      fullWidth
                      type="email"
                      label="Email"
                    />

                    <TextField
                      required
                      min="6"
                      name="password"
                      onChange={handleChange('password')}
                      fullWidth
                      type="password"
                      label="Senha"
                    />

                    <CSSTransition
                      in={registerUser}
                      unmountOnExit
                      timeout={300}
                      classNames="register-animation"
                    >
                      <RegisterInputs name={values.name} handleChange={handleChange} instruments={values.instruments} />
                    </CSSTransition>

                    <Button type="submit" color="primary" fullWidth variant="contained" className={classes.button}>
                      {registerUser ? 'Registrar' : 'Logar'}
                    </Button>

                    <Link onClick={() => setRegisterUser(!registerUser)} style={{ textDecoration: 'none' }} >
                      {registerUser ? 'Já tenho cadastro' : 'Não tenho cadastro'}
                    </Link>

                  </form> */}

                </Grid>

              </CardContent>
            </Card>
          </Grid>
        </div>
      </div>
    </ThemeProvider>
  )
}
