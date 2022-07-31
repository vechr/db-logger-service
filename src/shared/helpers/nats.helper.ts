import { connect, ConnectionOptions, NatsConnection, SubscriptionOptions } from "nats";
import appConfig from '@/constants/constant'
export class NatsHelper {
  private static _config: ConnectionOptions = { servers: appConfig.NATS_URL };
  private _subsOptions: SubscriptionOptions = { max: 10 }

  static async getConnection(): Promise<NatsConnection> {
   return await connect(this._config);
  }

  public static setConfig(data: ConnectionOptions) {
    this._config = data;
  }

  public set subsOptions(data: SubscriptionOptions) {
    this._subsOptions = data;
  }

  public get subsOptions(): SubscriptionOptions {
    return this._subsOptions;
  }
}