export interface ITopicEvent {
  id: string;
  topicId: string;
  name: string;
  description: string;
  eventExpression?: object;
  createdAt?: string;
  updatedAt?: string;
}
