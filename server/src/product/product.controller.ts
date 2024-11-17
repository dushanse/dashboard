import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('api')
export class ProductController {
  constructor(private readonly _service: ProductService) {}

  @Get('product')
  async getProd() {
    const value: any = await this._service.getProd();
    return value
      ? { message: 'Product sent successfully.', Product: value }
      : { message: 'Failed to send Product.' };
  }

  @Get('lastProd')
  async getLastProd() {
    const value: any = await this._service.getLastProd();
    return value
      ? { message: 'Last product sent successfully.', product: value }
      : { message: 'Failed to send last product.' };
  }

  @Get('prodAvg')
  async getLastHourAvgProd() {
    const value: any = await this._service.getLastHourAvgProd();
    return value
      ? { message: 'avg product sent successfully.', product: value }
      : { message: 'Failed to send avg product.' };
  }

  @Get('maxProd')
  async getMaxProd() {
    const value: any = await this._service.getMaxProd();
    return value
      ? { message: 'max product sent successfully.', product: value }
      : { message: 'Failed to send max product.' };
  }
}
