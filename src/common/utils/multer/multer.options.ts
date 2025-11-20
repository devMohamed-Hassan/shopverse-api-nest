import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';
import { Request } from 'express';

export const multerOptions = () => {
  return {
    storage: diskStorage({
      destination: './src/uploads',
      filename: (
        req: Request,
        file: Express.Multer.File,
        cb: CallableFunction,
      ) => {
        const fileName = `${Date.now()} - ${file.originalname}`;
        cb(null, fileName);
      },
    }),
    limits: {},
    fileFilter: (
      req: Request,
      file: Express.Multer.File,
      cb: CallableFunction,
    ) => {
      if (!file.mimetype.startsWith('image/')) {
        cb(new BadRequestException('Only images are allowed'), false);
      }
      cb(null, true);
    },
  };
};
