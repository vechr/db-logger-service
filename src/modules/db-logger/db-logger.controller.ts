import { Controller, UseFilters } from '@nestjs/common';
import { Ctx, EventPattern, NatsContext, Payload } from '@nestjs/microservices';
import { DBLoggerService } from './db-logger.service';
import { DBLoggerDto } from './dto';
import { ExceptionFilter } from '../../shared/filters/rpc-exception.filter';
import log from '@/shared/utils/log.util';

@Controller()
export class DBLoggerController {
  constructor(private readonly dbLoggerService: DBLoggerService) {}

  @UseFilters(new ExceptionFilter())
  @EventPattern('kreMES.DashboardID.*.DeviceID.*.TopicID.*.Topic.>')
  async writeDBTopic(@Payload() data: Record<string, unknown>, @Ctx() context: NatsContext) {
    const subjectParses: string[] = context.getSubject().split('.');
    let topic = `/${subjectParses[6]}`;
    if(subjectParses.length > 8) topic = `/${subjectParses.filter((x,i) => i >= 8).join('/')}`;
    log.info(`Subject: ${context.getSubject()} - ${topic} and data: ${data}`)
    return await this.dbLoggerService.writeDBTopic(
      subjectParses[2],
      subjectParses[4],
      subjectParses[6],
      topic,
      data,
    );
  }

  @UseFilters(new ExceptionFilter())
  @EventPattern('getData.query')
  queryDBTopic(@Payload() dto: DBLoggerDto) {
    return this.dbLoggerService.queryDBTopic(dto);
  }
}
