import { Request } from 'express';
export declare type HttpVerb = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export declare type ResponseFactory = (req?: Request) => Promise<IResponse> | IResponse;
export interface IResponse {
    status: number;
    data?: any;
    headers?: {
        [header: string]: string;
    };
}
export interface HandlersMap {
    [url: string]: {
        persistent: boolean;
        response: ResponseFactory | IResponse;
    };
}
