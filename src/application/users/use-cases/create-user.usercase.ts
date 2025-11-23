import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/users/repositories/user.repository';
import { UserDomainService } from '../../../domain/users/services/user.domain-service';
import { User } from '../../../domain/users/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly repository: IUserRepository, private readonly userDomainService: UserDomainService) {}

  async execute(dto: CreateUserDto): Promise<User> {
    await this.userDomainService.ensureEmailIsAvailable(dto.email);

    const user = User.create({ name: dto.name, email: dto.email });
    await this.repository.save(user);
    return user;
  }
}
