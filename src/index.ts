import findConfig from 'find-config';
import * as path from 'path';
import { IMockServerConfig } from './interfaces';
import { MockServer } from './core';

export * from './interfaces';
export * from './core';
export * from './constants';
export * from './logger';
export * from './sender';

const defaultConfig = process.argv.length === 3 && process.argv[2] === '--default';
const customConfig = process.argv.length === 4 && process.argv[2] === '--config';

async function main() {
  let configPath: string;
  try {
    configPath = defaultConfig
      ? findConfig('api-mock.config.ts')
      : path.join(__dirname, process.argv[3]);

    const config: IMockServerConfig = (await import(configPath)).config;
    const mock = new MockServer(config);
    mock.listen();

  } catch (err) {
    console.log('ConfigError: could`t find config file (api-mock.config.ts): ' + configPath);
    process.exit(1);
  }
}

if (defaultConfig || customConfig) {
  main();
}