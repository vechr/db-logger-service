import { KV, KvOptions, NatsConnection } from 'nats/lib/nats-base-client/types';
import { IBaseNatsClient } from './base.interface';
import { DBLoggerService } from '@/modules/db-logger/db-logger.service';

export class ISubscriber extends IBaseNatsClient {
  subscribeDBLogger: (
    subject: string,
    kv: KV,
    nats: NatsConnection,
    dbLoggerService: DBLoggerService,
  ) => Promise<void>;
  createBucket: (
    nameBucket: string,
    opts?: Partial<KvOptions>,
  ) => Promise<void>;
}
