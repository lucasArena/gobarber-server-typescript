import IFindAllProvidersDTO from '@modules/appointments/dtos/IFindAllProvidersDTO';
import User from '../infra/typeorm/entities/User';
import ICreateUserDTO from '../dtos/ICreateUserDTO';

export default interface IUserRepository {
  findAllProviders(data: IFindAllProvidersDTO): Promise<User[] | undefined>;
  findbyId(id: string): Promise<User | undefined>;
  findbyEmail(email: string): Promise<User | undefined>;
  create(data: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
