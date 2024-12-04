import axios from "./axios.customize";

export const register = (username: string, email: string, password: string) => {
    const urlBackEnd = "/api/admin/register";
    return axios.post<IBackendRes<ILogin>>(urlBackEnd, { username,email, password })
}

export const loginAPI = (username: string, password: string) => {
    const urlBackEnd = "/api/admin/login";
    return axios.post<IBackendRes<ILogin>>(urlBackEnd, { username, password })
}

export const getUserByToken = (token: string) => {
    const urlBackEnd = "/api/admin/accounts/token";
    return axios.get<IBackendRes<ILogin>>(urlBackEnd,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}