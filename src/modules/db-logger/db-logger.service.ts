import { Injectable } from '@nestjs/common';
import { InfluxDB } from '@influxdata/influxdb-client';
import { DBLoggerDto } from './dto';
import { RpcException } from '@nestjs/microservices';
import appConstant from '@/constants/constant';
import { InfluxHelper } from '@/shared/helpers/influx.helper';

@Injectable({})
export class DBLoggerService {
  private readonly influx: Promise<InfluxDB> = InfluxHelper.getConnection();
  private readonly org: string = appConstant.INFLUX_ORG;
  private readonly bucket: string = appConstant.INFLUX_BUCKET;

  async queryDBTopic(dto: DBLoggerDto): Promise<any> {
    const queryApi = (await this.influx).getQueryApi(this.org);

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
