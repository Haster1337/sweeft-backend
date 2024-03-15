import { Module, forwardRef } from '@nestjs/common';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Company } from './company.model';
import { JwtModule } from '@nestjs/jwt';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService],
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
    SequelizeModule.forFeature([Company]),
    forwardRef(() => JwtModule),
    SubscriptionsModule,
  ],
  exports: [CompaniesService],
})
export class CompaniesModule {}
