import { ObjectID } from 'mongodb';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';
import Notification from '../../infra/typeorm/schemas/Notification';

class FakeNotificationRepository implements INotificationsRepository {
  private ormRepository: Notification[] = [];

  public async create({
    content,
    receipt_id,
  }: ICreateNotificationDTO): Promise<Notification> {
    const notification = new Notification();

    Object.assign(notification, { id: new ObjectID(), content, receipt_id });

    this.ormRepository.push(notification);

    return notification;
  }
}

export default FakeNotificationRepository;
