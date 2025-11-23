import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CreateUserDto } from '../../../application/users/dto/create-user.dto';
import { CreateUserUseCase } from '../../../application/users/use-cases/create-user.usercase';
import { GetUserUseCase } from '../../../application/users/use-cases/get-user.usecase';
import { toResponse } from '../../../application/users/mappers/user.mapper';
import { UserResponse } from '../../users/responses/user.response';

@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase, private readonly getUserUseCase: GetUserUseCase) {}

  @Post()
  async create(@Body() body: CreateUserDto): Promise<UserResponse> {
    const user = await this.createUserUseCase.execute(body);
    return toResponse(user);
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<UserResponse | null> {
    const user = await this.getUserUseCase.execute(id);
    if (!user) return null;
    return toResponse(user);
  }
}
