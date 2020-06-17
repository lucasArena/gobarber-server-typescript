import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from './ShowProfileService';

let fakeUserRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();

    showProfileService = new ShowProfileService(fakeUserRepository);
  });

  it('should be able to show profile', async () => {
    const user = await fakeUserRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@gmail.com',
      password: '123456',
    });

    const showUser = await showProfileService.execute({
      user_id: user.id,
    });

    expect(showUser.name).toBe('Jonh Doe');
    expect(showUser.email).toBe('jonhdoe@gmail.com');
  });

  it('should not be able to show profile of a unexisted user', async () => {
    await expect(
      showProfileService.execute({
        user_id: 'not-existed-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
