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
    parsedBody: CreateProductDto,
    files: Array<Express.Multer.File>,
  ) {
    const user = req.user;

    if (parsedBody.category) {
      const checkCategory = await this.categoryModel.findById(
        parsedBody.category,
      );
      if (!checkCategory) {
        return new NotFoundException('Category not found');
      }
    }
    if (parsedBody.brand) {
      const checkBrand = await this.brandModel.findById(parsedBody.brand);
      if (!checkBrand) {
        return new NotFoundException('Brand not found');
      }
    }

    const images: string[] = [];
    if (files?.length) {
      for (const file of files) {
        images?.push(file.filename);
      }
    }
    const product = await this.productModel.create({
      ...parsedBody,
      images,
      createdBy: user._id,
    });
    return { message: 'Product created successfulyy', result: { product } };
  }

  async findAll() {
    const products = await this.productModel.find();
    return { message: 'Done', result: { products } };
  }

  async findOne(id: string) {
    const product = await this.productModel.findById(id);
    return { message: 'Done', result: { product } };
  }

  async update(
    req: any,
    id: string,
    parsedBody: UpdateProductDto,
    files: Array<Express.Multer.File>,
  ) {
    const user = req.user;
    const checkProduct = await this.productModel.findById(id);
    if (!checkProduct) {
      return new ConflictException('Product not found');
    }
    const updateData: any = { ...parsedBody, updatedBy: user._id };
    const images: string[] = [];
    if (files?.length) {
      for (const file of files) {
        images?.push(file.filename);
      }
    }
    const updatedProduct = await this.productModel.updateOne(
      { _id: id },
      { $set: updateData, $addToSet: { images: { $each: images } } },
    );
    return {
      message: 'Product updated successfully',
      result: updatedProduct,
    };
  }

  async removeOne(id: string) {
    const product = await this.productModel.findById(id);
    if (!product) {
      return new NotFoundException('Product not found');
    }
    await this.productModel.deleteOne({ _id: id });
    return { message: 'Product removed successfully' };
  }
}
