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
    //formData.append('samples', samples)
    formData.append('samples', JSON.stringify(samples))
    //samples.forEach(sample => formData.append('samples', sample))
    //testGroups.forEach(testGroup => testGroup.forEach(test => formData.append(`testGroups`, test)))
    formData.append('testGroups', JSON.stringify(testGroups))
    //testGroups.forEach(testGroup => testGroup.forEach(test => console.log(test)))
    //console.log(formData.get('testGroups'))
    //console.log(testGroups)
    //console.log(samples)
    const config = { headers: { Authorization: token, 'Content-Type' : 'multipart/form-data' } }
    return axios.post(baseUrl, formData , config).then(response => response.data).catch(error => error.response.data)
}

export default { get, add }