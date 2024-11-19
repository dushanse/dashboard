import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from 'src/kafka/consumer/consumer.service';
import { ProducerService } from 'src/kafka/producer/producer.service';
import { UtilService } from 'src/util/util.service';

@Injectable()
export class ProductService implements OnModuleInit {
  constructor(
    private readonly _kafka: ProducerService,
    private readonly cache: UtilService,
    private readonly _consumer: ConsumerService
  ) {}

  async onModuleInit() {
    await this._consumer.consume(
      'product-group',
      { topic: 'Product-topic' },
      {
        eachMessage: async ({ message }) => {
          await this.handleMessage(message);
        },
      },
    );
  }

  private async handleMessage(message: any) {
    const productData = JSON.parse(message.value.toString());
    const key = `ProductService:Product:${productData.timestamp}`;
    await this.cache.cacheList(key, [productData], 7200);
    console.log(`Cached product data: ${productData.Product} at ${productData.timestamp}`)
  }

  async getProd() {
    const timestamp = Date.now();
    const product = Math.floor(Math.random() * 11) + 20;
    try {
      await this._kafka.produce({
        topic: 'Product-topic',
        messages: [
          {
            value: JSON.stringify({ Product: product, timestamp }),
          },
        ],
      });
      console.log(`Product ${product} sent to Kafka successfully.`);
      return product;
    } catch (error) {
      console.error('Failed to send Product to Kafka:', error);
      return false;
    }
  }

  async getLastProd(): Promise<any> {
    try {
      const keys = await this.cache.getKeys('ProductService:Product:*');
      if (keys.length === 0) {
        console.log('No cached product data found.');
        return null;
      }

      const lastKey = keys.sort().reverse()[0];
      const data = await this.cache.getCache(lastKey);
      const lastProd = data.length ? data[0] : null;
      console.log(`Last cached product data:`, lastProd);

      return lastProd;
    } catch (error) {
      console.error('Failed to retrieve last cached product data:', error);
      return null;
    }
  }

  async getLastHourAvgProd(): Promise<number | null> {
    try {
      const oneHourAgo = Date.now() - 3600000;
      const keys = await this.cache.getKeys('ProductService:Product:*');
      if (keys.length === 0) {
        console.log('No cached product data found.');
        return null;
      }

      const prods = [];
      for (const key of keys) {
        const timestamp = parseInt(key.split(':').pop(), 10);
        if (timestamp >= oneHourAgo) {
          const data = await this.cache.getCache(key);
          if (data.length) {
            prods.push(data[0].Product);
          }
        }
      }

      if (prods.length === 0) {
        console.log('No product data found for the last hour.');
        return null;
      }

      const avgProd = parseFloat((prods.reduce((sum, temp) => sum + temp, 0) / prods.length).toFixed(2));
      console.log(`Average product for the last hour: ${avgProd}`);

      return avgProd;
    } catch (error) {
      console.error(
        'Failed to retrieve average product for the last hour:',
        error,
      );
      return null;
    }
  }

  async getMaxProd(): Promise<number | null> {
    try {
      const keys = await this.cache.getKeys('ProductService:Product:*');
      if (keys.length === 0) {
        console.log('No cached product data found.');
        return null;
      }

      let maxProd = -Infinity;
      for (const key of keys) {
        const data = await this.cache.getCache(key);
        if (data.length) {
          const prod = data[0].Product;
          if (prod > maxProd) {
            maxProd = prod;
          }
        }
      }

      if (maxProd === -Infinity) {
        console.log('No product data found.');
        return null;
      }

      console.log(`Maximum product: ${maxProd}`);
      return maxProd;
    } catch (error) {
      console.error('Failed to retrieve maximum product:', error);
      return null;
    }
  }
}
