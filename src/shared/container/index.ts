import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IAppointmentRepository from '@modules/appointments/repositories/IAppointmentRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUserRepository from '@modules/users/repositories/IUserRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

container.registerSingleton<IUserTokenRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<IAppointmentRepository>(
  'AppointmentRepository',
  AppointmentsRepository,
);

container.registerSingleton<IUserRepository>(
  'UsersRepository',
  UsersRepository,
);
