import axios from 'axios'
const baseUrl = '/api/skeleton'

const get = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const getSecured = (token) => {
    const config = { headers: { Authorization: token } }
    return axios.get(`${baseUrl}/secured`, config).then(response => response.data)
}

export default { get, getSecured }