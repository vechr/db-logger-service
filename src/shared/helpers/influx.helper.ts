import { ClientOptions, InfluxDB } from "@influxdata/influxdb-client";
import appConfig from '@/constants/constant'

export class InfluxHelper {
  private static _config: ClientOptions = {url: appConfig.INFLUX_URL, token: appConfig.INFLUX_TOKEN};
  
  static async getConnection(): Promise<InfluxDB> {
    return new InfluxDB(this._config)
  }

  public static setConfig(data: ClientOptions) {
    this._config = data
  }
}