export class QueryCreateEventDto {
  constructor(public readonly topicId: string) {}

  toString() {
    return JSON.stringify({
      topicId: this.topicId,
    });
  }
}
