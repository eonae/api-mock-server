import express, { Express, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import { Server } from 'http';
import { IMockServer, IMockServerConfig, HandlersMap, HttpVerb, ResponseFactory, IResponse } from '../interfaces';
import { Logger } from '../logger';

export class MockServer implements IMockServer {
  
  private app: Express;
  private server: Server;
  private config: IMockServerConfig;
  private handlers: HandlersMap;
  private logger: Logger;

  private checkKey(key: string) {
    const method = key.split(' ')[0];
    if (!['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      throw new Error(`<${method}> is not valid http method.`);
    }
  }

  constructor(config: IMockServerConfig) {

    this.logger = new Logger(config.verbose);

    // By default handlers are registered as persistent
    
    const handlers = config.handlers || {};
    this.handlers = Object.entries(handlers)
      .reduce((acc: HandlersMap, [ key, handler ]) => {
        this.checkKey(key);
        acc[key] = {
          persistent: false,
          response: handler
        };
        return acc;
      }, {});
    this.handlers['default'] = config.default
      ? { persistent: true, response: config.default }
      : { persistent: true, response: { status: 404 }}

    this.config = config;

    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));
    this.app.use(async (req: Request, res: Response, next: NextFunction) => {
      let key = `${req.method} ${req.url}`;
      if (!this.handlers[key]) {
        key = 'default';
      }
      const handler = this.handlers[key];
      this.logger.info('handling:', key);

      if (!handler.persistent) {
        this.logger.info('removing handler:', key);
        delete this.handlers[key];
      }

      const response = typeof handler.response === 'function'
        ? await handler.response(req)
        : handler.response;

      res.status(response.status);
      if (response.headers) {
        Object.entries(response.headers)
        .forEach(([ header, value ]) => res.set(header, value));
      }
      this.logger.info('responding:', response);
      res.json(response.data);
      next(); /////
    });
    this.app.use((req, res, next) => {
      const keys = Object.keys(this.handlers);
      if (keys.length === 1 && keys[0] === 'default') {
        this.logger.info('MOCK-SERVER: No keys left! Stopping...');
        this.stop().then(() => next());
      }
    })
  }

  pushHandler(verb: HttpVerb, url: string, handler: ResponseFactory, options?: {
    persistent: boolean;
  }): MockServer {
    const persistent = options
      ? options.persistent || false
      : false
    this.handlers[`${verb} ${url}`] = {
      persistent,
      response: handler
    }
    return this;
  }
  
  pushResponse(verb: HttpVerb, url: string, response: IResponse, options?: {
    persistent: boolean;
  }): MockServer {
    const persistent = options
      ? options.persistent || false
      : false
    this.handlers[`${verb} ${url}`] = {
      persistent,
      response: () => response
    }
    return this;
  }
  
  clear(): void {
    this.handlers = {};
  }
  
  listen(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server && this.server.listening) {
        resolve();
      }
      try {
        this.server = (this.server || this.app)
          .listen(this.config.port, () => {
            this.logger.info('Listening port', this.config.port);
            this.logger.info('Endpoints:', Object.keys(this.handlers));
            resolve();
        });
      } catch (err) {
        reject(err);
      }
    })
  }
  
  stop(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.server) {
        this.server.close(err => {
          if (err) {
            this.logger.error(err.message);
            reject(err);
          }
          this.logger.info('Server closed');
          resolve();
        });
      }
    })
  }
}
