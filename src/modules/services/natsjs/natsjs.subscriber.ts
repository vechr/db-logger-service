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
import { DBLoggerBusinessLogic } from '../db-logger.logic';
import { NatsjsService } from './natsjs.service';
import log, { ILog } from '@/shared/utils/log.util';
import appConfig from '@/constants/constant';
import { DBLoggerService } from '@/modules/db-logger/db-logger.service';

@Injectable()
export class NatsSubscriber
  extends NatsjsService
  implements OnApplicationShutdown, OnModuleInit
{
  constructor(private readonly dbLoggerService: DBLoggerService) {
    super();
  }

  private brokerConfig: ConnectionOptions = { servers: appConfig.NATS_URL };
  private bucketConfig: Partial<KvOptions> = { history: 5 };

  async onModuleInit() {
    await this.connect(this.brokerConfig);
    await this.createBucket('kremes_topics', this.bucketConfig);
    await this.subscribeDBLogger(
      log,
      'Vechr.DashboardID.*.DeviceID.*.TopicID.*.Topic.>',
      this.kv,
      this.nats,
      this.dbLoggerService,
    );
  }

  async onApplicationShutdown() {
    await this.disconnect(this.brokerConfig);
  }

  async subscribeDBLogger(
    logger: ILog,
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
    logger.info(`Success subscribe to: ${subject}!`);

    this.subscriber.closed
      .then(() => {
        logger.info('subscription closed');
      })
      .catch((err) => {
        logger.error(`subscription closed with an error ${err.message}`);
      });
  }

  async createBucket(
    nameBucket: string,
    opts?: Partial<KvOptions>,
  ): Promise<void> {
    try {
      const js = this.nats.jetstream();
      await js.views.kv(nameBucket, opts).then((kv) => {
        this.kv = kv;
        this.logger.info(`Success create bucket kv: ${nameBucket}!`);
      });
    } catch (error) {
      this.logger.error(`NATS ${JSON.stringify(error)}`);
    }
  }
}
