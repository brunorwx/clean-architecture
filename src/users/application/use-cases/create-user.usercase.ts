import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { USER_REPOSITORY, IUserRepository } from '../../domain/repositories/user.repository';
import { UserDomainService } from '../../domain/services/user.domain-service';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class CreateUserUseCase {
	constructor(
		@Inject(USER_REPOSITORY) private readonly repository: any,
	) {}

	async execute(dto: CreateUserDto): Promise<User> {
		const domainService = new UserDomainService(this.repository);
		await domainService.ensureEmailIsAvailable(dto.email);

		const user = User.create({ name: dto.name, email: dto.email });
		await this.repository.save(user);
		return user;
	}
}
