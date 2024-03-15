import { Controller, Get } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';

@Controller('subscriptions')
export class SubscriptionsController {

    constructor(private subscriptonsService: SubscriptionsService){}

    @Get()
    async getSubscriprions () {
        return this.subscriptonsService.findAll()
    }
}
