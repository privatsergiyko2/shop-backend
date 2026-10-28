import { Controller, HttpCode, HttpStatus } from '@nestjs/common';
import {Post, Body} from '@nestjs/common';
import {RegisterDto} from './dto/register.dto';
import {AuthService} from './auth.service';
import {LoginDto} from './dto/login.dto';
import { CartItem } from '../cart/schemas/cart.schema';
import { CartService } from '../cart/cart.service';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(@Body() user: RegisterDto) {
    return this.authService.register(user.name,user.email,user.password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() user: LoginDto) {
    return this.authService.login(user.email, user.password);
  }

}
