import { Module } from '@nestjs/common';
import { DBLoggerModule } from './modules/db-logger/db-logger.module';
import { InfluxModule } from './modules/services/influxdb/influx.module';
import { NatsjsModule } from './modules/services/natsjs/natsjs.module';

@Module({
  imports: [NatsjsModule, InfluxModule, DBLoggerModule],
})
export class HttpModule {}
