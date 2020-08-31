import api from '../utils/api';
import axios from 'axios';
import variables from '../utils/variables';

export const login = (email, password) => {

  // authenticate on the backend

  console.log('authenticate ');

  return axios.post(variables.serverURL + '/login', {
    email,
    password
  })
  .then(response => {
    console.log('response authhandler', response.data)
    if (response.data.token) {
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  });

}

export const logout = () => {
  localStorage.removeItem("userId");
  localStorage.removeItem('token');
}

export const getUser = () => {
  return localStorage.getItem('userId');
}

export const register = (data) => {

  console.log('register')

  return api.post('/user', {
    ...data,
    avatar: ''
  }).then(response => {
    console.log('response authhandler', response.data);
    if (response.data.success) {
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  })

}