import { Controller, Get } from '@nestjs/common';
import { TemperatureService } from './temperature.service';

@Controller('api')
export class TemperatureController {
  constructor(private readonly _service: TemperatureService) {}

  @Get('temp')
  async getTemp() {
    const value: any = await this._service.getTemp();
    return value
      ? { message: 'Temperature sent successfully.', temperature: value }
      : { message: 'Failed to send temperature.' };
  }

  @Get('lastTemp')
  async getLastTemp() {
    const value: any = await this._service.getLastTemp();
    return value
      ? { message: 'Last temperature sent successfully.', temperature: value }
      : { message: 'Failed to send last temperature.' };
  }

  @Get('avg')
  async getLastHourAvgTemp() {
    const value: any = await this._service.getLastHourAvgTemp();
    return value
      ? { message: 'avg temperature sent successfully.', temperature: value }
      : { message: 'Failed to send avg temperature.' };
  }

  @Get('max')
  async getMaxTemp() {
    const value: any = await this._service.getMaxTemp();
    return value
      ? { message: 'max temperature sent successfully.', temperature: value }
      : { message: 'Failed to send max temperature.' };
  }
}
