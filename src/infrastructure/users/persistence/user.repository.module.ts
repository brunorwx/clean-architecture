import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmUserRepository } from './user.orm-repository';
import { IUserRepository } from '../../../domain/users/repositories/user.repository';
import { UserOrmEntity } from './user.orm-entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity])],
  providers: [
    {
      provide: IUserRepository,
      useClass: TypeOrmUserRepository,
    },
    TypeOrmUserRepository,
  ],
  exports: [IUserRepository],
})
export class UserRepositoryModule {}
