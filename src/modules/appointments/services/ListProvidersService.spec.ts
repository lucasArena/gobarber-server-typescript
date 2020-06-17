// import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProviders from './ListProvidersService';

let fakeUserRepository: FakeUsersRepository;
let listProviders: ListProviders;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUsersRepository();

    listProviders = new ListProviders(fakeUserRepository);
  });

  it('should be able to list the providers', async () => {
    const user1 = await fakeUserRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@gmail.com',
      password: '123456',
    });

    const user2 = await fakeUserRepository.create({
      name: 'Jonh Doe',
      email: 'jonhdoe@gmail.com',
      password: '123456',
    });

    const loggedUser = await fakeUserRepository.create({
      name: 'Jonh Qua',
      email: 'jonhqua@gmail.com',
      password: '123456',
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([user1, user2]);
  });
});
