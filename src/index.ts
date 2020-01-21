import { main } from './main';

export * from './interfaces';
export * from './core';
export * from './constants';
export * from './logger';
export * from './sender';

const defaultConfig = process.argv.length === 3 && process.argv[2] === '--default';
const customConfig = process.argv.length === 4 && process.argv[2] === '--config';

if (defaultConfig || customConfig) {
  main(customConfig ? process.argv[3] : undefined);
}