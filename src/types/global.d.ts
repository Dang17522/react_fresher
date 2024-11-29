declare global{
    interface IBackendRes<T>{
        error?: string | string[];
        message:string;
        status:number | string;
        data?: T
    }
    interface IModelPaginate<T>{
        meta:{
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        results: T[],
        
    }
}