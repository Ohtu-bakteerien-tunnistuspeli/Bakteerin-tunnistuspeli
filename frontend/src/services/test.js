import axios from 'axios'
const baseUrl = '/api/test'


const get = (token) => {
    const config = { headers: { Authorization: token } }
    return axios.get(baseUrl, config).then(response => response.data).catch(error => error.response.data)
}

const add = async (name, type, contImg, posImg, negImg, bacteriaSpes, token) => {
    console.log('täällä löytyy')
    console.log({ name, type, contImg, posImg, negImg, token })
    const formData = new FormData()
    formData.append('name', name.value )
    formData.append('type', type.value )
    formData.append('controlImage', contImg)
    formData.append('positiveResultImage', posImg )
    formData.append('negativeResultImage', negImg)
    bacteriaSpes.forEach(bact => formData.append('bacteriaSpecificImages', bact))
    console.log(formData)
    console.log('-----------------------------------------------')
    const config = { headers: { Authorization: token, 'Content-Type' : 'multipart/form-data' } }
    return axios.post(baseUrl, formData , config).then(response => response.data).catch(error => error.response.data)
}

const update = async (id, name, type, contImg, photoPos, photoNeg, bacteriaSpesif, token) => {
    console.log('edit to service ', name, id, token)
    const formData = new FormData()
    formData.append('id', id )
    formData.append('name', name )
    formData.append('type', type )
    formData.append('controlImage', contImg)
    formData.append('positiveResultImage', photoPos )
    formData.append('negativeResultImage', photoNeg)
    Array.from(bacteriaSpesif).forEach(bact => formData.append('bacteriaSpecificImages', bact))
    const config = { headers: { Authorization: token, 'Content-Type' : 'multipart/form-data' } }
    console.log(formData)
    return axios.put(`${baseUrl}/${id}`, formData, config)
        .then(response => response.data)
        .catch(error => error.response.data)
}

const deleteTest = async (id, token) => {
    const config = { headers: { Authorization: token } }
    console.log('deletion to service ', id)
    return axios.delete(`${baseUrl}/${id}`, config)
        .then(response => response)
        .catch(error => error)
}

export default { get, add, update, deleteTest }