import axios from 'axios'
const baseUrl = '/api/test'


const get = (token) => {
    const config = { headers: { Authorization: token } }
    return axios.get(baseUrl, config).then(response => response.data).catch(error => error.response.data)
}

const add = async (name, type, contImg, posImg, negImg, token) => {
    const formData = new FormData()
    formData.append('name', name )
    formData.append('type', type )
    formData.append('positiveResultImage', posImg )
    formData.append('negativeResultImage', negImg)
    formData.append('bacteriaSpecificImage', contImg)
    const config = { headers: { Authorization: token, 'Content-Type' : 'multipart/form-data' } }
    return axios.post(baseUrl, formData , config).then(response => response.data).catch(error => error.response.data)
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