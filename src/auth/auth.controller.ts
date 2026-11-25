import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Post, Body } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CartItem } from '../cart/schemas/cart.schema';
import { CartService } from '../cart/cart.service';
import { JwtAuthGuard } from './jwt-auth/jwt-auth.guard';
import { AdminGuard } from './admin/admin.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(@Body() user: RegisterDto) {
    return this.authService.register(user.name, user.email, user.password);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() user: LoginDto) {
    return this.authService.login(user.email, user.password);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard, AdminGuard)
  getAllUsers() {
    return this.authService.getAllUsers();
  }


  @Delete('users/:id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  deleteUser(@Param('id') userId: string) {
    return this.authService.deleteUser(userId);
  }


}
