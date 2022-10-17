import { ConnectionOptions } from 'nats';

export class IBaseNatsClient {
  connect: (broker: ConnectionOptions) => Promise<void>;
  disconnect: (lbroker: ConnectionOptions) => Promise<void>;
}
