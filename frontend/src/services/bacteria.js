import axios from 'axios'
const baseUrl = '/api/bacteria'


const get = (token) => {
    const config = { headers: { Authorization: token } }
    return axios.get(baseUrl, config).then(response => {
        return { data: response.data, error: false }
    }).catch(error => {
        return { data: error.response.data.error, error: true }
    })
}

const add = async (name, token) => {
    const config = { headers: { Authorization: token } }
    return axios.post(baseUrl, { name: name }, config).then(response => {
        return { data: response.data, error: false }
    }).catch(error => {
        return { data: error.response.data.error.substring(error.response.data.error.indexOf('name: ') + 6), error: true }
    })
}

const update = (id, name, token) => {
    const config = { headers: { Authorization: token } }
    return axios.put(`${baseUrl}/${id}`, { name: name }, config).then(response => {
        return { data: response.data, error: false }
    }).catch(error => {
        return { data: error.response.data.error.substring(error.response.data.error.indexOf('name: ') + 6), error: true }
    })
}

const deleteBacterium = (id, token) => {
    const config = { headers: { Authorization: token } }
    const request = axios.delete(`${baseUrl}/${id}`, config)
    return request
}

export default { get, add, deleteBacterium, update }