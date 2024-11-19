import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { ProducerService } from 'src/kafka/producer/producer.service';
import { UtilService } from 'src/util/util.service';

@Injectable()
export class HumidityService implements OnModuleInit {
  constructor(
    private readonly _kafka: ProducerService,
    private readonly _consumer: ConsumerService,
    private readonly cache: UtilService,
  ) {}

  async onModuleInit() {
    await this._consumer.consume(
      'humidity-group',
      { topic: 'humidity-topic' },
      {
        eachMessage: async ({ message }) => {
          await this.handleMessage(message);
        },
      },
    );
  }

  private async handleMessage(message: any) {
    const humidityData = JSON.parse(message.value.toString());
    const key = `HumidityService:Humidity:${humidityData.timestamp}`;
    await this.cache.cacheList(key, [humidityData], 7200);
    console.log(`Cached humidity data: ${humidityData.humidity} at ${humidityData.timestamp}`)
  }

  async getHumid() {
    const timestamp = Date.now();
    const humid = Math.floor(Math.random() * 11) + 20;
    try {
      await this._kafka.produce({
        topic: 'humidity-topic',
        messages: [
          {
            value: JSON.stringify({ humidity: humid, timestamp }),
          },
        ],
      });
      console.log(`Humidity ${humid} sent to Kafka successfully.`);
      return humid;
    } catch (error) {
      console.error('Failed to send Humidity to Kafka:', error);
      return false;
    }
  }

  async getLastHumid(): Promise<any> {
    try {
      const keys = await this.cache.getKeys('HumidityService:Humidity:*');
      if (keys.length === 0) {
        console.log('No cached humidity data found.');
        return null;
      }

      const lastKey = keys.sort().reverse()[0];
      const data = await this.cache.getCache(lastKey);
      const lastHumid = data.length ? data[0] : null;
      console.log(`Last cached humidity data:`, lastHumid);

      return lastHumid;
    } catch (error) {
      console.error('Failed to retrieve last cached humidity data:', error);
      return null;
    }
  }

  async getLastHourAvgHumid(): Promise<number | null> {
    try {
      const oneHourAgo = Date.now() - 3600000;
      const keys = await this.cache.getKeys('HumidityService:Humidity:*');
      if (keys.length === 0) {
        console.log('No cached humidity data found.');
        return null;
      }

      const temps = [];
      for (const key of keys) {
        const timestamp = parseInt(key.split(':').pop(), 10);
        if (timestamp >= oneHourAgo) {
          const data = await this.cache.getCache(key);
          if (data.length) {
            temps.push(data[0].humidity);
          }
        }
      }

      if (temps.length === 0) {
        console.log('No humidity data found for the last hour.');
        return null;
      }

      const avgTemp = parseFloat((temps.reduce((sum, temp) => sum + temp, 0) / temps.length).toFixed(2));
      console.log(`Average humidity for the last hour: ${avgTemp}`);

      return avgTemp;
    } catch (error) {
      console.error(
        'Failed to retrieve average humidity for the last hour:',
        error,
      );
      return null;
    }
  }

  async getMaxHumid(): Promise<number | null> {
    try {
      const keys = await this.cache.getKeys('HumidityService:Humidity:*');
      if (keys.length === 0) {
        console.log('No cached humidity data found.');
        return null;
      }

      let maxHumid = -Infinity;
      for (const key of keys) {
        const data = await this.cache.getCache(key);
        if (data.length) {
          const humid = data[0].humidity;
          if (humid > maxHumid) {
            maxHumid = humid;
          }
        }
      }

      if (maxHumid === -Infinity) {
        console.log('No humidity data found.');
        return null;
      }

      console.log(`Maximum humidity: ${maxHumid}`);
      return maxHumid;
    } catch (error) {
      console.error('Failed to retrieve maximum humidity:', error);
      return null;
    }
  }
}
