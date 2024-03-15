import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { CreateCompanyDto } from 'src/companies/dto/create-company.dto';
import { CompaniesService } from 'src/companies/companies.service';
import { ValidateService } from './services/validate.service';
import { Payload, Tokens } from 'src/auth/types/interface';
import { User } from 'src/users/user.model';
import { Company } from 'src/companies/company.model';
import { Token } from 'src/auth/token.model';
import { JwtService } from '@nestjs/jwt';
import { add } from 'date-fns';
import { InjectModel } from '@nestjs/sequelize';
import { changePasswordDto } from 'src/companies/dto/change-password.dto';
import { Request } from 'express';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private companiesServise: CompaniesService,
    private validateService: ValidateService,
    @InjectModel(Token) private tokenRepository: typeof Token,
    private jwtService: JwtService
  ) {}

  async registrationUser(userDto: CreateUserDto) {
    const candidate = await this.usersService.getUserByEmail(userDto.email);
    console.log('1');
    if (candidate) {
      throw new HttpException(
        'User with this email is exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await this.hashPassword(userDto.password);
    const user = await this.usersService.createUser({
      ...userDto,
      password: hashPassword,
    });
    console.log('1');
    return this.generateToken(user);
  }

  async registrationCompany(companyDto: CreateCompanyDto) {
    const emailCandidate = await this.companiesServise.getCompanyByEmail(
      companyDto.email,
    );
    const nameCandidate = await this.companiesServise.getCompanyByName(
      companyDto.name,
    );

    if (emailCandidate || nameCandidate) {
      throw new HttpException(
        'Company with this email or name is exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashPassword = await this.hashPassword(companyDto.password);
    const company = await this.companiesServise.createCompany({
      ...companyDto,
      password: hashPassword,
    });
    return company;
  }

  async loginUser(userDto: CreateUserDto): Promise<Tokens> {
    const user = await this.validateService.validateUser(userDto);
    const tokens = await this.generateToken(user);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async loginCompany(companyDto: CreateCompanyDto): Promise<Tokens> {
    const company = await this.validateService.validateCompany(companyDto);
    const tokens = await this.generateToken(company);
    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async refreshTokens(refreshToken: string) {
    const token = await this.deleteToken(refreshToken);
    if (!token || token.expiresIn < new Date()) {
      throw new UnauthorizedException();
    }
    const entity = !token.userId
      ? await this.companiesServise.getCompanyById(token.companyId)
      : await this.usersService.getUserById(token.userId);
    return await this.generateToken(entity);
  }

  async deleteToken(refreshToken: string) {
    const token = await this.findToken(refreshToken);
    await this.tokenRepository.destroy({ where: { token: refreshToken } });
    return token;
  }

  async findToken(refreshToken: string) {
    const token = await this.tokenRepository.findOne({
      where: { token: refreshToken },
    });
    return token;
  }

  async generateToken(entity: User | Company): Promise<Tokens> {
    const type = entity instanceof User ? 'user' : 'company'
    const payload: Payload = { email: entity.email, id: entity.id, type: type };
    const accessToken = {
      token: 'Bearer ' + this.jwtService.sign(payload),
    };
    const refreshToken = await this.getRefreshToken(entity, payload);
    return {
      accessToken: accessToken.token,
      refreshToken,
    };
  }

  async getRefreshToken(
    entity: User | Company,
    payload: Payload,
  ) {
    const key = payload.type === "user" ? 'userId' : 'companyId';
    return await this.tokenRepository.create({
      token: this.jwtService.sign(payload, { expiresIn: '30d' }),
      expiresIn: add(new Date(), { months: 1 }),
      [key]: entity.id,
    });
  }

  private async changePassword(req: Request, dto: changePasswordDto) {
    const token = req.headers.authorization.split(" ")[1]
    const payload: Payload = await this.jwtService.decode(token)
    let entity: User | Company
    if(payload.type !== "company"){
      entity = await this.usersService.getUserByEmail(payload.email)
    } else {
      entity = await this.companiesServise.getCompanyByEmail(payload.email)
    }
    const checkPassword = await bcrypt.compare(dto.prevPassword, entity.password)
    if(!checkPassword){
      throw new ForbiddenException('Incorrect password')
    }

    return await this.updatePassword(entity, dto.newPassword)
  }

  async hashPassword(password) {
    const hashPassword = await bcrypt.hash(password, 5);
    return hashPassword;
  }

  async updatePassword(entity: User | Company,newPassword: string){
    const hashPassword = await this.hashPassword(newPassword)
    entity.password = hashPassword
    await entity.reload()
    return await this.generateToken(entity);
  }
}
