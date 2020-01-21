#!/usr/bin/env node

const defaultConfig = process.argv.length === 3 && process.argv[2] === '--default';
const customConfig = process.argv.length === 4 && process.argv[2] === '--config';

if (defaultConfig || customConfig) {
  require('./dist/main.js')(customConfig ? process.argv[3] : undefined);
}