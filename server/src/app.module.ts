import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TemperatureModule } from './temperature/temperature.module';
import { CronModule } from './cron/cron.module';
import { CronService } from './cron/cron.service';
import { TemperatureService } from './temperature/temperature.service';
import { KafkaModule } from './kafka/kafka.module';
import { UtilService } from './util/util.service';
import { redisProvider } from './redis/redis.provider';
import { HumidityService } from './humidity/humidity.service';
import { ProductService } from './product/product.service';
import { HumidityModule } from './humidity/humidity.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TemperatureModule,
    HumidityModule,
    ProductModule,
    CronModule,
    KafkaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    CronService,
    TemperatureService,
    UtilService,
    redisProvider,
    HumidityService,
    ProductService,
  ],
})
export class AppModule {}
