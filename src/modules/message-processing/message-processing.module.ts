import { Module } from '@nestjs/common';
import { DBLoggerService } from '../db-logger/domain/usecase/db-logger.service';
import { MessageProcessingSubscriber } from './infrastructure/message-processing.subscriber';
import { ChartUseCase } from './domain/usecases/chart.usecase';
import { ThingsUseCase } from './domain/usecases/things.usecase';
import { NatsService } from '@/core/base/frameworks/data-services/nats/nats.service';
import { InfluxService } from '@/core/base/frameworks/data-services/influxdb/influx.service';

@Module({
  providers: [
    MessageProcessingSubscriber,
    ChartUseCase,
    ThingsUseCase,
    DBLoggerService,
    NatsService,
    InfluxService,
  ],
  exports: [MessageProcessingSubscriber],
})
export class MessageProcessingModule {}
