import FakeUserRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import CreateSessionService from './CreateSessionService';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakehashProvider';

let fakeUserRepository: FakeUserRepository;
let fakeHashProvider: FakeHashProvider;
let createSessionService: CreateSessionService;
let createUserService: CreateUserService;

describe('CreateSessionService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeHashProvider = new FakeHashProvider();
    createSessionService = new CreateSessionService(
      fakeUserRepository,
      fakeHashProvider,
    );
    createUserService = new CreateUserService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    const user = await createSessionService.execute({
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    expect(user).toHaveProperty('token');
  });

  it('should not be able to authenticate with a email that does not exists', async () => {
    await expect(
      createSessionService.execute({
        email: 'johndoe@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with a wrong password', async () => {
    await createUserService.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456',
    });

    await expect(
      createSessionService.execute({
        email: 'johndoe@gmail.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
