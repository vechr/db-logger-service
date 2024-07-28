import { KV, NatsConnection } from 'nats';
import { Topic } from '../entities';
import { ChartUseCase } from './chart.usecase';
import { NatsUseCase } from './nats.usecase';
import log from '@/core/base/frameworks/shared/utils/log.util';
import { DBLoggerService } from '@/modules/db-logger/domain/usecase/db-logger.service';

export class DBLoggerUseCase extends NatsUseCase {
  public topicData: Topic | undefined = undefined;

  constructor(
    kv: KV,
    nats: NatsConnection,
    private influxService: DBLoggerService,
    private chartUsecase: ChartUseCase,
  ) {
    super(kv, nats);
  }

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
      if (this.chartUsecase.validation(this.topicData.widgetType, data)) {
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
}
