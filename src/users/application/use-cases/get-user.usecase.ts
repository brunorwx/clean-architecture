import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/user.repository';

@Injectable()
export class GetUserUseCase {
	constructor(private readonly repository: IUserRepository) {}

	async execute(id: string) {
		const user = await this.repository.findById(id);
		if (!user) return null;
		return user;
	}
}
