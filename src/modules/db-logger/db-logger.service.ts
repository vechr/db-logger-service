import { Injectable } from '@nestjs/common';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import { DBLoggerDto } from './dto';
import { RpcException } from '@nestjs/microservices';
import appConstant from '@/constants/constant';

@Injectable({})
export class DBLoggerService {
  private readonly url: string = appConstant.INFLUX_URL;
  private readonly token: string = appConstant.INFLUX_TOKEN;
  private readonly org: string = appConstant.INFLUX_ORG;
  private readonly bucket: string = appConstant.INFLUX_BUCKET;

  writeDBTopic(
    dashboardId: string,
    deviceId: string,
    topicId: string,
    topic: string,
    value: any,
  ): any {
    const influxDB = new InfluxDB({ url: this.url, token: this.token });
    const writeApi = influxDB.getWriteApi(this.org, this.bucket);

    const point = new Point(topic)
      .tag('deviceId', deviceId)
      .tag('dashboardId', dashboardId)
      .tag('topicId', topicId)
      .stringField('value', JSON.stringify(value));
    writeApi.writePoint(point);

    return writeApi
      .close()
      .then(() => {
        return 'Success Write data like topic!';
      })
      .catch((e) => {
        console.error(e);
        return 'Failed write data!';
      });
  }

  queryDBTopic(dto: DBLoggerDto): any {
    const queryApi = new InfluxDB({
      url: this.url,
      token: this.token,
    }).getQueryApi(this.org);

    const fluxQuery: string = `from(bucket: "${this.bucket}") 
      |> range(start: 0)
      |> filter(fn: (r) => r._measurement == "${dto.topic}")
      |> filter(fn: (r) => r.topicId == "${dto.topicId}")
      |> filter(fn: (r) => r.dashboardId == "${dto.dashboardId}")
      |> filter(fn: (r) => r.deviceId == "${dto.deviceId}")`;

    return queryApi
      .collectRows(fluxQuery)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        if (error.code == 'unauthorized')
          throw new RpcException('Invalid Influx Token!');
      });
  }
}
