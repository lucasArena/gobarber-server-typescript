import { getCustomRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import UserRepository from '../repositories/UsersRepository';
import User from '../models/User';

import authConfig from '../config/auth';

interface Request {
  email: string;
  password: string;
}

interface Response {
  user: User;
  token: string;
}

class CreateSessionService {
  public async execute({ email, password }: Request): Promise<Response> {
    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findOne({ email });

    if (!user) {
      throw Error('Incorrect email/password combination');
    }

    if (!(await compare(password, user.password))) {
      throw Error('Incorrect email/password combination');
    }

    const token = sign({}, authConfig.jwt.secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    });

    delete user.password;

    return { user, token };
  }
}

export default CreateSessionService;
