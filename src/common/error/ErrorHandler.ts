import { Inject, Service } from 'typedi';
import { Logger } from 'winston';
import AppError from './type/AppError';

@Service()
export default class ErrorHandler {

    @Inject('logger')
    private readonly logger: Logger;

    public handle(error: any, isOperational: boolean = true) {
        this.logger.error(JSON.stringify(error, Object.getOwnPropertyNames(error)));
        this.crashVerify(error, isOperational);
    }

    private async crashVerify(error: Error, isOperational: boolean) {
        if (!isOperational || (error instanceof AppError && !error.isOperational)) {
            this.crash();
        }
    }

    private crash() {
        process.exit(1);
    }
}
