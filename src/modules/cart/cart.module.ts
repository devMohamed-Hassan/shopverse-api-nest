import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/database/schemas/user.model';
import { JwtService } from '@nestjs/jwt';
import { Cart, cartSchema } from 'src/database/schemas/cart.model';
import { Product, productSchema } from 'src/database/schemas/product.model';
import { Coupon, couponSchema } from 'src/database/schemas/coupon.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cart.name, schema: cartSchema },
      { name: User.name, schema: userSchema },
      { name: Product.name, schema: productSchema },
      { name: Coupon.name, schema: couponSchema },
    ]),
  ],
  controllers: [CartController],
  providers: [CartService, JwtService],
})
export class CartModule {}
