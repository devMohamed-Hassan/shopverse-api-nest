import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UsePipes,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import {
  createCouponSchema,
  type CreateCouponDto,
} from './dto/create-coupon.dto';
import {
  type UpdateCouponDto,
  updateCouponSchema,
} from './dto/update-coupon.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod.pipe';

@Controller('/coupon')
@UseGuards(AuthGuard)
export class CouponController {
  constructor(private readonly couponService: CouponService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createCouponSchema))
  create(@Req() req: any, @Body() body: CreateCouponDto) {
    return this.couponService.create(req, body);
  }

  @Get('/find-all')
  @HttpCode(HttpStatus.OK)
  findAll(@Req() req: any) {
    return this.couponService.findAll(req);
  }

  @Get('/find-one/:id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.couponService.findOne(id);
  }

  @Patch('/update/:id')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateCouponSchema))
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateCouponDto: UpdateCouponDto,
  ) {
    return this.couponService.update(req, id, updateCouponDto);
  }

  @Delete('/remove-one/:id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.couponService.remove(id);
  }
}
