import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  context,
  SpanKind,
  SpanStatusCode,
  trace,
} from '@opentelemetry/api';
import {
  SEMATTRS_HTTP_HOST,
  SEMATTRS_HTTP_METHOD,
  SEMATTRS_HTTP_SCHEME,
  SEMATTRS_HTTP_STATUS_CODE,
  SEMATTRS_HTTP_TARGET,
  SEMATTRS_HTTP_URL,
  SEMATTRS_HTTP_USER_AGENT,
} from '@opentelemetry/semantic-conventions';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

const TRACER_NAME = 'sneaker-service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');
  private readonly tracer = trace.getTracer(TRACER_NAME);

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = ctx.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();

    const { method, url } = request;

    const span = this.tracer.startSpan(`${method} ${url}`, {
      kind: SpanKind.SERVER,
      attributes: {
        [SEMATTRS_HTTP_METHOD]: method,
        [SEMATTRS_HTTP_URL]: url,
        [SEMATTRS_HTTP_TARGET]: request.path,
        [SEMATTRS_HTTP_HOST]: request.hostname,
        [SEMATTRS_HTTP_SCHEME]: request.protocol,
        [SEMATTRS_HTTP_USER_AGENT]: request.headers['user-agent'] ?? '',
      },
    });

    const startTime = Date.now();

    return new Observable((subscriber) => {
      context.with(trace.setSpan(context.active(), span), () => {
        next
          .handle()
          .pipe(
            tap({
              next: () => {
                const statusCode = response.statusCode;
                const responseTime = Date.now() - startTime;

                span.setAttributes({
                  [SEMATTRS_HTTP_STATUS_CODE]: statusCode,
                  'http.response_time_ms': responseTime,
                });
                span.setStatus({ code: SpanStatusCode.OK });
                span.end();

                this.logger.log(
                  `${method} ${url} ${statusCode} +${responseTime}ms  traceId=${span.spanContext().traceId}`,
                );
              },
              error: (err: { status?: number; message?: string }) => {
                const statusCode = err?.status ?? 500;
                const responseTime = Date.now() - startTime;

                span.setAttributes({
                  [SEMATTRS_HTTP_STATUS_CODE]: statusCode,
                  'http.response_time_ms': responseTime,
                });
                span.setStatus({
                  code: SpanStatusCode.ERROR,
                  message: err?.message ?? 'Internal Server Error',
                });
                span.recordException(err as Error);
                span.end();

                this.logger.error(
                  `${method} ${url} ${statusCode} +${responseTime}ms  traceId=${span.spanContext().traceId}`,
                );
              },
            }),
          )
          .subscribe(subscriber);
      });
    });
  }
}
