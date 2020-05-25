// import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeUserRepository from '../repositories/fakes/FakeUsersRepository';

describe('SendForgotPasswordEmailService', () => {
  it('should be able to recovery the password using the email', async () => {
    const fakeUserRepository = new FakeUserRepository();
    const fakeMailProvider = new FakeMailProvider();
    const sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
    );

    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUserRepository.create({
      name: 'Lucas Arena',
      email: 'lucasarenasantos@gmail.com',
      password: '123456',
    });

    await sendForgotPasswordEmailService.execute({
      email: 'lucasarenasantos@gmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });
});
