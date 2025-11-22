import { User } from '../../domain/entities/user.entity';
import { UserResponse } from '../../presentation/responses/user.response';

export function toResponse(user: User): UserResponse {
  return { id: user.id, name: user.name, email: user.email };
}
