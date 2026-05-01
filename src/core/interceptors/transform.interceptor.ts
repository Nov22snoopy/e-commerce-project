import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpResponseInterface } from '../interfaces/http-response.interfaces';
import { ResponseMessage } from '../constant/response-message.enum';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, HttpResponseInterface<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<HttpResponseInterface<T>> {
    
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(map((data) => ({
      status: statusCode, 
      message: data?.message || ResponseMessage.SUCCESS, 
      data: data?.data || data || null,
    })));
  }
}
