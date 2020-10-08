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

const update = async (id, name, bacterium, anamnesis, completionImage, samples, testGroups, deleteEndImage, token) => {
    var i
    var j
    for (i = 0; i < testGroups.length; i++) {
        var testGroup = testGroups[i]
        for (j = 0; j < testGroup.length; j++) {
            testGroup[j].test = JSON.stringify(testGroup[j].test)
        }
    }
    const formData = new FormData()
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