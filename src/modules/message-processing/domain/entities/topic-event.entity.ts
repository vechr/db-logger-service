import { NotificationEmail } from './notification-email.entity';
import { BaseEntity } from '@/core/base/domain/entities';

export class TopicEvent extends BaseEntity {
  topicId: string;
  eventExpression: string | null;
  bodyEmail: string | null;
  htmlBodyEmail: string | null;

  notificationEmails: NotificationEmail[];
}
