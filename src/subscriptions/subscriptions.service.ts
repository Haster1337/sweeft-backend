import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Subscription } from './subscription.model';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectModel(Subscription)
    private subscriptionRepository: typeof Subscription,
  ) {}

  findAll() {}

  async findSubscriptionByType(type: string) {
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        type: type,
      },
      include: {
        all: true,
      },
    });
    if (!subscription) {
      throw new HttpException(
        'Incorrect subscription type',
        HttpStatus.FORBIDDEN,
      );
    }
    return subscription;
  }

  async findSubscriptionById(id) {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
    });
    if (!subscription) {
        throw new HttpException(
          'Incorrect subscription id',
          HttpStatus.FORBIDDEN,
        );
      }
    return subscription;
  }
}
