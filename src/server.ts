import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { HttpModule } from './app.module';
import log from './shared/utils/log.util';
import appConstant from '@/constants/constant';

const httpServer = new Promise(async (resolve, reject) => {
  try {
    const app = await NestFactory.create(HttpModule);
    // Connect to Broker NATS
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.NATS,
      options: {
        servers: [appConstant.NATS_URL],
      },
    });
    await app
      .startAllMicroservices()
      .then(() =>
        log.info(`Nest app NATS started at :${appConstant.NATS_URL} `),
      );
    app.enableCors();

    await app
      .listen(appConstant.APP_PORT)
      .then(() =>
        log.info(`Nest app http started at PORT: ${appConstant.APP_PORT}`),
      );

    resolve(true);
  } catch (error) {
    reject(error);
  }
});

(async function () {
  await Promise.all([httpServer]);
})();
