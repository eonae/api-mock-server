### Usage of mock-server

api-mock-server can be used in 2 scenarios
  - It can be run on specific port via console command
    > In this scenario, mock handlers should be set via mock-server.config.ts
  - It can be run from *.spec.ts (exposes app object);
    > In this scenario handler should be directly pushed into MockServer object.