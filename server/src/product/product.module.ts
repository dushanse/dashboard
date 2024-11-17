import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { ProducerService } from 'src/kafka/producer/producer.service';
import { UtilService } from 'src/util/util.service';
import { redisProvider } from '../redis/redis.provider';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    ConsumerService,
    ProducerService,
    UtilService,
    redisProvider,
  ],
})
export class ProductModule {}
