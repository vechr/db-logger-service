import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { HealthCheckService, HealthCheck } from '@nestjs/terminus';

@Controller('health')
export default class HealthController {
  constructor(private health: HealthCheckService) {}

  @Version(VERSION_NEUTRAL)
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([]);
  }
}
