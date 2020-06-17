import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakehashProvider';
import UpdateProfileService from './UpdateProfileService';

let fakeHashProvider: FakeHashProvider;
let fakeUserRepository: FakeUsersRepository;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfileService = new UpdateProfileService(
      fakeUserRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Jonh Tre',
      email: 'jonhtre@gmail.com',
    });

    expect(updatedUser.name).toBe('Jonh Tre');
    expect(updatedUser.email).toBe('jonhtre@gmail.com');
  });

  it('should not update a unexisted user', async () => {
    await expect(
      updateProfileService.execute({
        user_id: '47191217-512b-4e73-89af-5adfa273d082',
        name: 'Jonh Tre',
        email: 'jonhtre@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not able to change the email to a existed one', async () => {
    await fakeUserRepository.create({
      name: 'Jonh Doe',
      email: 'jonhtro@gmail.com',
      password: '123456',
    });

    const user = await fakeUserRepository.create({
      name: 'Jonh Doe',
      email: 'jonhtro@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        email: 'jonhtro@gmail.com',
        name: 'Jonh Tre',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Jonh Tre',
      email: 'jonhtre@gmail.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should be not able to update the password with old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Jonh Tre',
        email: 'jonhtre@gmail.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be not able to update the password with a wrong old password', async () => {
    const user = await fakeUserRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Jonh Tre',
        email: 'jonhtre@gmail.com',
        old_password: 'wrong-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
