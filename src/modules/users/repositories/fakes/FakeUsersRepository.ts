import { uuid } from 'uuidv4';

import User from '@modules/users/infra/typeorm/entities/User';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/appointments/dtos/IFindAllProvidersDTO';

class UsersRepository implements IUserRepository {
  private fakeUserRepository: User[] = [];

  public async findAllProviders({
    expect_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let { fakeUserRepository } = this;

    if (expect_user_id) {
      fakeUserRepository = this.fakeUserRepository.filter(
        (user: User) => user.id !== expect_user_id,
      );
    }

    return fakeUserRepository;
  }

  public async findbyId(id: string): Promise<User | undefined> {
    const user = this.fakeUserRepository.find(u => u.id === id);

    return user;
  }

  public async findbyEmail(email: string): Promise<User | undefined> {
    // console.log('findByEmail', this.fakeUserRepository);
    const user = this.fakeUserRepository.find(u => u.email === email);
    return user;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuid() }, userData);
    this.fakeUserRepository.push(user);
    // console.log('create', this.fakeUserRepository);
    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.fakeUserRepository.findIndex(
      findUser => findUser.id === user.id,
    );

    this.fakeUserRepository[findIndex] = user;
    return user;
  }
}

export default UsersRepository;
