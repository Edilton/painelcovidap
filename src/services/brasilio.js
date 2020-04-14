import axios from 'axios';

const brasilio = axios.create({baseURL:'https://brasil.io/api/dataset/covid19/caso/data'});


export default brasilio;