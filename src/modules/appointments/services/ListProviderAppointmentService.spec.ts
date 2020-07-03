import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentService from './ListProviderAppointmentService';
import Appointment from '../infra/typeorm/entities/Appointment';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointmentService: ListProviderAppointmentService;
let fakeCacheProvider: FakeCacheProvider;

describe('ListProviderAppointmentService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeCacheProvider = new FakeCacheProvider();

    listProviderAppointmentService = new ListProviderAppointmentService(
      fakeAppointmentsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list the provider is appointments of a specific day', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 4, 20, 14, 0, 0),
      user_id: 'user-id',
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 4, 20, 15, 0, 0),
      user_id: 'user-id',
    });

    const appointments = await listProviderAppointmentService.execute({
      provider_id: 'provider',
      day: 20,
      month: 5,
      year: 2020,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
  });

  it('should be able to list the provider is appointments of a specific day with cached data', async () => {
    const appointment = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      date: new Date(2020, 4, 20, 14, 0, 0),
      user_id: 'user-id',
    });

    await listProviderAppointmentService.execute({
      provider_id: 'provider',
      day: 20,
      month: 5,
      year: 2020,
    });

    const appointments = await listProviderAppointmentService.execute({
      provider_id: 'provider',
      day: 20,
      month: 5,
      year: 2020,
    });

    const convertedAppointments = appointments.map(appointmentToConvert => ({
      ...appointmentToConvert,
      date: new Date(2020, 4, 20, 14, 0, 0),
    }));

    expect(convertedAppointments).toEqual(
      expect.arrayContaining([appointment]),
    );
  });
});
