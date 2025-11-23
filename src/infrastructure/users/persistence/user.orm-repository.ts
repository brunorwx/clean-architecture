import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../domain/users/entities/user.entity';
import { IUserRepository } from '../../../domain/users/repositories/user.repository';
import { UserOrmEntity } from './user.orm-entity';

@Injectable()
export class TypeOrmUserRepository implements IUserRepository {
  constructor(@InjectRepository(UserOrmEntity) private readonly repo: Repository<UserOrmEntity>) {}

  async save(user: User): Promise<void> {
    const orm = this.repo.create({ id: user.id, name: user.name, email: user.email });
    await this.repo.save(orm);
  }

  async findById(id: string): Promise<User | null> {
    const orm = await this.repo.findOneBy({ id });
    if (!orm) return null;
    return User.create({ id: orm.id, name: orm.name, email: orm.email });
  }

  async findByEmail(email: string): Promise<User | null> {
    const orm = await this.repo.findOneBy({ email: email.toLowerCase() });
    if (!orm) return null;
    return User.create({ id: orm.id, name: orm.name, email: orm.email });
  }
}
