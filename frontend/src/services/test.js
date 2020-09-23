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

const update = (id, name, type, contImg, photoPos, photoNeg, token) => {
    const config = { headers: { Authorization: token } }
    return axios.put(`${baseUrl}/${id}`, { name: name, type: type, contImg: contImg, photoPos: photoPos, photoNeg: photoNeg }, config)
    .then(response => response.data)
    .catch(error => error.response.data)
}

const deleteTest = (id, token) => {
    const config = { headers: { Authorization: token } }
    return axios.delete(`${baseUrl}/${id}`, config)
    .then(response => response)
    .catch(error => error)
}

export default { get, add, update, deleteTest }