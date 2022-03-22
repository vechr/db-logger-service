import { Controller, Get } from "@nestjs/common";
import { DBLoggerService } from "./db-logger.service";

@Controller()
export class DBLoggerController {
  constructor(private readonly dbLoggerService: DBLoggerService){};
  
  @Get()
  hello() {
    return this.dbLoggerService.hello();
  }

  @Get('write')
  writeDB() {
    return this.dbLoggerService.writeDB();
  }

  @Get('query')
  queryDB() {
    return this.dbLoggerService.queryDB();
  }
}