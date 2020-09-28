import axios from 'axios'
const baseUrl = '/api/case'

const get = (token) => {
    const config = { headers: { Authorization: token } }
    return axios.get(baseUrl, config)
        .then(response => response.data)
        .catch(error => error.response.data)
}

const add = async (name, bacterium, anamnesis, compText, samples, testGroups, token) => {
    const formData = new FormData()
    formData.append('name', name )
    formData.append('bacterium', bacterium )
    formData.append('anamnesis', anamnesis )
    formData.append('completitionText', compText)
    formData.append('samples', samples)
    formData.append('testGroups', testGroups)
    const config = { headers: { Authorization: token, 'Content-Type' : 'multipart/form-data' } }
    return axios.post(baseUrl, formData , config).then(response => response.data).catch(error => error.response.data)
}

export default { get, add }