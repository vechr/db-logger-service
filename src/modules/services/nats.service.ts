import { NatsConnection, StringCodec } from "nats";
import { InfluxService } from "./influx.service";
import log from '@/shared/utils/log.util';
import { KV, KvOptions } from "nats/lib/nats-base-client/types";
import { isBubble, isScatter } from "@/shared/types";

export class NatsService {
  constructor(
    private nats: NatsConnection,
    private readonly influxService: InfluxService
    ) {}

  public static kv: KV;

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
        if(subjectParses.length > 8) topic = `/${subjectParses.filter((_, i) => i >= 8).join('/')}`;

        // Value from Subject
        let data = sc.decode(m.data);

          // Ambil informasi value dari key
        const e = await NatsService.kv.get(m.subject);
        
        // Decoding value dari key
        let widgetType: string = '';
        if (e) widgetType = sc.decode(e?.value)

        if (widgetType !== '') {
          this.validation(widgetType, data)
        }

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


  validation(widgetType: string, data: string) {
    try {
      if (
        widgetType === EWidget.BAR || 
        widgetType === EWidget.DOUGHNUT ||
        widgetType === EWidget.GAUGE ||
        widgetType === EWidget.LINE ||
        widgetType === EWidget.PIE ||
        widgetType === EWidget.POLAR ||
        widgetType === EWidget.RADAR
      ) {
        const result: Number = Number(data)
        if (Number.isNaN(result)) throw new Error('Data wouldn\'t be store, since type is different')
      } else if(widgetType === EWidget.SCATTER) {
        if (!isScatter(JSON.parse(data))) throw new Error('Data wouldn\'t be store, since type is not Scatter')
      } else if (widgetType === EWidget.BUBBLE) {
        if (!isBubble(JSON.parse(data))) throw new Error('Data wouldn\'t be store, since type is not Bubble')
      }
    } catch (error) {
      log.error(JSON.stringify(error))
    }
  }
}