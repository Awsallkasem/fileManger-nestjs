import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(BadRequestException,NotFoundException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException|NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const message = exception.getResponse() as string | Record<string, any>;

    response.status(status).json({
      status: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
