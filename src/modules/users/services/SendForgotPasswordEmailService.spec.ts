// import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUsersTokenRepository from '../repositories/fakes/FakeUsersTokenRepository';

let fakeUsersRepository: FakeUserRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUsersTokenRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmailService', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUserRepository();
    fakeUserTokensRepository = new FakeUsersTokenRepository();
    fakeMailProvider = new FakeMailProvider();

    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recovery the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Lucas Arena',
      email: 'lucasarenasantos@gmail.com',
      password: '123456',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'lucasarenasantos@gmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recovery a none-existing user password', async () => {
    await expect(
      sendForgotPasswordEmailService.execute({
        email: 'lucasarenasantos@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Lucas Arena',
      email: 'lucasarenasantos@gmail.com',
      password: '123456',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'lucasarenasantos@gmail.com',
    });

    await expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
