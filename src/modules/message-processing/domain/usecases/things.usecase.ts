import { KV, NatsConnection } from 'nats';
import { Topic } from '../entities';
import { ChartUseCase } from './chart.usecase';
import { NatsUseCase } from './nats.usecase';
import log from '@/core/base/frameworks/shared/utils/log.util';

export class ThingsUseCase extends NatsUseCase {
  public topicData: Topic | undefined = undefined;

  constructor(
    kv: KV,
    nats: NatsConnection,
    private validationTopic: ChartUseCase,
  ) {
    super(kv, nats);
  }

  async checkMessage(topicId: string, data: string): Promise<void> {
    // Ambil informasi value dari key
    this.topicData = await this.getTopicKV(topicId);

    if (this.topicData === undefined) {
      log.error("topic's not defined ");
      return;
    }

    if (this.topicData.widgetType === undefined) {
      if (this.topicData.topicEvents !== undefined) {
        this.sendEmail(data, this.topicData.topicEvents);
      }
    } else {
      if (this.validationTopic.validation(this.topicData.widgetType, data)) {
        if (this.topicData.topicEvents !== undefined) {
          this.sendEmail(data, this.topicData.topicEvents);
        }

        // Set kembali ke undefined
        this.topicData = undefined;
      }
    }
  }
}
