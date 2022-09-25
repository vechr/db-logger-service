<p align="center">
  <a href="" target="blank"><img src="./public/logo.svg" width="320" alt="Logo" /></a>
</p>

# Edit your `.env` file
```
APP_PORT=3000

INFLUX_URL=http://influxdb:8086/
INFLUX_TOKEN=iJuF_t1nlTzo6t_vB2r3R7ELeBSCVuhaScSUReBf6X4MfAXY1UudatsItl961ef9MDsmSx6n4dM0EqKa71fWjw==
INFLUX_ORG=Vechr
INFLUX_BUCKET=Vechr

NATS_URL=nats://nats-server:4222
```

# Running DB Logger Service
```bash
yarn install
yarn watch
```

# Nats Subjects
*Vechr.DashboardID.**DashboardId**.DeviceID.**DeviceId**.TopicID.**TopicId**.Topic.**YourTopicNested1**.**YourTopicNested2***

# MQTT Topics

*Vechr/DashboardID/**DashboardId**/DeviceID/**DeviceId**/TopicID/**TopicId**/Topic/**YourTopicNested1**/**YourTopicNested2***
