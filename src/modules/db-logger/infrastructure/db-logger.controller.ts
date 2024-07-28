import { Controller, UseFilters } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OtelInstanceCounter, Span, OtelMethodCounter } from 'nestjs-otel';
import { DBLoggerQuery } from '../domain/entities';
import { DBLoggerService } from '../domain/usecase/db-logger.service';
import { ExceptionFilter } from '@/core/base/frameworks/shared/filters/rpc-exception.filter';

@Controller()
@OtelInstanceCounter()
export class DBLoggerController {
  constructor(private readonly dbLoggerService: DBLoggerService) {}

  @UseFilters(new ExceptionFilter())
  @EventPattern('getData.query')
  @Span('[DB LOGGER SERVICE]: Query Data')
  @OtelMethodCounter()
  queryDBTopic(@Payload() dto: DBLoggerQuery): Promise<any> {
    return this.dbLoggerService.queryDBTopic(dto);
  }
}
