import { Module } from '@nestjs/common';
import { SubscriptionsController } from './subscriptions.controller';
import { SubscriptionsService } from './subscriptions.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Company } from 'src/companies/company.model';
import { Subscription } from './subscription.model';

@Module({
  controllers: [SubscriptionsController],
  providers: [SubscriptionsService],
  imports: [
    SequelizeModule.forFeature([Subscription])
  ],
  exports: [SubscriptionsService]
})
export class SubscriptionsModule {}
