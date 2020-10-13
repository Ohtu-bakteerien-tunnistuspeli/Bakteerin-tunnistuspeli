import axios from 'axios'
const baseUrl = '/api/case'

const get = (token) => {
    const config = { headers: { Authorization: token } }
    return axios.get(baseUrl, config)
        .then(response => response.data)
        .catch(error => error.response.data)
}

const add = async (name, bacterium, anamnesis, completionImage, samples, testGroups, token) => {
    const formData = new FormData()
    formData.append('name', name )
    formData.append('bacterium', bacterium )
    formData.append('anamnesis', anamnesis )
    formData.append('completionImage', completionImage)
    formData.append('samples', JSON.stringify(samples))
    formData.append('testGroups', JSON.stringify(testGroups))
    const config = { headers: { Authorization: token, 'Content-Type' : 'multipart/form-data' } }
    return axios.post(baseUrl, formData , config).then(response => response.data).catch(error => error.response.data)
}

const update = async (id, name, bacterium, anamnesis, completionImage, samples, testGroups, deleteEndImage, token) => {
    const formData = new FormData()
    formData.append('id', id )
    formData.append('name', name )
    formData.append('bacterium', bacterium.id )
    formData.append('anamnesis', anamnesis )
    formData.append('completionImage', completionImage)
    formData.append('samples', JSON.stringify(samples))
    formData.append('testGroups', JSON.stringify(testGroups))
    formData.append('deleteEndImage', deleteEndImage)
    const config = { headers: { Authorization: token, 'Content-Type' : 'multipart/form-data' } }
    return axios.put(`${baseUrl}/${id}`, formData, config)
        .then(response => response.data)
        .catch(error => error.response.data)
}

const deleteCase = (id, token) => {
    const config = { headers: { Authorization: token } }
    return axios.delete(`${baseUrl}/${id}`, config).then(response => response).catch(error => error)
}

export default { get, add, update, deleteCase }