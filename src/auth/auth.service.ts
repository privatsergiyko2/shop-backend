import { ConflictException, Injectable } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User} from './schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}


  async register(name: string, email: string, password: string) {
  const  existingUser = await  this.userModel.findOne({email: email})
    if (existingUser) {
      throw new ConflictException("Email already registered");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      name,
      email,
      password: hashedPassword,
    };
    const createdUser = await this.userModel.create(newUser);
    return {
      _id: createdUser._id.toString(),
      name: createdUser.name,
      email: createdUser.email,
      role: createdUser.role,
    }
  }
}
