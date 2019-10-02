import React from 'react'
import { Route, Redirect } from 'react-router-dom';
// import { loggedIn } from '../services/AuthHandler';
import { useStateValue } from '../services/StateProvider';

export default function PrivateRoute ({ component: Component, ...rest }) {
  
  const [ { userGlobal } ] = useStateValue();
  let logged = userGlobal.logged;

  return (
    <Route {...rest} render={(props) => (
      (logged || localStorage.getItem('logged') === 'true') ? <Component {...props} /> : <Redirect to='/login' />
    )}/>
  )
}
