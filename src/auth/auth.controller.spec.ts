import { HttpStatus } from '@nestjs/common';
import { HTTP_CODE_METADATA } from '@nestjs/common/constants';
import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { subscribe } from 'node:diagnostics_channel';

describe('AuthController login', () => {
  it('passes credentials to the service and returns its response', async () => {
    const user = { _id: 'user-id', name: 'Test User', email: 'user@example.com', role: 0 };
    const login = jest.fn().mockResolvedValue(user);
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: { login } }],
    }).compile();
    const controller = module.get(AuthController);
    await expect(controller.login({ email: user.email, password: 'password123' }))
      .resolves.toEqual(user);
    expect(login).toHaveBeenCalledWith(user.email, 'password123');
    expect(Reflect.getMetadata(HTTP_CODE_METADATA, AuthController.prototype.login))
      .toBe(HttpStatus.OK);
  });
});
