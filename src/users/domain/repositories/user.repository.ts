import { User } from '../entities/user.entity';

// Use an abstract class as the DI token so Nest can rely on runtime type metadata.
export abstract class IUserRepository {
  abstract save(user: User): Promise<void>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
}
