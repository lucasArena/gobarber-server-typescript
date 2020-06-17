import 'reflect-metadata';

import AppError from '@shared/errors/AppError';
import ResetPasswordService from './ResetPasswordService';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersTokenRepository from '../repositories/fakes/FakeUsersTokenRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakehashProvider';

let fakeUsersRepository: FakeUserRepository;
let fakeUserTokensRepository: FakeUsersTokenRepository;
let resetPassoword: ResetPasswordService;
let fakeHashProvider: FakeHashProvider;

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeUserTokensRepository = new FakeUsersTokenRepository();
    fakeHashProvider = new FakeHashProvider();

    resetPassoword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Lucas Arena',
      email: 'lucasarenasantos@gmail.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPassoword.execute({
      token,
      password: '123123',
    });

    const updatedUser = await fakeUsersRepository.findbyId(user.id);

    expect(generateHash).toHaveBeenCalledWith('123123');
    expect(updatedUser?.password).toBe('123123');
  });

  it('should not be able to reset the password with none existed token', async () => {
    await expect(
      resetPassoword.execute({
        token: 'none-existed-token',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with none existed user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'none-existed-user',
    );

    await expect(
      resetPassoword.execute({
        token,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password if past more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Lucas Arena',
      email: 'lucasarenasantos@gmail.com',
      password: '123456',
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassoword.execute({
        token,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
