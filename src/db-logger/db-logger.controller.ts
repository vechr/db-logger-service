import { Body, Controller, Get } from "@nestjs/common";
import { Ctx, EventPattern, NatsContext, Payload } from "@nestjs/microservices";
import { DBLoggerService } from "./db-logger.service";
import { DBLoggerDto } from "./dto";

@Controller()
export class DBLoggerController {
  constructor(private readonly dbLoggerService: DBLoggerService){};
  
  @Get()
  hello() {
    return this.dbLoggerService.hello();
  }

  @EventPattern('kreMES.DashboardID.*.DeviceID.*.topic.*')
  writeDBTopic(@Payload() data: any, @Ctx() context: NatsContext) {
    const subjectParses: string[] =  context.getSubject().split('.');
    console.log(`Subject: ${context.getSubject()} and data: ${data}`)
    return this.dbLoggerService.writeDBTopic(subjectParses[2], subjectParses[4], subjectParses[6], data);
  }

  @EventPattern('getData.query')
  queryDBTopic(@Payload() dto: DBLoggerDto) {
    return this.dbLoggerService.queryDBTopic(dto);
  }
}