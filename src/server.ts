import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { HttpModule } from './http.module';
import appConstant from '@/constants/constant';
import log from './shared/utils/log.util';
import { NatsModule } from './nats.module';

const httpServer = new Promise(async (resolve, reject) => {
  try {
    const app = await NestFactory.create(HttpModule);
    app.enableCors();

    await app
      .listen(appConstant.APP_PORT)
      .then(() =>
        log.info(`Http server started at PORT: ${appConstant.APP_PORT}`),
      );

    resolve(true);
  } catch (error) {
    reject(error);
  }
});

const natsServer = new Promise(async (resolve, reject) => {
  try {
    const app = await NestFactory.createMicroservice<MicroserviceOptions>(
      NatsModule,
      {
        transport: Transport.NATS,
        options: {
          servers: [appConstant.NATS_URL],
        },
      },
    );

    await app
      .listen()
      .then(() => log.info(`Nest nats started at: ${appConstant.NATS_URL}`));

    resolve(true);
  } catch (error) {
    reject(error);
  }
});

(async function () {
  await Promise.all([httpServer, natsServer]);
})();
