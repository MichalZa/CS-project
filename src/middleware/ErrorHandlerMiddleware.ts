import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';

import ErrorHandler from './../common/error/ErrorHandler';

@Middleware({ type: 'after' })
export default class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    constructor(private errorHandler: ErrorHandler) {}

    public error(error: any, request: Express.Request, response: Express.Response, next: (err: any) => any): void {
        this.errorHandler.handle(error);
    }
}
