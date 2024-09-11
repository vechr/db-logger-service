import { Injectable } from '@nestjs/common';
import { KV, NatsConnection, Subscription } from 'nats';
import { OnApplicationBootstrap } from '@nestjs/common';
import { StringCodec } from 'nats';
import { OtelInstanceCounter, OtelMethodCounter } from 'nestjs-otel';
import { DBLoggerUseCase } from '../domain/usecases/db-logger.usecase';
import { ChartUseCase } from '../domain/usecases/chart.usecase';
import { ThingsUseCase } from '../domain/usecases/things.usecase';
import log from '@/core/base/frameworks/shared/utils/log.util';
import { DBLoggerService } from '@/modules/db-logger/domain/usecase/db-logger.service';
import { NatsService } from '@/core/base/frameworks/data-services/nats/nats.service';

@Injectable()
@OtelInstanceCounter()
export class MessageProcessingSubscriber implements OnApplicationBootstrap {
  constructor(
    private readonly dbLoggerService: DBLoggerService,
    private chartUseCase: ChartUseCase,
    private natsService: NatsService,
  ) {}
  async onApplicationBootstrap() {
    await this.subscribeDBLogger(
      'Vechr.DashboardID.*.DeviceID.*.TopicID.*.Topic.>',
      this.natsService.kv,
      this.natsService.nats,
      this.dbLoggerService,
      this.chartUseCase,
    );
  }

  @OtelMethodCounter()
  async subscribeDBLogger(
    subject: string,
    kv: KV,
    nats: NatsConnection,
    dbLoggerService: DBLoggerService,
    chartUseCase: ChartUseCase,
  ) {
    this.natsService.subscribe(
      subject,
      async (sub: Subscription): Promise<void> => {
        for await (const m of sub) {
          const thingsUsecase = new ThingsUseCase(kv, nats, chartUseCase);
          const dbLoggerUsecase = new DBLoggerUseCase(
            kv,
            nats,
            dbLoggerService,
            chartUseCase,
          );

          const subjectParses: string[] = m.subject.split('.');

          const sc = StringCodec();
          // Value from Subject
          const data = sc.decode(m.data);

          await dbLoggerUsecase.checkMessage(
            subjectParses[6],
            data,
            subjectParses,
          );
          await thingsUsecase.checkMessage(subjectParses[6], data);
        }
      },
    );

    this.natsService.subscriber.closed
      .then(() => {
        log.info('subscription closed');
      })
      .catch((err) => {
        log.error(`subscription closed with an error ${err.message}`);
      });
  }
}
