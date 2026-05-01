import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { SEMRESATTRS_SERVICE_NAME, SEMRESATTRS_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import { B3Propagator } from '@opentelemetry/propagator-b3';

const serviceName = process.env.OTEL_SERVICE_NAME ?? 'sneaker-service';
const serviceVersion = process.env.npm_package_version ?? '0.0.1';
const collectorUrl = process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318/v1/traces';

const traceExporter = new OTLPTraceExporter({ url: collectorUrl });

export const otelSDK = new NodeSDK({
  resource: resourceFromAttributes({
    [SEMRESATTRS_SERVICE_NAME]: serviceName,
    [SEMRESATTRS_SERVICE_VERSION]: serviceVersion,
  }),
  spanProcessors: [new BatchSpanProcessor(traceExporter)],
  textMapPropagator: new B3Propagator(),
});
