import axios from 'axios';

const response = axios.get('http://localhost/').then(
    response => console.log(response.data)
);
