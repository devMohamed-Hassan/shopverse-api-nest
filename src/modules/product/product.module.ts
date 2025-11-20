import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, productSchema } from 'src/database/schemas/product.model';
import { User, userSchema } from 'src/database/schemas/user.model';
import { JwtService } from '@nestjs/jwt';
import { Category, categorySchema } from 'src/database/schemas/category.model';
import { Brand, brandSchema } from 'src/database/schemas/brand.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: userSchema },
      { name: Product.name, schema: productSchema },
      { name: Category.name, schema: categorySchema },
      { name: Brand.name, schema: brandSchema },
    ]),
  ],
  controllers: [ProductController],
  providers: [ProductService, JwtService],
})
export class ProductModule {}
