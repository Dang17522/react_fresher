import { AxiosResponse } from './../../node_modules/axios/index.d';
declare module 'axios' {
    export interface AxiosResponse<T = any> extends Promise<T> {
    }
}