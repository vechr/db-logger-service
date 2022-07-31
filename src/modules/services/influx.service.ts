import { InfluxDB, Point } from "@influxdata/influxdb-client";
import appConfig from '@/constants/constant'

export class InfluxService {
  constructor(
    private readonly influx: InfluxDB
  ) { }

  writeDBTopic(
    dashboardId: string,
    deviceId: string,
    topicId: string,
    topic: string,
    value: any): any {
    const writeAPI = this.influx.getWriteApi(appConfig.INFLUX_ORG, appConfig.INFLUX_BUCKET)

    const point = new Point(topic)
      .tag('deviceId', deviceId)
      .tag('dashboardId', dashboardId)
      .tag('topicId', topicId)
      .stringField('value', JSON.stringify(value));
    writeAPI.writePoint(point);

    return writeAPI
      .close()
      .then(() => {
        return 'Success Write data like topic!';
      })
      .catch((error) => {
        throw new Error(`Failed write data! ${error}`);
      });
  }
}