import {
  Controller,
  Get,
  Param,
  Delete,
  Patch,
  Body,
  Post,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model} from 'mongoose';
import { Product } from '../schemas/product.schema';
import { Counter } from '../schemas/counter.schema';
import {UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../auth/jwt-auth/jwt-auth.guard';
import {AdminGuard} from '../auth/admin/admin.guard';

@Controller('products')
export class ProductsController {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  @Get()
  async getProducts(@Query('favorites') favorites: number) {
    const filter: any = {}
    if (Number(favorites)) {
      filter['favorite'] = !!favorites;
    }
    return {
      products: await this.productModel.find(
        filter
      ),
    };
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return await this.productModel.findOne({
      _id: id,
    });
  }



  @Patch(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async updateProduct(@Param('id') id: string, @Body() body: Partial<Product>) {
    const productUpdate = await this.productModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!productUpdate) {
      throw new NotFoundException('Product not found');
    }
    return productUpdate;
  }

  @Post('add')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async addProduct(@Body() body: any) {
    return await this.productModel.create(body);
  }




  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  async deleteProduct(@Param('id') id: string) {
    const deleteProd = await this.productModel.findByIdAndDelete(id);
    if (!deleteProd) {
      throw new NotFoundException();
    }
    return deleteProd;
  }
}
