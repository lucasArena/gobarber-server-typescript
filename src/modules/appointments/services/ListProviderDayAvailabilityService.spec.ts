import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

describe('ListProviderMonthAvalibility', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the avalability from provider', async () => {
    await fakeAppointmentsRepository.create({
      provider_id: '123',
      user_id: 'user',
      date: new Date(2020, 3, 20, 15, 0, 0),
    });

    await fakeAppointmentsRepository.create({
      provider_id: '123',
      user_id: 'user',
      date: new Date(2020, 3, 20, 14, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 3, 20, 11).getTime();
    });

    const avalilability = await listProviderDayAvailabilityService.execute({
      provider_id: '123',
      day: 20,
      month: 4,
      year: 2020,
    });

    expect(avalilability).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false },
        { hour: 9, available: false },
        { hour: 10, available: false },
        { hour: 14, available: false },
        { hour: 15, available: false },
        { hour: 16, available: true },
        { hour: 17, available: true },
      ]),
    );
  });
});
