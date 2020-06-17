import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUserRepository from '../repositories/IUserRepository';
import User from '../infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
  old_password?: string;
}

@injectable()
class ShowProfileService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUserRepository,
  ) { }

  public async execute({ user_id }: IRequest): Promise<User> {
    const user = await this.usersRepository.findbyId(user_id);

    if (!user) {
      throw new AppError('User does not exists');
    }

    return user;
  }
}

export default ShowProfileService;
