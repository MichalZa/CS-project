import { Service } from 'typedi';
import { Logger } from 'winston';

import AppError from './type/AppError';

@Service()
export default class ErrorHandler {
    constructor(private logger: Logger) {}

    public handle(error: any, isOperational: boolean = true): void {
        this.logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
        this.crashVerify(error, isOperational);
    }

    private crashVerify(error: Error, isOperational: boolean): void {
        if (!isOperational || (error instanceof AppError && !error.isOperational)) {
            this.crash();
        }
    }

    private crash(): void {
        process.exit(1);
    }
}
