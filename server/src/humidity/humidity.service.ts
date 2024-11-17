import { Injectable } from '@nestjs/common';
import { ProducerService } from 'src/kafka/producer/producer.service';
import { UtilService } from 'src/util/util.service';

@Injectable()
export class HumidityService {
  constructor(
    private readonly _kafka: ProducerService,
    private readonly cache: UtilService,
  ) {}

  async getHumid() {
    const humid = Math.floor(Math.random() * 11) + 20;
    try {
      await this._kafka.produce({
        topic: 'humidity-topic',
        messages: [
          {
            value: JSON.stringify({ humidity: humid }),
          },
        ],
      });
      console.log(`Humidity ${humid} sent to Kafka successfully.`);

      const key = `HumidityService:Humidity:${humid}`;
      await this.cache.cacheList(key, [{ Humidity: humid }], 7200);
      console.log(`Humidity ${humid} cached successfully.`);
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

      const avgTemp = temps.reduce((sum, temp) => sum + temp, 0) / temps.length;
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
          const humid = data[0].Humidity;
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
