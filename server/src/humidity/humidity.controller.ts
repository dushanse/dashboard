import { Controller, Get } from '@nestjs/common';
import { HumidityService } from './humidity.service';

@Controller('api')
export class HumidityController {
  constructor(private readonly _service: HumidityService) {}

  @Get('humid')
  async getHumid() {
    const value: any = await this._service.getHumid();
    return value
      ? { message: 'humidity sent successfully.', humidity: value }
      : { message: 'Failed to send humidity.' };
  }

  @Get('lastHumid')
  async getLastHumid() {
    const value: any = await this._service.getLastHumid();
    return value
      ? { message: 'humidity sent successfully.', humidity: value }
      : { message: 'Failed to send humidity.' };
  }

  @Get('avgHumid')
  async getLastHourAvgTemp() {
    const value: any = await this._service.getLastHourAvgHumid();
    return value
      ? { message: 'avg humidity sent successfully.', humidity: value }
      : { message: 'Failed to send avg humidity.' };
  }

  @Get('maxHumid')
  async getMaxHumid() {
    const value: any = await this._service.getMaxHumid();
    return value
      ? { message: 'max humidity sent successfully.', humidity: value }
      : { message: 'Failed to send max humidity.' };
  }
}
