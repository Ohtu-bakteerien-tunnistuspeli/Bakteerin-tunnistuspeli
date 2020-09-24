import axios from 'axios'
const baseUrl = '/api/case'

const get = (token) => {
    const config = { headers: { Authorization: token } }
    return axios.get(baseUrl, config)
        .then(response => response.data)
        .catch(error => error.response.data)
}

export default { get }