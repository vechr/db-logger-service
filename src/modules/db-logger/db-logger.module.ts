import { Module } from '@nestjs/common';
import { DBLoggerController } from './db-logger.controller';
import { DBLoggerService } from './db-logger.service';

@Module({
  controllers: [DBLoggerController],
  providers: [DBLoggerService],
})
export class DBLoggerModule {}
