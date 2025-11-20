import { BrandDocument } from '../../database/schemas/brand.model';
import { CategoryDocument } from '../../database/schemas/category.model';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from 'src/database/schemas/product.model';
import { Model } from 'mongoose';
import { Category } from 'src/database/schemas/category.model';
import { Brand } from 'src/database/schemas/brand.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Brand.name)
    private readonly brandModel: Model<BrandDocument>,
  ) {}

  async create(
    req: any,
    body: CreateProductDto,
    files: Array<Express.Multer.File>,
  ) {
    const user = req.user;

    if (body.category) {
      const checkCategory = await this.categoryModel.findById(body.category);
      if (!checkCategory) {
        throw new NotFoundException('Category not found');
      }
    }
    if (body.brand) {
      const checkBrand = await this.brandModel.findById(body.brand);
      if (!checkBrand) {
        throw new NotFoundException('Brand not found');
      }
    }

    const images: string[] = [];
    if (files?.length) {
      for (const file of files) {
        images.push(file.filename);
      }
    }

    const productData: any = {
      ...body,
      images,
      createdBy: user._id,
    };

    const product = await this.productModel.create(productData);
    await product.populate([
      { path: 'brand', select: 'name slug image -_id' },
      { path: 'category', select: 'name slug image -_id' },
    ]);
    return { message: 'Product created successfully', result: { product } };
  }

  async findAll() {
    const products = await this.productModel
      .find()
      .populate({ path: 'brand', select: 'name slug image -_id' })
      .populate({ path: 'category', select: 'name slug image -_id' });
    return {
      message: 'Products retrieved successfully',
      result: { products },
    };
  }

  async findOne(id: string) {
    const product = await this.productModel
      .findById(id)
      .populate({ path: 'brand', select: 'name slug image -_id' })
      .populate({ path: 'category', select: 'name slug image -_id' });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return { message: 'Product retrieved successfully', result: { product } };
  }

  async update(
    req: any,
    id: string,
    body: UpdateProductDto,
    files?: Array<Express.Multer.File>,
  ) {
    const user = req.user;
    const checkProduct = await this.productModel.findById(id);
    if (!checkProduct) {
      throw new NotFoundException('Product not found');
    }

    if (body.category) {
      const checkCategory = await this.categoryModel.findById(body.category);
      if (!checkCategory) {
        throw new NotFoundException('Category not found');
      }
    }
    if (body.brand) {
      const checkBrand = await this.brandModel.findById(body.brand);
      if (!checkBrand) {
        throw new NotFoundException('Brand not found');
      }
    }

    const updateData: any = { ...body, updatedBy: user._id };
    if (files?.length) {
      const images: string[] = [];
      for (const file of files) {
        images.push(file.filename);
      }
      updateData.images = images;
    }

    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate({ path: 'brand', select: 'name slug image -_id' })
      .populate({ path: 'category', select: 'name slug image -_id' });

    return {
      message: 'Product updated successfully',
      result: { product: updatedProduct },
    };
  }

  async removeOne(id: string) {
    const product = await this.productModel.findByIdAndDelete(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return { message: 'Product removed successfully', result: {} };
  }
}
