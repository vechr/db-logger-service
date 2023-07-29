import { Controller, UseFilters } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { Span } from 'nestjs-otel';
import { ExceptionFilter } from '../../shared/filters/rpc-exception.filter';
import { DBLoggerService } from './db-logger.service';
import { DBLoggerDto } from './dto';

@Controller()
export class DBLoggerController {
  constructor(private readonly dbLoggerService: DBLoggerService) {}

  @UseFilters(new ExceptionFilter())
  @EventPattern('getData.query')
  @Span('[DB LOGGER SERVICE]: Query Data')
  queryDBTopic(@Payload() dto: DBLoggerDto): Promise<any> {
    return this.dbLoggerService.queryDBTopic(dto);
  }
}
