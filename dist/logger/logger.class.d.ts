export declare class Logger {
    private readonly verbose;
    constructor(verbose: boolean);
    info(...data: any[]): void;
    error(errMsg: string): void;
}
