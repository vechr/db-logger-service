import { IsNotEmpty, IsString } from 'class-validator';

export class DBLoggerDto {
  @IsString()
  @IsNotEmpty()
  dashboardId: string;

  @IsString()
  @IsNotEmpty()
  deviceId: string;

  @IsString()
  @IsNotEmpty()
  topic: string;
}
