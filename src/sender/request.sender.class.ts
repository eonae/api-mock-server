import { HttpVerb } from '../interfaces';
import request, { Test } from 'supertest';
import { AUTHORIZATION, X_CSRF_TOKEN } from '../constants';

export const bearer = (token: string) => 'Bearer ' + token;
export const getCsrf = (res: any) => res.header['x-csrf-token'];

export class RequestSender {
  constructor(
    private readonly app: any) {
  }

  sendRequest(method: HttpVerb, url: string, options?: {
    data?: string | object,
    jwt?: string,
    csrf?: string,
    headers?: { [ header: string]: string }
  }): Test {
    let req: Test = request(this.app)[method.toLowerCase()](url);
    
    if (options) {
      const { data, jwt, csrf, headers } = options;
      if (jwt) {
        req = req.set(AUTHORIZATION, bearer(jwt));
      }
      if (csrf) {
        req = req.set(X_CSRF_TOKEN, csrf);
      }
      if (headers) {
        Object.entries(options.headers).forEach(([header, value]) => {
          req = req.set(header, value);
        });
      }
      if (data) {
        req = req.send(data);
      }
    }
    return req;
  } 
}