import axios from "axios"

const instance = axios.create({
    baseURL: 'https://my-burger-c65a6.firebaseio.com/'
});

export default instance