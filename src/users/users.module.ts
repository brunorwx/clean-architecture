import { Module } from '@nestjs/common';
import { UsersController } from './presentation/controllers/users.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.usercase';
import { GetUserUseCase } from './application/use-cases/get-user.usecase';
import { UserRepositoryModule } from './infrastructure/persistence/user.repository.module';
import { UserDomainService } from './domain/services/user.domain-service';

@Module({
  imports: [UserRepositoryModule],
  controllers: [UsersController],
  providers: [CreateUserUseCase, GetUserUseCase, UserDomainService],
})
export class UsersModule {}
