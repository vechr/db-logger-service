import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import {
  ConnectionOptions,
  KV,
  KvOptions,
  NatsConnection,
  Subscription,
} from 'nats/lib/nats-base-client/types';
import { OnModuleInit } from '@nestjs/common';
import { StringCodec } from 'nats';
import { OtelInstanceCounter, OtelMethodCounter } from 'nestjs-otel';
import { DBLoggerBusinessLogic } from '../db-logger.logic';
import { NatsjsService } from './natsjs.service';
import { ISubscriber } from './interfaces/subscriber.interface';
import appConfig from '@/constants/constant';
import { DBLoggerService } from '@/modules/db-logger/db-logger.service';

@Injectable()
@OtelInstanceCounter()
export class NatsSubscriber
  extends NatsjsService
  implements OnApplicationShutdown, OnModuleInit, ISubscriber
{
  constructor(private readonly dbLoggerService: DBLoggerService) {
    super();
  }

  private brokerConfig: ConnectionOptions = {
    servers: appConfig.NATS_URL,
    maxReconnectAttempts: 10,
    tls: {
      caFile: appConfig.NATS_CA,
      keyFile: appConfig.NATS_KEY,
      certFile: appConfig.NATS_CERT,
    },
  };
  private bucketConfig: Partial<KvOptions> = { history: 5 };

  async onModuleInit() {
    await this.connect(this.brokerConfig);
    await this.createBucket('vechr_topics', this.bucketConfig);
    await this.subscribeDBLogger(
      'Vechr.DashboardID.*.DeviceID.*.TopicID.*.Topic.>',
      this.kv,
      this.nats,
      this.dbLoggerService,
    );
  }

  async onApplicationShutdown() {
    await this.disconnect(this.brokerConfig);
  }

  @OtelMethodCounter()
  async subscribeDBLogger(
    subject: string,
    kv: KV,
    nats: NatsConnection,
    dbLoggerService: DBLoggerService,
  ) {
    this.subscribe(subject, async (sub: Subscription): Promise<void> => {
      for await (const m of sub) {
        const thingsLogic = new DBLoggerBusinessLogic(
          kv,
          nats,
          dbLoggerService,
        );

        const subjectParses: string[] = m.subject.split('.');

        const sc = StringCodec();
        // Value from Subject
        const data = sc.decode(m.data);

        await thingsLogic.checkMessage(subjectParses[6], data, subjectParses);
      }
    });
    this.logger.info(`Success subscribe to: ${subject}!`);

    this.subscriber.closed
      .then(() => {
        this.logger.info('subscription closed');
      })
      .catch((err) => {
        this.logger.error(`subscription closed with an error ${err.message}`);
      });
  }
}
