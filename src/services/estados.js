import axios from 'axios';

const cidades = axios.create({baseURL:'https://gist.githubusercontent.com/letanure/3012978/raw/2e43be5f86eef95b915c1c804ccc86dc9790a50a/estados-cidades.json'});


export default cidades;