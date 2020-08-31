import axios from 'axios';
import variables from './variables';

let token = localStorage.getItem('token');

const checkLocalStorage = () => {
  if (token) {
    return { Authorization: `Bearer ${token}` }
  } else {
    return {}
  }
}

const api = axios.create({
  baseURL: variables.serverURL,
  timeout: 5000,
  headers: {
    common: checkLocalStorage()
    // 'x-access-token': token
  }
})

// api.interceptors.response.use(response => {
//   return response;
// }, error => {
//  if (error.response.status === 401) {
//   //place your reentry code
//   console.log('error status: ', error.response.status);
//   // window.location.href = '/login';
//  }
//  return error;
// });


// api.interceptors.response.use((response) => { // intercept the global error
//   return response
// }, function (error) {
//   let originalRequest = error.config
//   if (error.response.status === 401 && !originalRequest._retry) { // if the error is 401 and hasent already been retried
//     originalRequest._retry = true // now it can be retried 
//     console.log('token expired!')
//   }
//   if (error.response.status === 404 && !originalRequest._retry) {
//     originalRequest._retry = true
//     window.location.href = '/'
//     return
//   }
//   // Do something with response error
//   return Promise.reject(error)
// })

// api.interceptors.request.use(
//   config => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers['Authorization'] = 'Bearer ' + token;
//     }
//     // config.headers['Content-Type'] = 'application/json';
//     return config;
// },
// error => {
//   Promise.reject(error)
// })

export default api;