import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HumidityService } from 'src/humidity/humidity.service';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { ProductService } from 'src/product/product.service';
import { TemperatureService } from 'src/temperature/temperature.service';

@Injectable()
export class CronService {
  constructor(
    private readonly temperatureService: TemperatureService,
    private readonly humidityService: HumidityService,
    private readonly productService: ProductService,
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  handleTempCron() {
    const temp = this.temperatureService.getTemp();
    return temp;
  }

  @Cron(CronExpression.EVERY_SECOND)
  handleHumidCron() {
    const humid = this.humidityService.getHumid();
    return humid;
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  handleProdCron() {
    const humid = this.productService.getProd();
    return humid;
  }
}
