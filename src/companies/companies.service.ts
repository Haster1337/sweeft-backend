import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Company } from './company.model';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Payload } from 'src/auth/types/interface';
import { SetSubscriptionDto } from './dto/set-subscription.dto';
import { SubscriptionsService } from 'src/subscriptions/subscriptions.service';
import { UpdateCompanyInfoDto } from './dto/update-company-info.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company) private companiesRepository: typeof Company,
    private jwtService: JwtService,
    private subscriptionsService: SubscriptionsService
    ) {}
    
  async createCompany(companyDto: CreateCompanyDto) {
    try{
      const company = await this.companiesRepository.create(companyDto);
      return company;
    } catch (e) {
      throw new ForbiddenException('Company with same values is exist')
    }
  }

  async updateInformation(req: Request, dto: UpdateCompanyInfoDto) {
    const company = await this.getCompanyByToken(req)
    if(dto.subscriptionType){
      const subscription = await this.subscriptionsService.findSubscriptionByType(dto.subscriptionType)
      const {subscriptionType, ...everything} = dto
      await company.update({...everything, subscriptionId: subscription.id})
      return company
    }

    await company.update({...dto})
    return company
  }

  async getCompanyById(id: number) {
    const company = await this.companiesRepository.findOne({
      where: { id: id },
      include: { all: true },
    });
    if(!company){
      throw new ForbiddenException('Incorrect company id')
    }
    return company;
  }

  async getCompanyByEmail(email: string) {
    const company = await this.companiesRepository.findOne({
      where: { email },
      include: { all: true },
    });
    if(!company){
      throw new ForbiddenException('Incorrect company email')
    }
    return company;
  }

  async getCompanyByName(name: string) {
    const company = await this.companiesRepository.findOne({
      where: { name },
      include: { all: true },
    });
    if(!company){
      throw new ForbiddenException('Incorrect company name')
    }
    return company;
  }

  async setSubscription(req: Request, setSubscrDto: SetSubscriptionDto) {
    const company = await this.getCompanyByToken(req);
    const subscription = await this.subscriptionsService.findSubscriptionByType(setSubscrDto.type)
    company.subscriptionId = subscription.id
    company.maxFileCount = subscription.fileCount
    await company.reload()
    return company
  }

  async getCompanyByToken(req: Request) {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken: Payload = this.jwtService.decode(token);
    const company = await this.getCompanyById(decodedToken.id)
    return company;
  }

  async getWorkers (req: Request) {
    const company = await this.getCompanyByToken(req)
    return company // .workers
  }
}
