import { UserDomainService } from './user.domain-service';

describe('UserDomainService', () => {
  it('throws when email already exists', async () => {
    const mockRepo = {
      findByEmail: jest.fn().mockResolvedValue({ id: '1', name: 'x', email: 'a@b.com' }),
    } as any;

    const svc = new UserDomainService(mockRepo);
    await expect(svc.ensureEmailIsAvailable('a@b.com')).rejects.toThrow('Email already in use');
  });

  it('does not throw when email is available', async () => {
    const mockRepo = { findByEmail: jest.fn().mockResolvedValue(null) } as any;
    const svc = new UserDomainService(mockRepo);
    await expect(svc.ensureEmailIsAvailable('new@example.com')).resolves.toBeUndefined();
  });
});
