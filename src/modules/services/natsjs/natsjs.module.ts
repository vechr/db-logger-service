import { Global, Module } from '@nestjs/common';
import { NatsSubscriber } from './natsjs.subscriber';
import { DBLoggerService } from '@/modules/db-logger/db-logger.service';

@Global()
@Module({
  providers: [NatsSubscriber, DBLoggerService],
  exports: [NatsSubscriber],
})
export class NatsjsModule {}
