import { uuid } from 'uuidv4';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakehashProvider';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/NotificationsRepository';

import CreateUserService from '@modules/users/services/CreateUserService';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeUsersRepository: FakeUsersRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;

let createUserService: CreateUserService;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeUsersRepository,
      fakeCacheProvider,
    );
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );
  });

  it('should be able to create a new appointment', async () => {
    const provider = await createUserService.execute({
      name: 'Lucas Arena',
      email: 'lucasarenasantos@gmail.com',
      password: '123456',
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 11).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 12),
      user_id: 'userid',
      provider_id: provider.id,
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe(provider.id);
  });

  it('should not be able create a appointment with a invalid uuid provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 11).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 12),
        user_id: 'userid',
        provider_id: 'provider-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able create a appointment with a unexistent provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 11).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 12),
        user_id: 'userid',
        provider_id: uuid(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new appoitment in the same time', async () => {
    const user = await createUserService.execute({
      name: 'Lucas Arena',
      email: 'lucasarenasantos@gmail.com',
      password: '123456',
    });

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 10, 10).getTime();
    });

    await createAppointment.execute({
      date: new Date(2020, 4, 10, 11),
      user_id: 'user',
      provider_id: user.id,
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: 'user',
        provider_id: user.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should valid if the provider code is a valid uuid on booking appointment', async () => {
    expect(
      createAppointment.execute({
        date: new Date(),
        user_id: 'user',
        provider_id: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not allow to book a appoint with a provider that does not exists', async () => {
    await expect(
      createAppointment.execute({
        date: new Date(),
        user_id: 'user',
        provider_id: uuid(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment in a past date', async () => {
    const provider = await createUserService.execute({
      name: 'Lucas Arena',
      email: 'lucasarenasantos@gmail.com',
      password: '123456',
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: 'user',
        provider_id: provider.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with the user been the provider ', async () => {
    const provider = await createUserService.execute({
      name: 'Lucas Arena',
      email: 'lucasarenasantos@gmail.com',
      password: '123456',
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 10).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: provider.id,
        provider_id: provider.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8 a.m and after 5 p.m', async () => {
    const provider = await createUserService.execute({
      name: 'Lucas Arena',
      email: 'lucasarenasantos@gmail.com',
      password: '123456',
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 10).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 7),
        user_id: 'user-id',
        provider_id: provider.id,
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 18),
        user_id: 'user-id',
        provider_id: provider.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
