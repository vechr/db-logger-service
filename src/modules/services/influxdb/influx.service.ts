import { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InfluxClient } from './influx.client';

@Injectable()
export class InfluxService extends InfluxClient implements OnModuleInit {
  onModuleInit() {
    this.connect();
  }
}
