export interface ITopicEvent {
  id: string;
  topicId: string;
  name: string;
  description: string;
  eventExpression?: string;
  notificationEmailId: string[];
  bodyEmail?: string;
  htmlBodyEmail?: string;
  createdAt?: string;
  updatedAt?: string;
}
