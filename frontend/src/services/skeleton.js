import axios from 'axios'
const baseUrl = '/api/skeleton'


const get = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

export default { get }