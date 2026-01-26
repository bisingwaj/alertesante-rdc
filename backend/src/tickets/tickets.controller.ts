
import { Controller, Post, Body, Get } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Channel } from '@prisma/client';

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post()
    create(@Body() body: any) {
        return this.ticketsService.createTicket({
            channel: Channel.WEB_MOBILE,
            type: body.type, // PLAINTE, RUPTURE, ALERTE
            category: body.category,

            // Geo
            province: body.province,
            cityOrTerritory: body.cityOrTerritory,
            healthZone: body.healthZone,
            structureName: body.structureName,

            // Details
            description: body.description,
            mediaUrls: body.mediaUrls, // Array, sera géré côté service pour mapping photoUrl/audioUrl

            // Qualif
            timeSince: body.timeSince,
            impactLevel: body.impactLevel,

            // Contact
            isAnonymous: body.isAnonymous,
            contactPhone: body.contactPhone,
            contactPref: body.contactPref
        });
    }

    @Get()
    findAll() {
        return this.ticketsService.findAll();
    }
}
