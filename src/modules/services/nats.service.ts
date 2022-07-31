import { NatsConnection, StringCodec } from "nats";
import { InfluxService } from "./influx.service";
import log from '@/shared/utils/log.util';

export class NatsService {
  constructor(
    private nats: NatsConnection,
    private readonly influxService: InfluxService
    ) {}

  async subscribe(subject: string) {
    try {
      const sc = StringCodec();

      const sub = this.nats.subscribe(subject);

      for await (const m of sub) {
        const subjectParses: string[] = m.subject.split('.');

        // Get Topic
        let topic = `/${subjectParses[6]}`;
        if(subjectParses.length > 8) topic = `/${subjectParses.filter((_, i) => i >= 8).join('/')}`;

        // Value from Subject
        let data = sc.decode(m.data);

        this.influxService.writeDBTopic(
          subjectParses[2],
          subjectParses[4],
          subjectParses[6],
          topic,
          data
        )
      }

      sub.closed
        .then(() => {
          log.info("subscription closed")
          console.info("subscription closed");
        })
        .catch((err) => {
          log.error(`subscription closed with an error ${err.message}`)
        });
    } catch (error) {
      log.error(`Connection Error ${JSON.stringify(error)}`);
    }
  }
}