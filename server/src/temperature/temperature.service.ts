import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { ProducerService } from 'src/kafka/producer/producer.service';
import { UtilService } from 'src/util/util.service';

@Injectable()
export class TemperatureService implements OnModuleInit {
  constructor(
    private readonly _kafka: ProducerService,
    private readonly cache: UtilService,
    private readonly _consumer: ConsumerService
  ) {}

  async onModuleInit() {
    await this._consumer.consume(
      'temperature-group',
      { topic: 'temperature-topic' },
      {
        eachMessage: async ({ message }) => {
          await this.handleMessage(message);
        },
      },
    );
  }

  private async handleMessage(message: any) {
    const temperatureData = JSON.parse(message.value.toString());
    const key = `TemperatureService:temperature:${temperatureData.timestamp}`;
    await this.cache.cacheList(key, [temperatureData], 7200);
    console.log(`Cached temperature data: ${temperatureData.temperature} at ${temperatureData.timestamp}`)
  }

  async getTemp() {
    const temp = Math.floor(Math.random() * 11) + 20;
    const timestamp = Date.now();
    try {
      await this._kafka.produce({
        topic: 'temperature-topic',
        messages: [
          {
            value: JSON.stringify({ temperature: temp, timestamp }),
          },
        ],
      });
      console.log(`Temperature ${temp} sent to Kafka successfully.`);

      return temp;
    } catch (error) {
      console.error('Failed to send temperature to Kafka:', error);
      return false;
    }
  }

  async getLastTemp(): Promise<any> {
    try {
      const keys = await this.cache.getKeys('TemperatureService:temperature:*');
      if (keys.length === 0) {
        console.log('No cached temperature data found.');
        return null;
      }

      const lastKey = keys.sort().reverse()[0];
      const data = await this.cache.getCache(lastKey);
      const lastTemp = data.length ? data[0] : null;
      console.log(`Last cached temperature data:`, lastTemp);

      return lastTemp;
    } catch (error) {
      console.error('Failed to retrieve last cached temperature data:', error);
      return null;
    }
  }

  async getLastHourAvgTemp(): Promise<number | null> {
    try {
      const oneHourAgo = Date.now() - 3600000;
      const keys = await this.cache.getKeys('TemperatureService:temperature:*');
      if (keys.length === 0) {
        console.log('No cached temperature data found.');
        return null;
      }

      const temps = [];
      for (const key of keys) {
        const timestamp = parseInt(key.split(':').pop(), 10);
        if (timestamp >= oneHourAgo) {
          const data = await this.cache.getCache(key);
          if (data.length) {
            temps.push(data[0].temperature);
          }
        }
      }

      if (temps.length === 0) {
        console.log('No temperature data found for the last hour.');
        return null;
      }

      const avgTemp = parseFloat((temps.reduce((sum, temp) => sum + temp, 0) / temps.length).toFixed(2));
      console.log(`Average temperature for the last hour: ${avgTemp}`);

      return avgTemp;
    } catch (error) {
      console.error(
        'Failed to retrieve average temperature for the last hour:',
        error,
      );
      return null;
    }
  }

  async getMaxTemp(): Promise<number | null> {
    try {
      const keys = await this.cache.getKeys('TemperatureService:temperature:*');
      if (keys.length === 0) {
        console.log('No cached temperature data found.');
        return null;
      }

      let maxTemp = -Infinity;
      for (const key of keys) {
        const data = await this.cache.getCache(key);
        if (data.length) {
          const temp = data[0].temperature;
          if (temp > maxTemp) {
            maxTemp = temp;
          }
        }
      }

      if (maxTemp === -Infinity) {
        console.log('No temperature data found.');
        return null;
      }

      console.log(`Maximum temperature: ${maxTemp}`);
      return maxTemp;
    } catch (error) {
      console.error('Failed to retrieve maximum temperature:', error);
      return null;
    }
  }
}
