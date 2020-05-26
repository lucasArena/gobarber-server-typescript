import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import IUserRepository from '../repositories/IUserRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository') private repository: IUserRepository,
    @inject('MailProvider') private mailProvider: IMailProvider,
    @inject('UserTokenRepository')
    private userTokensRepository: IUserTokenRepository,
  ) { }

  public async execute({ email }: IRequest): Promise<void> {
    const user = await this.repository.findbyEmail(email);

    if (!user) {
      throw new AppError('Email does not exists', 400);
    }

    await this.userTokensRepository.generate(user.id);

    this.mailProvider.sendMail(
      email,
      'Pedido de recuperação de senha recebido',
    );
  }
}

export default SendForgotPasswordEmailService;
