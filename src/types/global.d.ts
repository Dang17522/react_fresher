export { };
declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        status: number | string;
        data?: T
    }
    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        results: T[],

    }
    interface ILogin {
        data: IUser;
        token: string;
        refeshToken: string,
        message: string;
        status: number;
        user: {
            id: number,
            username: string,
            email: string,
            avatar: string,
            role: string,
            fullname: string,
            createAt: Date
        },
    }

    interface ILogout {
        message: string;
        status: number;
    }

    interface IUser {
        id: number,
        username: string,
        fullname: string,
        email: string,
        avatar: string,
        role: string,
        createAt: Date,
        data?: T
    }

    interface ICategory {
        id: number,
        name: string,
    }

    interface IProduct {
        id: number,
        name: string,
        author: string,
        status: string,
        image: string,
        avatar: string,
        quantity: number,
        vote: number,
        price: number,
        description: string,
        createAt: Date,
        data?: T,
        productMultiImage: IProductMultiImage[],
    }

    interface IProductMultiImage {
        id: number,
        image: string,
    }
    interface ICart{
        product:IProduct,
        value:number
    }
    
    interface IApiProduct {
        data: IProduct;
        message: string;
        status: number;
        product: IProduct,
    }

    interface IApiProductList {
        data: IProduct[];
        message: string;
        status: number;
        product: IProduct,
    }

    interface IModalPage<T> {
        content:T[],
        number: number,
        size: number,
        totalPages: number,
        totalElements: number
    }

    interface IData<T> {
        message?: string;
        status: number;
        content?: T
    }

    
}