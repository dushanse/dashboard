import { Module } from '@nestjs/common';
import { HumidityController } from './humidity.controller';
import { HumidityService } from './humidity.service';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { ProducerService } from 'src/kafka/producer/producer.service';
import { UtilService } from 'src/util/util.service';
import { redisProvider } from '../redis/redis.provider';

@Module({
  controllers: [HumidityController],
  providers: [
    HumidityService,
    ConsumerService,
    ProducerService,
    UtilService,
    redisProvider,
  ],
})
export class HumidityModule {}
