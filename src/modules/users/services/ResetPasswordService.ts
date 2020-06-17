import { inject, injectable } from 'tsyringe';

import { differenceInHours } from 'date-fns';
import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface IRequest {
  token: string;
  password: string;
}

@injectable()
class ResetPassowordService {
  constructor(
    @inject('UsersRepository') private repository: IUserRepository,
    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokenRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) { }

  public async execute({ token, password }: IRequest): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(token);

    if (!userToken) {
      throw new AppError('userToken does not exists');
    }

    const user = await this.repository.findbyId(userToken.user_id);

    if (!user) {
      throw new AppError('userToken does not exists');
    }

    const tokenCreatedAt = userToken.created_at;

    if (differenceInHours(Date.now(), tokenCreatedAt) > 2) {
      throw new AppError('Token expired');
    }

    user.password = await this.hashProvider.generateHash(password);

    await this.repository.save(user);
  }
}

export default ResetPassowordService;
