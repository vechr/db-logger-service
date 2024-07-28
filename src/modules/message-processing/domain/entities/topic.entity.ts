import { EWidget, Widget } from './widget.entity';
import { TopicEvent } from './topic-event.entity';
import { BaseEntity } from '@/core/base/domain/entities';

export class Topic extends BaseEntity {
  deviceId: string;
  widgetType: EWidget;
  topicEvents: TopicEvent[];
  widgets: Widget[];
}
