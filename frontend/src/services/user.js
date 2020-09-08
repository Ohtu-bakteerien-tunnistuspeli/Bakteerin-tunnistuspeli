import axios from 'axios'
const baseUrl = '/api/user'


const login = (credentials) => {
    const request = axios.post(`${baseUrl}/login`, credentials)
    return request.then(response => response.data)
}

export default { login }