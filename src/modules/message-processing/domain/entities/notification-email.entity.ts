import { BaseEntity } from '@/core/base/domain/entities';

export class NotificationEmail extends BaseEntity {
  sender: string;
  recipient: string;
}
