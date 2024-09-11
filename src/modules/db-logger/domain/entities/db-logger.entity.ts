import { IsNotEmpty, IsString } from 'class-validator';

export class DBLoggerQuery {
  @IsString()
  @IsNotEmpty()
  dashboardId: string;

  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsString()
  @IsNotEmpty()
  topicId: string;

  @IsString()
  @IsNotEmpty()
  topic: string;
}
