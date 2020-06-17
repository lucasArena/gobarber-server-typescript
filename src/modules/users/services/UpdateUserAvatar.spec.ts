import AppError from '@shared/errors/AppError';

import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUserAvatarService from './UpdateUserAvatarService';

let fakeStorageProvider: FakeStorageProvider;
let fakeUserRepository: FakeUsersRepository;
let updateUserAvatar: UpdateUserAvatarService;

describe('UpdateUserAvatar', () => {
  beforeEach(() => {
    fakeStorageProvider = new FakeStorageProvider();
    fakeUserRepository = new FakeUsersRepository();

    updateUserAvatar = new UpdateUserAvatarService(
      fakeUserRepository,
      fakeStorageProvider,
    );
  });
  it('should be able to update avatar file', async () => {
    const user = await fakeUserRepository.create({
      name: 'Lucas Arena',
      email: 'lucas@gmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      avatarFileName: 'avatar.jpg',
      user_id: user.id,
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('should not be able to update avatar file from a not exists user', async () => {
    await expect(
      updateUserAvatar.execute({
        avatarFileName: 'avatar.jpg',
        user_id: 'not-exists-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be delete older avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

    const user = await fakeUserRepository.create({
      name: 'Lucas Arena',
      email: 'lucas@gmail.com',
      password: '123456',
    });

    await updateUserAvatar.execute({
      avatarFileName: 'avatar.jpg',
      user_id: user.id,
    });

    await updateUserAvatar.execute({
      avatarFileName: 'avatar2.jpg',
      user_id: user.id,
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar2.jpg');
  });
});
