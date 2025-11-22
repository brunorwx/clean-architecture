import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';

@Injectable()
export class GetUserUseCase {
	constructor(@Inject(USER_REPOSITORY) private readonly repository: any) {}

	async execute(id: string) {
		const user = await this.repository.findById(id);
		if (!user) return null;
		return user;
	}
}
