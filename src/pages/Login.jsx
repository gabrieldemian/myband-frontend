import React from 'react'
import { makeStyles } from '@material-ui/styles';
import { Grid, Card, CardContent, Typography, TextField, Button, Link } from '@material-ui/core';
import RegisterInputs from '../components/RegisterInputs';
import { CSSTransition } from 'react-transition-group';
import { authenticate, register } from '../services/AuthHandler';
import { useStateValue } from '../services/StateProvider';
import { toast } from 'react-toastify';

const useStyles = makeStyles(theme => ({
  wrapper: {
    height: '100vh'
  },
  card: {
    flexGrow: 1
  },
  gradient: {
    display: 'flex'
  },
  grid: {
    margin: 'auto'
  },
  button: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  },
  logo: {
    marginBottom: theme.spacing(2)
  }
}));

export default function Login ({ history }) {

  // Global state dispatch
  const [ {user}, dispatch ] = useStateValue();

  const classes = useStyles();
  const [registerUser, setRegisterUser] = React.useState( false );
  const [values, setValues] = React.useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    instruments: []
  });

  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const login = () => {
    authenticate(values.email, values.password, (data) => {
      console.log('data: ', data)
      if (!data.success) {
        return toast.error(data.err)
      }

      dispatch({
        type: 'changeLogged',
        newUser: { logged: true }
      });

      history.push('/');
    });
  }

  const onSubmit = async event => {
    event.preventDefault();

    if ( !registerUser ) {
      // Login
      login();

    } else {
      
      // Register
      register(values, (data) => {
        if (!data._id) {
          console.log('data.err', data)
          return toast.error(data.err);
        }
        toast.success('Registrado com sucesso');
        login(data);
      });
    }
  };

  return (
    <div className={classes.wrapper}>
      <div id="gradient" className={classes.gradient}>
        <Grid container item lg={3} className={classes.grid}>
          <Card className={classes.card}>
            <CardContent>

              <Grid align="center">

                <form onSubmit={onSubmit}>
                  <Typography variant="h4" className={classes.logo}> MyBand </Typography>

                  <TextField
                    required
                    name="email"
                    onChange={handleChange('email')}
                    fullWidth
                    type="email"
                    label="Seu email"
                  />

                  <TextField
                    required
                    min="6"
                    name="password"
                    onChange={handleChange('password')}
                    fullWidth
                    type="password"
                    label="Sua senha"
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
                    { registerUser ? 'Registrar' : 'Logar' }
                  </Button>

                  <Link onClick={() => setRegisterUser(!registerUser)}>
                    { registerUser ? 'Já tenho cadastro' : 'Não tenho cadastro'}
                  </Link>

                </form>
              </Grid>

            </CardContent>
          </Card>
        </Grid>
      </div>
    </div>
  )
}
