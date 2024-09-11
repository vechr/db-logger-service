import { NotificationEmail } from '../notification-email.entity';

export class EventSendEmail {
  constructor(
    public readonly notificationEmails: NotificationEmail[],
    public readonly body: string,
    public readonly htmlBodyContent: string,
  ) {}

  toString() {
    return JSON.stringify({
      notificationEmails: this.notificationEmails,
      body: this.body,
      htmlBodyContent: this.htmlBodyContent,
    });
  }
}
