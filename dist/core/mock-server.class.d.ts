import { IMockServer, IMockServerConfig, HttpVerb, ResponseFactory, IResponse } from '../interfaces';
export declare class MockServer implements IMockServer {
    private app;
    private server;
    private config;
    private handlers;
    private logger;
    private checkKey;
    constructor(config: IMockServerConfig);
    pushHandler(verb: HttpVerb, url: string, handler: ResponseFactory, options?: {
        persistent: boolean;
    }): MockServer;
    pushResponse(verb: HttpVerb, url: string, response: IResponse, options?: {
        persistent: boolean;
    }): MockServer;
    clear(): void;
    listen(): Promise<void>;
    stop(): Promise<void>;
}
