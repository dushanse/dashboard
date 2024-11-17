import { Module } from '@nestjs/common';
import { TemperatureController } from './temperature.controller';
import { TemperatureService } from './temperature.service';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { ProducerService } from 'src/kafka/producer/producer.service';
import { UtilService } from 'src/util/util.service';
import { redisProvider } from '../redis/redis.provider';

@Module({
  controllers: [TemperatureController],
  providers: [
    TemperatureService,
    ConsumerService,
    ProducerService,
    UtilService,
    redisProvider,
  ],
})
export class TemperatureModule {}
