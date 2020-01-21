import findConfig from 'find-config';
import * as path from 'path';
import { IMockServerConfig } from './interfaces';
import { MockServer } from './core';
import * as fs from 'fs';
import { Logger } from './logger';

const DEFAULT_CONFIG = 'api-mock.config.js';

const logger = new Logger(true);

export async function main(configFile?: string) {
  let configPath: string;
  try {
    configPath = configFile
      ? path.join(__dirname, configFile)
      : findConfig(DEFAULT_CONFIG)

    if (!fs.existsSync(configPath)) {
      logger.error(`CONFIG ERROR: Could't find config file: (${configPath})`);
      process.exit(1);
    }
    const config: IMockServerConfig = await import(configPath);
    const mock = new MockServer(config);

    await mock.listen();

  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}