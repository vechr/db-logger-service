import { Module } from '@nestjs/common';
import { DBLoggerController } from './infrastructure/db-logger.controller';
import { DBLoggerService } from './domain/usecase/db-logger.service';
import { InfluxService } from '@/core/base/frameworks/data-services/influxdb/influx.service';

@Module({
  controllers: [DBLoggerController],
  providers: [DBLoggerService, InfluxService],
})
export class DBLoggerModule {}
