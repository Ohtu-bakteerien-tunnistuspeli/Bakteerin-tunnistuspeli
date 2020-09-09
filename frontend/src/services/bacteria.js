import axios from 'axios'
const baseUrl = '/api/bacteria'


const get = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const add= (name) => {
    const request = axios.post(baseUrl, {name: name})
    return request.then(response => response.data)
}

export default { get, add }