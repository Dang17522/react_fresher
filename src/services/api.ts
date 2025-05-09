import axios from "./axios.customize";

export const register = (username: string, email: string, password: string, role: string) => {
    const urlBackEnd = "/api/admin/register";
    return axios.post<IBackendRes<ILogin>>(urlBackEnd, { username, email, password, role })
}

export const createProduct = (name: string, author:string, status: number, price: number, quantity: number, image: any, category: number, description: string,vote: number) => {
    const urlBackEnd = "/api/products/";
    const formData = new FormData();
    formData.append('name', name);
    formData.append('author', author);
    formData.append('status', status.toString());
    formData.append('price', price.toString());
    formData.append('quantity', quantity.toString());
    // formData.append('file', image);
    formData.append('category', category.toString());
    formData.append('vote', vote.toString());
    formData.append('description', description);
    // console.log("image__> ", image);
    image.forEach((f:any) => {
        formData.append('file', f.originFileObj);
      });
    return axios.post<IBackendRes<IApiProduct>>(urlBackEnd, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const updateProduct = (id: number, name: string,author: string, status: number | string, quantity: number, image: any, category: number, description: string, vote: number, price: number) => {
    const urlBackEnd = `/api/products/${id}`;
    const formData = new FormData();
    formData.append('name', name);
    formData.append('author', author);
    formData.append('status', (status == 'Active' ? 1 : 0).toString());
    formData.append('quantity', quantity.toString());
    formData.append('description', description);
    formData.append('vote', vote.toString());
    formData.append('category', category.toString());
    formData.append('price', price.toString());
    console.log("image__> ", image);
    if(image.length > 0){
        image.forEach((f:any) => {
            formData.append('file', f.originFileObj);
          });
    }
    
    return axios.put<IBackendRes<IApiProductList>>(urlBackEnd, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const update = (id: number, username: string, email: string, fullname: string, password: string, role: string) => {
    const urlBackEnd = "/api/admin/updateUserData";
    return axios.put<IBackendRes<ILogin>>(urlBackEnd, { id, username, email, fullname, password, role })
}

export const getProductById = (id: number) => {
    const urlBackEnd = "/api/products/" + id;
    return axios.get<IBackendRes<IApiProduct>>(urlBackEnd)
}

export const getProductByAuthor = (id: number) => {
    const urlBackEnd = "/api/products/findByAuthor/" + id;
    return axios.get<IBackendRes<IApiProductList>>(urlBackEnd)
}

export const deleteUser = (id: number) => {
    const urlBackEnd = `api/admin/delete/${id}`;
    return axios.delete<IBackendRes<ILogin>>(urlBackEnd)
}

export const deleteProduct = (id: number) => {
    const urlBackEnd = `api/products/delete/${id}`;
    return axios.delete<IBackendRes<IApiProduct>>(urlBackEnd)
}

export const deleteProductMultiImage = (productId: number, id: number) => {
    const urlBackEnd = `api/productMultiImage/delete/product/${productId}/${id}`;
    return axios.delete<IBackendRes<IApiProduct>>(urlBackEnd)
}


export const loginAPI = (username: string, password: string) => {
    const urlBackEnd = "/api/admin/login";
    return axios.post<IBackendRes<ILogin>>(urlBackEnd, { username, password })
}
export const logoutAPI = (refreshToken: string) => {
    const urlBackEnd = "/api/admin/logout";
    return axios.get<IBackendRes<ILogout>>(urlBackEnd, {
        headers: {
            rereshToken: refreshToken,
        }
    })
}

export const getUserByToken = (token: string) => {
    const urlBackEnd = "/api/admin/accounts/token";
    return axios.get<IBackendRes<ILogin>>(urlBackEnd, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const importData = (file: any) => {
    const urlBackEnd = "/api/admin/accounts/importData";
    const formData = new FormData();
    formData.append('file', file);
    return axios.post<IBackendRes<ILogin>>(urlBackEnd, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

export const exportData = () => {
    const urlBackEnd = "/api/admin/accounts/exportFileExcel";
    return axios.get<IBackendRes<ILogin>>(urlBackEnd, {
        responseType: 'blob',
        headers: {
            'Accept': 'application/vnd.ms-excel'
        }
    })
}

export const getListUserByKey = (key: string | null, startTime: string | null, endTime: string | null, sort: string | null, pageSize: number, pageNumber: number) => {
    const urlBackEnd = `/api/users?key=${key}&startTime=${startTime}&endTime=${endTime}&sort=${sort}&pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axios.get<IBackendRes<IModalPage<IUser>>>(urlBackEnd)
}

export const getListCategory = () => {
    const urlBackEnd = `/api/categories/getAll?pageSize=100&pageNumber=1`;
    return axios.get<IBackendRes<IModalPage<ICategory>>>(urlBackEnd)
}

export const getListProductByKey = (key: string | null, sort: string | null, pageSize: number, pageNumber: number) => {
    const urlBackEnd = `/api/products?key=${key}&sort=${sort}&pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axios.get<IBackendRes<IModalPage<IProduct>>>(urlBackEnd)
}

export const getListProductByFilter = (key: string | null, sort: string | null, category: String[] | number[], price: number[], rate: number, pageSize: number, pageNumber: number) => {
    const urlBackEnd = `/api/products/home?key=${key}&sort=${sort}&category=${category}&price=${price}&rate=${rate}&pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axios.get<IBackendRes<IModalPage<IProduct>>>(urlBackEnd)
}



export const getListUser = (pageSize: number, pageNumber: number) => {
    const urlBackEnd = `/api/users?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    return axios.get<IBackendRes<IModalPage<IUser>>>(urlBackEnd)
}