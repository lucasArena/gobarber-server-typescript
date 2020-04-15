import { startOfHour } from 'date-fns';
import { isUuid } from 'uuidv4';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentsRepository';
import UsersRepository from '../repositories/UsersRepository';

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
      throw Error('Invalid uuid');
    }

    const providerExists = await usersRepository.findOne({ id: provider_id });

    if (!providerExists) {
      throw Error('Provider does not exists');
    }

    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw Error('This appointment is already booked');
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
