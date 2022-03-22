import { Module } from '@nestjs/common';
import { DBLoggerModule } from './db-logger/db-logger.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DBLoggerModule, ConfigModule.forRoot({isGlobal: true})],
})
export class AppModule {}
