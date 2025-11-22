import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { IUserRepository } from '../../domain/repositories/user.repository';
import { UserDomainService } from '../../domain/services/user.domain-service';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class CreateUserUseCase {
	constructor(private readonly repository: IUserRepository, 
		private readonly userDomainService: UserDomainService) {}

	async execute(dto: CreateUserDto): Promise<User> {
		await this.userDomainService.ensureEmailIsAvailable(dto.email);

		const user = User.create({ name: dto.name, email: dto.email });
		await this.repository.save(user);
		return user;
	}
}
