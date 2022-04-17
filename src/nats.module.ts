import { Module } from '@nestjs/common';
import { DBLoggerModule } from './modules/db-logger/db-logger.module';

@Module({
  imports: [DBLoggerModule],
})
export class NatsModule {}
