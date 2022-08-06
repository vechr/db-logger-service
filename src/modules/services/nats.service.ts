import { NatsConnection, StringCodec } from 'nats';
import { InfluxService } from './influx.service';
import log from '@/shared/utils/log.util';
import { KV, KvOptions } from 'nats/lib/nats-base-client/types';
import { ITopic } from '@/shared/types';
import { QueryCreateEventDto } from '../db-logger/dto/query-create-event.dto';
import { ValidationHelper } from '@/shared/helpers/validation.helper';

export class NatsService {
  constructor(
    private nats: NatsConnection,
    private readonly influxService: InfluxService,
    private validationTopic: ValidationHelper,
  ) {}

  public static kv: KV;
  public static topicData: ITopic | undefined = undefined;

  async createBucket(nameBucket: string, opts?: Partial<KvOptions>) {
    try {
      const js = await this.nats.jetstream();
      NatsService.kv = await js.views.kv(nameBucket, opts);
    } catch (error) {
      log.error(`NATS ${JSON.stringify(error)}`);
    }
  }

  async subscribe(subject: string) {
    try {
      const sc = StringCodec();

      const sub = this.nats.subscribe(subject);

      for await (const m of sub) {
        const subjectParses: string[] = m.subject.split('.');

        // Get Topic
        let topic = `/${subjectParses[6]}`;
        if (subjectParses.length > 8)
          topic = `/${subjectParses.filter((_, i) => i >= 8).join('/')}`;

        // Value from Subject
        let data = sc.decode(m.data);

        // Ambil informasi value dari key
        const e = await NatsService.kv.get(subjectParses[6]);

        // Decoding value dari key
        if (e) {
          NatsService.topicData = JSON.parse(sc.decode(e?.value));
        } else {
          this.nats.publish(
            'set.topic.widget.kv',
            sc.encode(new QueryCreateEventDto(subjectParses[6]).toString()),
          );

          const e2 = await NatsService.kv.get(subjectParses[6]);
          if (e2) {
            NatsService.topicData = JSON.parse(sc.decode(e2?.value));
          }
        }

        if (NatsService.topicData === undefined) {
          log.error("topic's not defined ");
          continue;
        }

        if (NatsService.topicData.widgetType === undefined) continue;

        if (
          this.validationTopic.validation(
            NatsService.topicData.widgetType,
            data,
          )
        ) {
          log.info(
            await this.influxService.writeDBTopic(
              subjectParses[2],
              subjectParses[4],
              subjectParses[6],
              topic,
              data,
            ),
          );

          // Set kembali ke undefined
          NatsService.topicData = undefined;
        }
      }

      sub.closed
        .then(() => {
          log.info('subscription closed');
          console.info('subscription closed');
        })
        .catch((err) => {
          log.error(`subscription closed with an error ${err.message}`);
        });
    } catch (error) {
      log.error(`${error}`);
    }
  }
}
