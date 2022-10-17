export class IInfluxClient {
  connect: () => Promise<void>;
}
