import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Point } from '@influxdata/influxdb-client';
import { DBLoggerQuery } from '../entities';
import appConstant from '@/config/app.config';
import { InfluxService } from '@/core/base/frameworks/data-services/influxdb/influx.service';

@Injectable()
export class DBLoggerService {
  constructor(private readonly influxService: InfluxService) {}

  private readonly bucket: string = appConstant.INFLUX_BUCKET;

  writeDBTopic(
    dashboardId: string,
    deviceId: string,
    topicId: string,
    topic: string,
    value: any,
  ): any {
    const point = new Point(topic)
      .tag('deviceId', deviceId)
      .tag('dashboardId', dashboardId)
      .tag('topicId', topicId)
      .stringField('value', JSON.stringify(value));

    try {
      this.influxService.writeApi.writePoint(point);
      return 'Success Write data like topic!';
    } catch (error) {
      throw new Error(`Failed write data! ${error}`);
    }
  }

  async queryDBTopic(dto: DBLoggerQuery): Promise<any> {
    const fluxQuery = `from(bucket: "${this.bucket}") 
      |> range(start: 0)
      |> filter(fn: (r) => r._measurement == "${dto.topic}")
      |> filter(fn: (r) => r.topicId == "${dto.topicId}")
      |> filter(fn: (r) => r.dashboardId == "${dto.dashboardId}")
      |> filter(fn: (r) => r.deviceId == "${dto.deviceId}")`;

    return this.influxService.queryApi
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
