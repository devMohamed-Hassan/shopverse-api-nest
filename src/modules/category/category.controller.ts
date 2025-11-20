import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
  UsePipes,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer/multer.options';
import { CategoryService } from './category.service';
import {
  createCategorySchema,
  type CreateCategorydDto,
} from './dto/create-category.dto';
import {
  updateCategorySchema,
  type UpdateCategoryDto,
} from './dto/update-category.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod.pipe';

@Controller('/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image', multerOptions()))
  @UsePipes(new ZodValidationPipe(createCategorySchema))
  create(
    @Req() req: any,
    @Body() body: CreateCategorydDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    return this.categoryService.create(req, body, file);
  }

  @Get('/find-all')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.categoryService.findAll();
  }

  @Get('/find-one/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Patch('/update/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image', multerOptions()))
  @UsePipes(new ZodValidationPipe(updateCategorySchema))
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdateCategoryDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.categoryService.update(req, id, body, file);
  }

  @Delete('/remove-one/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  removeOne(@Param('id') id: string) {
    return this.categoryService.removeOne(id);
  }
}
