import { inject, injectable } from 'tsyringe';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import User from '@modules/users/infra/typeorm/entities/User';

interface IRequest {
  user_id: string;
}

@injectable()
class ListProvidersService {
  constructor(
    @inject('UsersRepository') private usersRepository: IUserRepository,
  ) { }

  public async execute({ user_id }: IRequest): Promise<User[] | undefined> {
    const user = await this.usersRepository.findAllProviders({
      expect_user_id: user_id,
    });

    return user;
  }
}

export default ListProvidersService;
