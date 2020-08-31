import React, { Suspense, lazy, useState } from 'react'
import Navbar from '../components/Navbar';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';

import PrivateRoute from '../components/PrivateRoute';
import Footer from '../components/Footer';
import io from "socket.io-client";
import variables from '../utils/variables';
import { useEffect } from 'react';
import { useStateValue } from '../services/StateProvider';

const UserProfile = lazy(() => import('./UserProfile'));
const Bands = lazy(() => import('./Bands'));
const Musicians = lazy(() => import('./Musicians'));
const Login = lazy(() => import('./Login'));

export default function Main() {

  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [{ userGlobal }, dispatch ] = useStateValue();

  useEffect(() => {

    // console.log('entering me', userGlobal);

    if (!localStorage.getItem('userId')) return;

    // console.log('gerando socket com query', localStorage.getItem('userId'));

    setSocket(io(variables.serverURL, {
      query: { user: localStorage.getItem('userId')}
    }));

  }, [ userGlobal ]);
  
  useEffect(() => {
  
    if (!socket) return;
  
    socket.on('connect', () => {
      // console.log('entering me', userGlobal);
      // console.log('socket connected', socket.query);
      setSocketConnected(socket.connected);
    });
  
    socket.on('disconnect', () => {
      setSocketConnected(socket.connected);
    });
  
  }, [socket])

  const Nav = withRouter(props => <Navbar {...props}/>);

  return (
    <>

    <Router>
      
      <Nav socketConnected={socketConnected} socket={socket} />

      <Suspense fallback={<p>Loading...</p>}>
        <Switch>
          <Route socketConnected={socketConnected} socket={socket} exact path='/login' component={ Login } />
          <PrivateRoute socketConnected={socketConnected} socket={socket} exact path='/' component={ UserProfile } />
          <PrivateRoute socketConnected={socketConnected} socket={socket} exact path='/bands' component={ Bands } />
          <PrivateRoute socketConnected={socketConnected} socket={socket} exact path='/musicians' component={ Musicians } />
        </Switch>
      </Suspense>

    </Router>

      <Footer />
    </>
  )
}
