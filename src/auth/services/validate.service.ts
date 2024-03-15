import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Company } from 'src/companies/company.model';
import { User } from 'src/users/user.model';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { CreateCompanyDto } from 'src/companies/dto/create-company.dto';
import { UsersService } from 'src/users/users.service';
import { CompaniesService } from 'src/companies/companies.service';

@Injectable()
export class ValidateService {
  constructor(
    private usersService: UsersService,
    private companiesServise: CompaniesService,
  ) {}

  async validateUser(userDto: CreateUserDto) {
    const user = await this.usersService.getUserByEmail(userDto.email);

    return await this.validate(user, userDto.password);
  }

  async validateCompany(companyDto: CreateCompanyDto) {
    const company = await this.companiesServise.getCompanyByEmail(
      companyDto.email,
    );
    return await this.validate(company, companyDto.password);
  }

  private async validate(entity: Company | User, password: string) {
    const passwordEquals = await bcrypt.compare(password, entity.password);

    if (entity && passwordEquals) {
      return entity;
    }

    throw new UnauthorizedException({ message: 'Incorrect email or password' });
  }

}
