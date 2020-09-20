import axios from 'axios'
const baseUrl = '/api/test'


const get = (token) => {
    const config = { headers: { Authorization: token } }
    return axios.get(baseUrl, config).then(response => response.data).catch(error => error.response.data)
}

const add = async (name, token) => {
    const config = { headers: { Authorization: token } }
    return axios.post(baseUrl, { name: name }, config).then(response => response.data).catch(error => error.response.data)
}

export default { get, add }