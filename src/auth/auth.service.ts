import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User} from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
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

  async login(email: string, password: string) {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user._id.toString(),
    })

    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      access_token: accessToken,
    };
  }
}
