import axios from 'axios';
let token = localStorage.getItem('token');

const api = axios.create({
  baseURL: 'http://localhost:3001',
  headers: {
    common: {'Authorization': `bearer ${token}`}
  }
})

export default api;