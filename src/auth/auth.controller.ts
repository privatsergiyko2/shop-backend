import { Controller } from '@nestjs/common';
import {Post, Body} from '@nestjs/common';
import {RegisterDto} from './dto/register.dto';
import {AuthService} from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {

  }


  @Post('register')
  register(@Body() user: RegisterDto) {
    return this.authService.register(user.name,user.email,user.password);
  }
}
