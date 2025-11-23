import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { CreateUserUseCase } from '../../../application/users/use-cases/create-user.usercase';
import { GetUserUseCase } from '../../../application/users/use-cases/get-user.usecase';
import { IUserRepository } from '../../../domain/users/repositories/user.repository';

describe('UsersController', () => {
  let controller: UsersController;
  let mockRepo: Partial<IUserRepository>;

  beforeEach(async () => {
    mockRepo = {
      save: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn().mockResolvedValue(null),
      findByEmail: jest.fn().mockResolvedValue(null),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        CreateUserUseCase,
        GetUserUseCase,
        { provide: IUserRepository, useValue: mockRepo },
      ],
    }).compile();

    controller = moduleRef.get(UsersController);
  });

  it('creates a user', async () => {
    const dto = { name: 'Bob', email: 'bob@example.com' };
    const res = await controller.create(dto as any);
    expect(res).toHaveProperty('id');
    expect(res).toHaveProperty('email', 'bob@example.com');
  });
});
