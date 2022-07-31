import { Controller, UseFilters } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { DBLoggerService } from './db-logger.service';
import { DBLoggerDto } from './dto';
import { ExceptionFilter } from '../../shared/filters/rpc-exception.filter';

@Controller()
export class DBLoggerController {
  constructor(private readonly dbLoggerService: DBLoggerService) {}

  @UseFilters(new ExceptionFilter())
  @EventPattern('getData.query')
  queryDBTopic(@Payload() dto: DBLoggerDto): Promise<any> {
    return this.dbLoggerService.queryDBTopic(dto);
  }
}
