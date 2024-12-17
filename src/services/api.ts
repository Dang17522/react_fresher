import axios from "./axios.customize";

export const register = (username: string, email: string, password: string, role: string) => {
    const urlBackEnd = "/api/admin/register";
    return axios.post<IBackendRes<ILogin>>(urlBackEnd, { username,email, password,role })
}

export const update = (id: number,username: string, email: string, fullname:string, password: string, role: string) => {
    const urlBackEnd = "/api/admin/updateUserData";
    return axios.put<IBackendRes<ILogin>>(urlBackEnd, {id, username,email,fullname, password,role })
}

export const deleteUser = (id: number) => {
    const urlBackEnd = `api/admin/delete/${id}`;
    return axios.delete<IBackendRes<ILogin>>(urlBackEnd)
}


export const loginAPI = (username: string, password: string) => {
    const urlBackEnd = "/api/admin/login";
    return axios.post<IBackendRes<ILogin>>(urlBackEnd, { username, password })
}
export const logoutAPI = (refreshToken: string) => {
    const urlBackEnd = "/api/admin/logout";
    return axios.get<IBackendRes<ILogout>>(urlBackEnd,{
        headers: {
            rereshToken: refreshToken,
        }
    })
}

export const getUserByToken = (token: string) => {
    const urlBackEnd = "/api/admin/accounts/token";
    return axios.get<IBackendRes<ILogin>>(urlBackEnd,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const importData = (file: any) => {
    const urlBackEnd = "/api/admin/accounts/importData";
    return axios.post<IBackendRes<ILogin>>(urlBackEnd,{
        file: file
    })
}

export const getListUserByKey = (key: string | null,startTime: string | null, endTime: string | null, sort: string | null,  pageSize: number, pageNumber: number) => {
    const urlBackEnd = `/api/users?key=${key}&startTime=${startTime}&endTime=${endTime}&sort=${sort}&pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axios.get<IBackendRes<IModalPage<IUser>>>(urlBackEnd)
}

export const getListUser = (pageSize: number, pageNumber: number) => {
    const urlBackEnd = `/api/users?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axios.get<IBackendRes<IModalPage<IUser>>>(urlBackEnd)
}