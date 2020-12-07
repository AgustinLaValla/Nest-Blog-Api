import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { QueryFailedError } from 'typeorm';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        console.log({ fromGlobal: exception});

        const ctx = host.switchToHttp();

        const response = ctx.getResponse();
        const request = ctx.getRequest();

        const status = exception instanceof HttpException ? exception.getStatus()
            : (exception instanceof QueryFailedError && get23505ErrorCode(exception)) ? HttpStatus.UNAUTHORIZED
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception instanceof HttpException ? exception.message :
            exception instanceof QueryFailedError && get23505ErrorCode(exception)
                ? get23505ErrorMessage(exception, request)
                : 'Internal Server Error'

        response.status(status).json({ ok: false, message });
    }
}

function get23505ErrorCode(exception: any) {
    console.log({ code: exception.code });
    return exception.code == 23505
}

function get23505ErrorMessage(exception, request) {
    console.log(request.body)
    if (exception.code == 23505) {
        const userExists = exception.detail?.includes(request.body.username);
        const emailExists = exception.detail?.includes(request.body.email);
        if (userExists && emailExists) {
            return 'User and Email have already been Taken';
        } else if (userExists) {
            return 'User has already been Taken';
        } else if (emailExists) {
            return 'Email has already been Taken';
        }
    }
}