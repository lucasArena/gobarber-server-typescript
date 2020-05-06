import { getCustomRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import UserRepository from '../repositories/UsersRepository';
import User from '../models/User';

import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface UserRequest {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({
    user_id,
    avatarFileName,
  }: UserRequest): Promise<User> {
    const userRepository = getCustomRepository(UserRepository);

    const user = await userRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Only autheticated user can change a avatar', 401);
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

      const avatarFileExists = await fs.promises.stat(userAvatarFilePath);

      if (avatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFileName;
    await userRepository.save(user);

    delete user.password;

    return user;
  }
}

export default UpdateUserAvatarService;
