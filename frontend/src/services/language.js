import axios from 'axios'
const baseUrl = '/'

const getValidation = () => {
    return axios.get(`${baseUrl}validation.json`).then(response => response.data).catch(error => error.response.data)
}

const getLibrary = () => {
    return axios.get(`${baseUrl}library.json`).then(response => response.data).catch(error => error.response.data)
}

export default { getValidation, getLibrary }