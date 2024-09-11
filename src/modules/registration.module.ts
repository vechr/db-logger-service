import { Module } from '@nestjs/common';
import { DBLoggerModule } from './db-logger/db-logger.module';
import { MessageProcessingModule } from './message-processing/message-processing.module';

@Module({
  imports: [MessageProcessingModule, DBLoggerModule],
})
export class RegistrationModule {}
