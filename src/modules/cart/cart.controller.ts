import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CartService } from './cart.service';
import {
  type AddToCartDto,
  addToCartSchema,
  updateCartProductSchema,
  type UpdateCartProductDto,
} from './dto/create-cart.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod.pipe';
import { type CreateCouponDto, createCouponSchema } from './../coupon/dto/create-coupon.dto';

@Controller('/cart')
@UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('/add-to-cart')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(addToCartSchema))
  addToCart(@Req() req: any, @Body() body: AddToCartDto) {
    return this.cartService.addToCart(req, body);
  }

  @Get('/get-cart')
  @HttpCode(HttpStatus.OK)
  getCart(@Req() req: any) {
    return this.cartService.getCart(req);
  }

  @Patch('/update-cart-product')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateCartProductSchema))
  updateCartProduct(@Req() req: any, @Body() body: UpdateCartProductDto) {
    return this.cartService.updateCartProduct(req, body);
  }

  @Delete('/remove-cart-product/:productId')
  @HttpCode(HttpStatus.OK)
  removeCartProduct(@Req() req: any, @Param('productId') productId: string) {
    return this.cartService.removeCartProduct(req, productId);
  }

  @Post('/apply-coupon')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(createCouponSchema))
  applyCoupon(@Req() req: any, @Body() body: CreateCouponDto) {
    return this.cartService.applyCoupon(req, body);
  }
}
