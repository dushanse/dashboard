import { Module } from '@nestjs/common';
import { HumidityService } from 'src/humidity/humidity.service';
import { ProducerService } from 'src/kafka/producer/producer.service';
import { ProductService } from 'src/product/product.service';
import { redisProvider } from 'src/redis/redis.provider';
import { TemperatureService } from 'src/temperature/temperature.service';
import { UtilService } from 'src/util/util.service';

@Module({
  providers: [
    TemperatureService,
    ProducerService,
    UtilService,
    redisProvider,
    HumidityService,
    ProductService,
  ],
})
export class CronModule {}
