import { InfluxDB, QueryApi, WriteApi } from '@influxdata/influxdb-client';
import { IInfluxClient } from './interfaces';
import appConfig from '@/constants/constant';

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
