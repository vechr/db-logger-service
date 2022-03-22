import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {InfluxDB, Point} from '@influxdata/influxdb-client'

@Injectable({})
export class DBLoggerService {
  constructor(private configService: ConfigService) {}

  private readonly url: string = this.configService.get<string>("INFLUX_URL");
  private readonly token: string = this.configService.get<string>("INFLUX_TOKEN");
  private readonly org: string = this.configService.get<string>("INFLUX_ORG");
  private readonly bucket: string = this.configService.get<string>("INFLUX_BUCKET");

  hello() {
    return "Hallo ini db-logger-microservices"
  }

  writeDB(): any {
    const influxDB = new InfluxDB({url: this.url, token: this.token});
    const writeApi = influxDB.getWriteApi(this.org, this.bucket);

    writeApi.useDefaultTags({region: 'west'});
    const point = new Point('temperature')
    .tag('sensor_id', 'TLM010')
    .floatField('value', 24);
    writeApi.writePoint(point);

    return writeApi
      .close()
      .then(() => {
        return 'Success Write data!';
      })
      .catch(e => {
        console.error(e)
        return 'Failed write data!';
      });
  }

  queryDB(): any {
    const queryApi = new InfluxDB({url: this.url, token: this.token}).getQueryApi(this.org);

    const fluxQuery: string = `from(bucket: "${this.bucket}") |> range(start: 0) |> filter(fn: (r) => r._measurement == "temperature")`;

    return queryApi
    .collectRows(fluxQuery)
    .then(data => {
      console.log('Success Collect Rows!');
      return data;
    })
    .catch(error => {
      console.error(error)
      return 'Failed Collect Rows!';
    })
  }
}