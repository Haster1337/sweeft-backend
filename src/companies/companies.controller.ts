import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { isCompanyGuard } from '../auth/isCompany.guard';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { SetSubscriptionDto } from './dto/set-subscription.dto';
import { UpdateCompanyInfoDto } from './dto/update-company-info.dto';

@Controller('companies')
export class CompaniesController {

    constructor(private companiesService: CompaniesService,
        private jwtService: JwtService) {}

    @UseGuards(JwtAuthGuard)
    @UseGuards(isCompanyGuard)
    @Post('/set-subscription')
    async setSubscription(@Req() req: Request, @Body() dto: SetSubscriptionDto) {
        return await this.companiesService.setSubscription(req, dto)
    }

    @UseGuards(JwtAuthGuard)
    @UseGuards(isCompanyGuard)
    @Post('/update-information')
    async changeInformation(@Req() req: Request, @Body() dto: UpdateCompanyInfoDto) {
        return await this.companiesService.updateInformation(req, dto)
    }

    @UseGuards(JwtAuthGuard)
    @UseGuards(isCompanyGuard)
    @Get('/get-workers')
    async getWorkers(@Req() req: Request) {
        return await this.companiesService.getWorkers(req)
    }
}

