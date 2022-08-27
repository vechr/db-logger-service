export interface ITopicEvent {
  id: string;
  topicId: string;
  name: string;
  description: string;
  eventExpression?: object;
  notificationEmailId: string[];
  bodyEmail?: string;
  htmlBodyEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}
