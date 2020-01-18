import { IMockServerConfig } from './src';

export const config: IMockServerConfig = {
  port: 5001,
  default: {
    status: 404,
    data: "Resouce not found. Sorry :("
  },
  verbose: true,
  handlers: {
    'POST /permissions': (req) => {
      console.log('Got request from', req.body.username);
      return (req.body.username === 'Bill')
        ? { status: 200 }
        : { status: 403, data: 'Forbidden' }
    }
  }
}