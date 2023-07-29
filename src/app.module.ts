import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { OpenTelemetryModule } from 'nestjs-otel';
import { LoggerModule } from 'nestjs-pino';
import { DBLoggerModule } from './modules/db-logger/db-logger.module';
import { InfluxModule } from './modules/services/influxdb/influx.module';
import { NatsjsModule } from './modules/services/natsjs/natsjs.module';
import { InstrumentMiddleware } from './shared/middlewares/instrument.middleware';
import { logger } from './shared/utils/log.util';

const OpenTelemetryModuleConfig = OpenTelemetryModule.forRoot({
  metrics: {
    hostMetrics: true,
    apiMetrics: {
      enable: true,
    },
  },
});

const PinoLoggerModule = LoggerModule.forRoot({
  pinoHttp: {
    customLogLevel: function (_, res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) {
        return 'error';
      } else if (res.statusCode >= 500 || err) {
        return 'fatal';
      } else if (res.statusCode >= 300 && res.statusCode < 400) {
        return 'warn';
      } else if (res.statusCode >= 200 && res.statusCode < 300) {
        return 'info';
      }
      return 'debug';
    },
    logger,
  },
});

@Module({
  imports: [
    PinoLoggerModule,
    OpenTelemetryModuleConfig,
    NatsjsModule,
    InfluxModule,
    DBLoggerModule,
  ],
})
export class HttpModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(InstrumentMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
