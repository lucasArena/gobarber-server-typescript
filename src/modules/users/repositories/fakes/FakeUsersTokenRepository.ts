import { uuid } from 'uuidv4';

import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import IUserTokenRepository from '../IUserTokenRepository';

class FakeUsersTokenRepository implements IUserTokenRepository {
  private fakeUserRepository: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, { id: uuid(), token: uuid(), user_id });

    this.fakeUserRepository.push(userToken);

    return userToken;
  }
}

export default FakeUsersTokenRepository;
