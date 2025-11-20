import {
  MongooseModule,
  Prop,
  Schema,
  SchemaFactory,
  Virtual,
} from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import {
  GenderEnum,
  ProviderEnum,
  RoleEnum,
} from 'src/shared/types/user.types';
import { IUser } from 'src/shared/interfaces/user.interface';
import type { IOtp } from 'src/shared/interfaces/user.interface';
import { hash } from 'src/common/utils/security/hash.utils';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User implements IUser {
  @Prop({
    type: String,
    minlength: 3,
    maxlength: 10,
    trim: true,
  })
  firstName: string;

  @Prop({
    type: String,
    minlength: 3,
    maxlength: 10,
    trim: true,
  })
  lastName: string;

  @Prop({
    type: String,
    required: true,
    minlength: 3,
    maxlength: 27,
    trim: true,
    unique: true,
  })
  userName: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  })
  email: string;

  @Prop({ type: Date })
  confirmEmail: Date;

  @Prop({ type: Object })
  emailOtp: IOtp;

  @Prop({
    type: String,
    minlength: 3,
    maxlength: 20,
    trim: true,
    required: function (this: HydratedDocument<User>) {
      return this.provider == ProviderEnum.SYSTEM ? true : false;
    },
  })
  password: string;

  @Prop({
    type: String,
    enum: Object.values(ProviderEnum),
    default: ProviderEnum.SYSTEM,
  })
  provider: ProviderEnum;

  @Prop({ type: Number, min: 16, max: 120 })
  age: number;

  @Prop({ type: String })
  phone: string;

  @Prop({ type: String, enum: Object.values(RoleEnum), default: RoleEnum.USER })
  role: RoleEnum;

  @Prop({
    type: String,
    enum: Object.values(GenderEnum),
    default: GenderEnum.MALE,
  })
  gender: GenderEnum;

  @Prop({ type: Date })
  credentialsChangedAt: Date;

  @Prop({ type: Object })
  passwordOtp: IOtp;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Boolean, default: false })
  isBlocked: boolean;

  @Prop({ type: Date })
  lastLogin: Date;
}

export const userSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
export const UserModel = MongooseModule.forFeature([
  { name: User.name, schema: userSchema },
]);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await hash(this.password);
  }
  next();
});

userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ userName: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ isBlocked: 1 });
