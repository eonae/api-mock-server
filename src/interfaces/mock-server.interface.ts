import { HttpVerb, ResponseFactory, IResponse } from "./common";

export interface IMockServer {
  pushHandler(verb: HttpVerb, url: string, handler: ResponseFactory): void;
  pushResponse(verb: HttpVerb, url: string, response: IResponse): void;
  clear(): void;
  listen(port: number): Promise<void>
  stop(): Promise<void>
}