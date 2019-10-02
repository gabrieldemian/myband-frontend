import api from '../utils/api';

export const authenticate = async (email, password, callback) => {

  // authenticate on the backend, and then
  try {

    const response = await api.post('/login', {
      email,
      password
    });

    console.log('response: ', response.data);

    localStorage.setItem('logged', true);
    localStorage.setItem('userId', response.data.userId);
    localStorage.setItem('token', response.data.token);
    callback(response.data);

  } catch (e) {

    callback(e)
  }
}

export const register = async (data, callback) => {

  console.log('register')

  try {

    const response = await api.post('/user', {
      ...data
    });

    console.log('response register: ', response.data);
    callback(response.data);

  } catch (e) {

    callback(e)
  }
}