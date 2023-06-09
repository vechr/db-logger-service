import * as env from 'env-var';

import dotenv = require('dotenv');
dotenv.config();

export default Object.freeze({
  APP_PORT: env.get('APP_PORT').default(3000).asInt(),
  NATS_URL: env.get('NATS_URL').required().asString(),
  INFLUX_URL: env.get('INFLUX_URL').required().asString(),
  INFLUX_TOKEN: env.get('INFLUX_TOKEN').required().asString(),
  INFLUX_ORG: env.get('INFLUX_ORG').required().asString(),
  INFLUX_BUCKET: env.get('INFLUX_BUCKET').required().asString(),
  NATS_CA: env.get('NATS_CA').required().asString(),
  NATS_KEY: env.get('NATS_KEY').required().asString(),
  NATS_CERT: env.get('NATS_CERT').required().asString(),
});
