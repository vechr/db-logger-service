import { KV, NatsConnection, StringCodec } from 'nats';
import { EventRequesTopic, EventSendEmail, TopicEvent } from '../entities';
import log from '@/core/base/frameworks/shared/utils/log.util';

export class NatsUseCase {
  constructor(
    private kv: KV,
    private nats: NatsConnection,
  ) {}

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
        sc.encode(new EventRequesTopic(topicId).toString()),
      );

      const e2 = await this.kv.get(topicId);
      if (e2) {
        return JSON.parse(sc.decode(e2?.value));
      }
    }

    return undefined;
  }

  public sendEmail(data: string, topicEvent: TopicEvent[]) {
    const sc = StringCodec();
    topicEvent.map((val) => {
      if (data === val.eventExpression)
        this.nats.publish(
          'notification.email',
          sc.encode(
            new EventSendEmail(
              val.notificationEmails,
              val.bodyEmail ?? '',
              val.htmlBodyEmail ?? '',
            ).toString(),
          ),
        );
      log.info(val.eventExpression ?? '');
    });
  }
}
