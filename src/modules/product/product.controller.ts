import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFiles,
  NotFoundException,
  HttpCode,
  HttpStatus,
  UsePipes,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  type CreateProductDto,
  createProductSchema,
} from './dto/create-product.dto';
import {
  updateProductSchema,
  type UpdateProductDto,
} from './dto/update-product.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer/multer.options';
import { ZodValidationPipe } from 'src/common/pipes/zod.pipe';

@Controller('/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FilesInterceptor('images', 5, multerOptions()))
  @UsePipes(new ZodValidationPipe(createProductSchema))
  create(
    @Req() req: any,
    @Body() body: CreateProductDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one image is required');
    }
    return this.productService.create(req, body, files);
  }

  @Get('/find-all')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.productService.findAll();
  }

  @Get('/find-one/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch('/update/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor('images', 5, multerOptions()))
  @UsePipes(new ZodValidationPipe(updateProductSchema))
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
    @UploadedFiles() files?: Array<Express.Multer.File>,
  ) {
    return this.productService.update(req, id, body, files);
  }

  @Delete('/remove-one/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  removeOne(@Param('id') id: string) {
    return this.productService.removeOne(id);
  }
}
