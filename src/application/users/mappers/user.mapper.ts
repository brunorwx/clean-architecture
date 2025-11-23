import { User } from '../../../domain/users/entities/user.entity';
import { UserResponse } from '../../../presentation/users/responses/user.response';

export function toResponse(user: User): UserResponse {
  return { id: user.id, name: user.name, email: user.email };
}
