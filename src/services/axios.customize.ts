import axios from "axios";

const intance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true

});

intance.interceptors.request.use(function (config) {
    // Do something before request is sent
    const token = localStorage.getItem('token');
    if(token){
        const auth = `Bearer ${token}`;
        config.headers['Authorization'] = auth;
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
intance.interceptors.response.use(function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // if (response && response.data && response.data) {
    //     return response.data;
    // }
    return response;
}, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    if (error && error.response && error.response.data) {
        return error.response.data;
    }
    return Promise.reject(error);
});

export default intance