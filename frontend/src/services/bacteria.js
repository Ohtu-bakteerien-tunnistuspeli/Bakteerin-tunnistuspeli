import axios from 'axios'
const baseUrl = '/api/bacteria'


const get = (token) => {
    const config = { headers: { Authorization: token } }
    const request = axios.get(baseUrl, config)
    return request.then(response => response.data)
}

const add = (name, token) => {
    const config = { headers: { Authorization: token } }
    const request = axios.post(baseUrl, { name: name }, config)
    return request.then(response => response.data)
}

const deleteBacterium = (id, token) => {
    const config = { headers: { Authorization: token } }
    const request = axios.delete(`${baseUrl}/${id}`, config)
    return request
}

export default { get, add, deleteBacterium }