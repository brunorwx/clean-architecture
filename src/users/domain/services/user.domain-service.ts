import { IUserRepository } from '../repositories/user.repository';
import { User } from '../entities/user.entity';

export class UserDomainService {
	constructor(private readonly repository: IUserRepository) {}

	async ensureEmailIsAvailable(email: string) {
		const existing = await this.repository.findByEmail(email.toLowerCase());
		if (existing) {
			throw new Error('Email already in use');
		}
	}

	// Additional domain rules could go here
	toDomain(raw: { id: string; name: string; email: string }): User {
		return User.create(raw);
	}
}
