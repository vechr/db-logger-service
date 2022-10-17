import { Subscription } from 'nats';
import {
  KV,
  KvOptions,
  NatsConnection,
  SubscriptionOptions,
} from 'nats/lib/nats-base-client/types';
import { IBaseNatsClient } from './base.interface';
import { DBLoggerService } from '@/modules/db-logger/db-logger.service';

export class ISubscriber extends IBaseNatsClient {
  subscribe: (
    subject: string,
    onSubscribe: (
      subscriber: Subscription,
      kv: KV,
      nats: NatsConnection,
      influx: DBLoggerService,
    ) => Promise<void>,
    subscriberConfig?: SubscriptionOptions,
  ) => Promise<void>;
  createBucket: (
    nameBucket: string,
    opts?: Partial<KvOptions>,
  ) => Promise<void>;
}
