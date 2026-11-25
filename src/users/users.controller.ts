import { Body, Controller, Get, Patch, Req } from '@nestjs/common';
import { Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() request: Request & { user: { userId: string } }) {
    return this.usersService.getProfile(request.user.userId);
  }

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  updateProfile(
    @Req() request: Request & { user: { userId: string } },
    @Body() body: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(
      request.user.userId,
      body.name,
      body.phone,
    );
  }

  @Patch('me/password')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @Req() request: Request & { user: { userId: string } },
    @Body() body: ChangePasswordDto,
  ) {
    return this.usersService.changePassword(
      request.user.userId,
      body.newPassword,
      body.currentPassword,
    );
  }
}
