import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmUserRepository } from './user.orm-repository';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { UserOrmEntity } from './user.orm-entity';

@Module({
	imports: [TypeOrmModule.forFeature([UserOrmEntity])],
	providers: [
		{
			provide: USER_REPOSITORY,
			useClass: TypeOrmUserRepository,
		},
		TypeOrmUserRepository,
	],
	exports: [USER_REPOSITORY],
})
export class UserRepositoryModule {}
