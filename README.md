<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>


## Description

This app is used for write the data into influxdb


## Test

```bash
# For write the data into influxdb
http://localhost:3001/write

# For query the data into influxdb
http://localhost:3001/query
```

## Publish MQTT Data
Please use this topic format to store in database
`kreMES/DashboardID/<Your Dashboard ID>/DeviceID/<Your Device ID>/topic/<Your Topic Name>`

```bash
mosquitto_pub -h nats-server -p 1883 -t "kreMES/DashboardID/87jk234/DeviceID/9jk2b2189/topic/temp" -m "80.23"
```
