import { Controller, Get, Post, Body, Put, Query } from '@nestjs/common';
import { ProductService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get(':id')
  getProduct(@Query('id') id: string) {
    return this.productService.getProduct(id);
  }

  @Post()
  addProduct(@Body() productDto: ProductDto) {
    return this.productService.addProduct(productDto);
  }

  @Put()
  updateProduct(@Body() updateProductDto: UpdateProductDto) {
    return this.productService.updateProduct(updateProductDto);
  }
}
