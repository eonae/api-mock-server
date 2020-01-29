import { ResponseFactory, IResponse } from './common';

export interface IMockServerConfig {
  port: number;
  verbose?: boolean;
  defaultHandler?: ResponseFactory | IResponse;
  handlers?: { [ url: string ]: ResponseFactory | IResponse };
}