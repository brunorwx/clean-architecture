import { Module } from '@nestjs/common';
import { UsersController } from './controllers/users.controller';
import { CreateUserUseCase } from '../../application/users/use-cases/create-user.usercase';
import { GetUserUseCase } from '../../application/users/use-cases/get-user.usecase';
import { UserRepositoryModule } from '../../infrastructure/users/persistence/user.repository.module';
import { UserDomainService } from '../../domain/users/services/user.domain-service';

@Module({
  imports: [UserRepositoryModule],
  controllers: [UsersController],
  providers: [CreateUserUseCase, GetUserUseCase, UserDomainService],
})
export class UsersModule {}
