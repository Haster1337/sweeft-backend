import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { CompaniesModule } from 'src/companies/companies.module';
import { ValidateService } from './services/validate.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from './token.model';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  controllers: [AuthController],
  providers: [AuthService, ValidateService],
  imports: [
    forwardRef(() => UsersModule),
    forwardRef(() => CompaniesModule),
    SequelizeModule.forFeature([Token]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY || 'secret',
      signOptions: {
        expiresIn: '24h'
      }
    }),
    MailerModule
  ],
  exports: [
    AuthModule,
    AuthService,
    ValidateService,
    JwtModule,
  ]
})
export class AuthModule {}
