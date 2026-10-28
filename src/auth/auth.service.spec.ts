import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';

describe('AuthService login', () => {
  let service: AuthService;
  const exec = jest.fn();
  const userModel = { findOne: jest.fn(() => ({ exec })) };
  let user: { _id: string; name: string; email: string; password: string; role: number };

  beforeEach(async () => {
    jest.clearAllMocks();
    user = {
      _id: '507f1f77bcf86cd799439011',
      name: 'Test User',
      email: 'user@example.com',
      password: await bcrypt.hash('correct-password', 4),
      role: 0,
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('returns public user data for a matching bcrypt password', async () => {
    exec.mockResolvedValue(user);
    const result = await service.login(user.email, 'correct-password');
    expect(userModel.findOne).toHaveBeenCalledWith({ email: user.email });
    expect(result).toEqual({
      _id: user._id, name: user.name, email: user.email, role: user.role,
    });
    expect(result).not.toHaveProperty('password');
  });

  it('rejects an unknown email', async () => {
    exec.mockResolvedValue(null);
    await expect(service.login('unknown@example.com', 'correct-password'))
      .rejects.toThrow(new UnauthorizedException('Invalid email or password'));
  });

  it('rejects a wrong password with the same error', async () => {
    exec.mockResolvedValue(user);
    await expect(service.login(user.email, 'wrong-password'))
      .rejects.toThrow(new UnauthorizedException('Invalid email or password'));
  });
});
