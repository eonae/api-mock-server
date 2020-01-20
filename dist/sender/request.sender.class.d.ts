import { HttpVerb } from '../interfaces';
import { Test } from 'supertest';
export declare const bearer: (token: string) => string;
export declare const getCsrf: (res: any) => any;
export declare class RequestSender {
    private readonly app;
    constructor(app: any);
    sendRequest(method: HttpVerb, url: string, options?: {
        data?: string | object;
        jwt?: string;
        csrf?: string;
        headers?: {
            [header: string]: string;
        };
    }): Test;
}
