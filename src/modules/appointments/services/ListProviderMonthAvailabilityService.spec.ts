import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabitityService from './ListProviderMonthAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderMonthAvailabitilyService: ListProviderMonthAvailabitityService;

describe('ListProviderMonthAvalibility', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailabitilyService = new ListProviderMonthAvailabitityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the month avalilability from the provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: '123',
      user_id: 'user',
      date: new Date(2020, 4, 11, 8, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: '123',
      user_id: 'user',
      date: new Date(2020, 4, 11, 9, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: '123',
      user_id: 'user',
      date: new Date(2020, 4, 11, 10, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: '123',
      user_id: 'user',
      date: new Date(2020, 4, 11, 11, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: '123',
      user_id: 'user',
      date: new Date(2020, 4, 11, 12, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: '123',
      user_id: 'user',
      date: new Date(2020, 4, 11, 13, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: '123',
      user_id: 'user',
      date: new Date(2020, 4, 11, 14, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: '123',
      user_id: 'user',
      date: new Date(2020, 4, 11, 15, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: '123',
      user_id: 'user',
      date: new Date(2020, 4, 11, 16, 0, 0),
    });
    await fakeAppointmentsRepository.create({
      provider_id: '123',
      user_id: 'user',
      date: new Date(2020, 4, 11, 17, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: '123',
      user_id: 'user',
      date: new Date(2020, 4, 21, 10, 0, 0),
    });

    const avalilability = await listProviderMonthAvailabitilyService.execute({
      provider_id: '123',
      year: 2020,
      month: 5,
    });

    expect(avalilability).toEqual(
      expect.arrayContaining([
        { day: 11, available: false },
        { day: 21, available: true },
      ]),
    );
  });
});
