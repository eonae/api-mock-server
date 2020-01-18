export class Logger {
  constructor(
    private readonly verbose: boolean
  ) { }

  info(...data: any[]) {
    if (!this.verbose) return;
    console.log('MOCK-SERVER:', ...data)
  }
  error(errMsg: string) {
    if (!this.verbose) return;
    console.log('MOCK-SERVER Error: ' + errMsg)
  }
}