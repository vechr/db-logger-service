import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Version,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  HealthCheckResult,
} from '@nestjs/terminus';

@Controller()
export default class HealthController {
  constructor(private health: HealthCheckService) {}

  @Version(VERSION_NEUTRAL)
  @Get('health')
  @HealthCheck()
  @HttpCode(HttpStatus.OK)
  check() {
    return this.healthCheck();
  }

  @Version(VERSION_NEUTRAL)
  @Get()
  @HealthCheck()
  @HttpCode(HttpStatus.OK)
  check2() {
    return this.healthCheck();
  }

  private async healthCheck(): Promise<HealthCheckResult> {
    return this.health.check([]);
  }
}
