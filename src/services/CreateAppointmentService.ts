import { startOfHour } from 'date-fns';
import { isUuid } from 'uuidv4';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentsRepository';
import UsersRepository from '../repositories/UsersRepository';

import AppError from '../errors/AppError';

interface Request {
  provider_id: string;
  date: Date;
}

class CreateAppointmentService {
  public async execute({ date, provider_id }: Request): Promise<Appointment> {
    const appointmentsRepository = getCustomRepository(AppointmentRepository);
    const usersRepository = getCustomRepository(UsersRepository);

    const validUuid = isUuid(provider_id);

    if (!validUuid) {
      throw new AppError('Invalid uuid', 400);
    }

    const providerExists = await usersRepository.findOne({ id: provider_id });

    if (!providerExists) {
      throw new AppError('Provider does not exists', 401);
    }

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked', 400);
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    await appointmentsRepository.save(appointment);

    return appointment;
  }
}

export default CreateAppointmentService;
