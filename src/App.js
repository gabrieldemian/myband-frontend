import React, { useState } from 'react';
import Main from './pages/Main';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { red, blue } from '@material-ui/core/colors';
import { StateProvider } from './services/StateProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

function App() {

  // GLOBAL STATE
  const initialState = {
    userGlobal: { logged: false, acceptInvite: false }
  };
  
  const reducer = (state, action) => {
    switch (action.type) {
      case 'changeLogged':
        return {
          ...state,
          userGlobal: action.newUser
        };

      case 'acceptInvite':
        return {
          ...state,
          userGlobal: action.acceptInvite
        }
        
      default:
        return state;
    }
  };
  
  const [type, setType] = useState('dark')

  // Create a theme instance.
  let themeObj = createMuiTheme({
    palette: {
      type: type,
      spacing: 4,
      primary: {
        main: blue[500],
      },
      secondary: {
        main: '#19857b',
      },
      error: {
        main: red.A400,
      }
    },
  });

  themeObj = responsiveFontSizes(themeObj);

  const changeType = () => {
    let t = type === 'light' ? 'dark' : 'light'
    setType(t)
  }

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <ThemeProvider theme={themeObj}>
        <CssBaseline />
        <ToastContainer autoClose={2300} />
        <Main changeType={changeType} />
      </ThemeProvider>
    </StateProvider>
  );
}

export default App;
