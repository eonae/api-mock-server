import { ResponseFactory, IResponse } from './common';
export interface IMockServerConfig {
    port: number;
    verbose?: boolean;
    default?: ResponseFactory | IResponse;
    handlers?: {
        [url: string]: ResponseFactory | IResponse;
    };
}
