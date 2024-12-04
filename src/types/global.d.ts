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
        data: IUser | null;
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
            fullname: string
        },
    }

    interface IUser {
        id: number,
        username: string,
        email: string,
        avatar: string,
        role: string,
        fullname: string

    }
}