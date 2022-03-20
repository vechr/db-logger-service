import { Module } from '@nestjs/common';
import { DBLoggerModule } from './db-logger/db-logger.module';

@Module({
  imports: [DBLoggerModule],
})
export class AppModule {}
