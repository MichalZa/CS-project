import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import ErrorHandler from './../common/error/ErrorHandler';
import { Inject } from 'typedi';

@Middleware({ type: "after" })
export default class ErrorHandlerMiddleware implements ExpressErrorMiddlewareInterface {
    @Inject()
    private errorHandler: ErrorHandler;

    error(error: any, request: Express.Request, response: Express.Response, next: (err: any) => any) {
        this.errorHandler.handle(error);
    }
}