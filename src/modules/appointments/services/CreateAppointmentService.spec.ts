import { uuid } from 'uuidv4';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakehashProvider';

import CreateUserService from '@modules/users/services/CreateUserService';
import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('should be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const fakeHashProvider = new FakeHashProvider();

    const fakeUsersRepository = new FakeUsersRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeUsersRepository,
    );

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'Lucas Arena',
      email: 'lucasarenasantos@gmail.com',
      password: '123456',
    });

    const appointment = await createAppointment.execute({
      date: new Date(),
      provider_id: user.id,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(user.id);
  });

  it('should not be able to create a new appoitment in the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const fakeHashProvider = new FakeHashProvider();

    const fakeUsersRepository = new FakeUsersRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeUsersRepository,
    );

    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );

    const user = await createUser.execute({
      name: 'Lucas Arena',
      email: 'lucasarenasantos@gmail.com',
      password: '123456',
    });

    const appointmentDate = new Date(2020, 4, 10, 11);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: user.id,
    });

    expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should valid if the provider code is a valid uuid on booking appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const fakeUsersRepository = new FakeUsersRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeUsersRepository,
    );

    expect(
      createAppointment.execute({
        date: new Date(),
        provider_id: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not allow to book a appoint with a provider that does not exists', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const fakeUsersRepository = new FakeUsersRepository();
    const createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeUsersRepository,
    );

    expect(
      createAppointment.execute({
        date: new Date(),
        provider_id: uuid(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
