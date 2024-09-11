import { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InfluxDB, QueryApi, WriteApi } from '@influxdata/influxdb-client';
import appConfig from '@/config/app.config';

export class InfluxClient implements IInfluxClient {
  public influx: InfluxDB;
  public queryApi: QueryApi;
  public writeApi: WriteApi;

  async connect(): Promise<void> {
    this.influx = new InfluxDB({
      url: appConfig.INFLUX_URL,
      token: appConfig.INFLUX_TOKEN,
    });
    this.queryApi = this.influx.getQueryApi({
      org: appConfig.INFLUX_ORG,
    });
    this.writeApi = this.influx.getWriteApi(
      appConfig.INFLUX_ORG,
      appConfig.INFLUX_BUCKET,
    );
  }
}

export class IInfluxClient {
  connect: () => Promise<void>;
}

@Injectable()
export class InfluxService extends InfluxClient implements OnModuleInit {
  onModuleInit() {
    this.connect();
  }
}
