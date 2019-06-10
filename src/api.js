import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.github.com' // Url base da aplicação
});


export default api;