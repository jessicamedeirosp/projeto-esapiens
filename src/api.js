import axios from 'axios';

const api = axios.create({
    baseURL: 'http://api.github.com' // Url base da aplicação
});


export default api;