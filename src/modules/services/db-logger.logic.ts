import { StringCodec } from 'nats';
import { KV, NatsConnection } from 'nats/lib/nats-base-client/types';
import { DBLoggerService } from '../db-logger/db-logger.service';
import { EventRequesTopicDto } from './dto';
import log from '@/shared/utils/log.util';
import { ITopic } from '@/shared/types';
import { ValidationHelper } from '@/shared/helpers/validation.helper';

export class DBLoggerBusinessLogic {
  private validationTopic: ValidationHelper = new ValidationHelper();
  public topicData: ITopic | undefined = undefined;

  constructor(
    private kv: KV,
    private nats: NatsConnection,
    private influxService: DBLoggerService,
  ) {}

  async checkMessage(
    topicId: string,
    data: string,
    subjectParses: string[],
  ): Promise<void> {
    // Get Topic
    let topic = `/${subjectParses[6]}`;
    if (subjectParses.length > 8)
      topic = `/${subjectParses.filter((_, i) => i >= 8).join('/')}`;

    // Ambil informasi value dari key
    this.topicData = await this.getTopicKV(topicId);

    if (this.topicData === undefined) {
      log.error("topic's not defined ");
      return;
    }

    if (this.topicData.widgetType === undefined) {
      log.info(
        await this.influxService.writeDBTopic(
          subjectParses[2],
          subjectParses[4],
          subjectParses[6],
          topic,
          data,
        ),
      );
    } else {
      if (this.validationTopic.validation(this.topicData.widgetType, data)) {
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
        this.topicData = undefined;
      }
    }
  }

  async getTopicKV(topicId: string): Promise<any> {
    const sc = StringCodec();
    // Ambil informasi value dari key
    const e = await this.kv.get(topicId);

    // Decoding value dari key
    if (e) {
      return JSON.parse(sc.decode(e?.value));
    } else {
      this.nats.publish(
        'set.topic.widget.kv',
        sc.encode(new EventRequesTopicDto(topicId).toString()),
      );

      const e2 = await this.kv.get(topicId);
      if (e2) {
        return JSON.parse(sc.decode(e2?.value));
      }
    }

    return undefined;
  }
}
