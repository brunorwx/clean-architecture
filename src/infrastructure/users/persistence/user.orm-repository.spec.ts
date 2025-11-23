import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmUserRepository } from './user.orm-repository';
import { UserOrmEntity } from './user.orm-entity';
import { Repository } from 'typeorm';
import { User } from '../../../domain/users/entities/user.entity';

describe('TypeOrmUserRepository', () => {
  let repo: TypeOrmUserRepository;
  let ormRepo: Repository<UserOrmEntity>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [UserOrmEntity],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([UserOrmEntity]),
      ],
      providers: [TypeOrmUserRepository],
    }).compile();

    repo = moduleRef.get(TypeOrmUserRepository);
    ormRepo = moduleRef.get<Repository<UserOrmEntity>>(getRepositoryToken(UserOrmEntity));
  });

  afterAll(async () => {
    const conn = ormRepo.manager.connection;
    await conn.close();
  });

  it('should save and find user by id/email', async () => {
    const user = User.create({ name: 'Alice', email: 'alice@example.com' });
    await repo.save(user);

    const foundById = await repo.findById(user.id);
    expect(foundById).not.toBeNull();
    expect(foundById?.email).toBe('alice@example.com');

    const foundByEmail = await repo.findByEmail('alice@example.com');
    expect(foundByEmail).not.toBeNull();
    expect(foundByEmail?.id).toBe(user.id);
  });
});
