import { inject, injectable } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import IAppointmentRepository from '../repositories/IAppointmentRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabitityService {
  constructor(
    @inject('AppointmentRepository')
    private appointmentRepository: IAppointmentRepository,
  ) { }

  public async execute({
    provider_id,
    year,
    month,
  }: IRequest): Promise<IResponse> {
    const appointments = await this.appointmentRepository.findAllInMonthFromProvider(
      {
        provider_id,
        year,
        month,
      },
    );

    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    const currentDate = new Date(Date.now());

    const availability = eachDayArray.map(day => {
      const appointmentInDay = appointments.filter(appointment => {
        return getDate(appointment.date) === day;
      });

      const compareDate = new Date(year, month, day);

      return {
        day,
        available:
          appointmentInDay.length < 10 && isAfter(compareDate, currentDate),
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabitityService;
