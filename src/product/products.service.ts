import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import * as uuid from 'uuid';

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product) private productModel: typeof Product) {}

  async addProduct(productDto: ProductDto) {
    await this.productModel.create<Product>({ id: uuid.v4(), ...productDto });

    return 'Product created';
  }

  async updateProduct(updateProductDto: UpdateProductDto) {
    const { id, name, value } = updateProductDto;

    const product: Product = await this.productModel.findOne({
      where: { id },
    });

    if (!product) {
      return 'User not found';
    }
    product.name = name;
    product.value = value;

    await product.save();

    return `Product added`;
  }

  async getProduct(id: string) {
    const product: Product = await this.productModel.findOne({
      where: { id },
    });
    if (!product) {
      return 'This product doesnt exist';
    }

    return product;
  }
}
