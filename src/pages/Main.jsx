import React, { Suspense, lazy } from 'react'
import Navbar from '../components/Navbar';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';

import PrivateRoute from '../components/PrivateRoute';

const UserProfile = lazy(() => import('./UserProfile'));
const Bands = lazy(() => import('./Bands'));
const Musicians = lazy(() => import('./Musicians'));
const Login = lazy(() => import('./Login'));


export default function Main() {

  const Nav = withRouter(props => <Navbar {...props}/>);

  return (
    <>

    <Router>
      <Nav />

      <Suspense fallback={<p>Loading...</p>}>
        <Switch>
          <Route exact path='/login' component={ Login } />
          <PrivateRoute exact path='/' component={ UserProfile } />
          <PrivateRoute exact path='/bands' component={ Bands } />
          <PrivateRoute exact path='/musicians' component={ Musicians } />
        </Switch>
      </Suspense>
    </Router>

    </>
  )
}
