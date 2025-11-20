import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon, CouponDocument } from 'src/database/schemas/coupon.model';
import { Model, Types } from 'mongoose';

@Injectable()
export class CouponService {
  constructor(
    @InjectModel(Coupon.name)
    private readonly couponModel: Model<CouponDocument>,
  ) {}

  async create(req: any, body: CreateCouponDto) {
    const user = req.user;
    const { code } = body;
    const checkCoupon = await this.couponModel.findOne({ code });
    if (checkCoupon) {
      throw new ConflictException('Coupon already exists');
    }

    const validCoupons = [
      {
        code: 'VADA-DADF-2Q-D312',
        discountPercent: 15,
        expiresAt: new Date('12-18-2025'),
      },
    ];
    const checkCouponValidation = validCoupons.find(
      (item) => item.code == code,
    );
    if (!checkCouponValidation) {
      throw new NotFoundException('Invalid coupon');
    }

    const coupon = await this.couponModel.create({
      code,
      discountPercent: checkCouponValidation.discountPercent,
      expiresAt: checkCouponValidation.expiresAt,
      createdBy: user._id,
    });
    return { message: 'Coupon created successfully', result: { coupon } };
  }

  async findAll(req?: any) {
    const coupons = await this.couponModel.find().populate({
      path: 'createdBy',
      select: 'userName email -_id',
    });
    return { message: 'Coupons retrieved successfully', result: { coupons } };
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid coupon ID');
    }
    const coupon = await this.couponModel
      .findById(id)
      .populate({ path: 'createdBy', select: 'userName email -_id' });
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    return { message: 'Coupon retrieved successfully', result: { coupon } };
  }

  async update(req: any, id: string, updateCouponDto: UpdateCouponDto) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid coupon ID');
    }
    const coupon = await this.couponModel.findById(id);
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }

    if (updateCouponDto.code && updateCouponDto.code !== coupon.code) {
      const existingCoupon = await this.couponModel.findOne({
        code: updateCouponDto.code,
      });
      if (existingCoupon) {
        throw new ConflictException('Coupon code already exists');
      }
    }

    Object.assign(coupon, updateCouponDto);
    await coupon.save();
    return { message: 'Coupon updated successfully', result: { coupon } };
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid coupon ID');
    }
    const coupon = await this.couponModel.findByIdAndDelete(id);
    if (!coupon) {
      throw new NotFoundException('Coupon not found');
    }
    return { message: 'Coupon removed successfully', result: {} };
  }
}
