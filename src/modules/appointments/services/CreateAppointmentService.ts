import { startOfHour } from 'date-fns';
import { isUuid } from 'uuidv4';
import { inject, injectable } from 'tsyringe';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import AppError from '@shared/errors/AppError';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import IAppointmentRepository from '../repositories/IAppointmentRepository';

interface IRequest {
  provider_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentRepository')
    private appointmentsRepository: IAppointmentRepository,
    @inject('UsersRepository')
    private usersRepository: IUserRepository,
  ) { }

  public async execute({ date, provider_id }: IRequest): Promise<Appointment> {
    const validUuid = isUuid(provider_id);

    if (!validUuid) {
      throw new AppError('Invalid uuid', 400);
    }

    const providerExists = await this.usersRepository.findbyId(provider_id);

    if (!providerExists) {
      throw new AppError('Provider does not exists', 401);
    }

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked', 400);
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
