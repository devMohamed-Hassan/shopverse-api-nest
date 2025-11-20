import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { type CreateBrandDto, createBrandSchema } from './dto/create-brand.dto';
import { type UpdateBrandDto, updateBrandSchema } from './dto/update-brand.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer/multer.options';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { ZodValidationPipe } from 'src/common/pipes/zod.pipe';

@Controller('/brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post('/create')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('image', multerOptions()))
  @UsePipes(new ZodValidationPipe(createBrandSchema))
  create(
    @Req() req: any,
    @Body() body: CreateBrandDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }
    return this.brandService.create(req, body, file);
  }

  @Get('/find-all')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.brandService.findAll();
  }

  @Get('/find-one/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.brandService.findOne(id);
  }

  @Patch('/update/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('image', multerOptions()))
  @UsePipes(new ZodValidationPipe(updateBrandSchema))
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() body: UpdateBrandDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.brandService.update(req, id, body, file);
  }

  @Delete('/remove-one/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  removeOne(@Param('id') id: string) {
    return this.brandService.removeOne(id);
  }
}
