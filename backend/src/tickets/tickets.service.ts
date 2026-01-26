
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
    TicketStatus, Gravity, Channel,
    ImpactLevel, TimeSince, ContactPreference
} from '@prisma/client';

@Injectable()
export class TicketsService {
    constructor(private prisma: PrismaService) { }

    async createTicket(data: {
        channel: Channel;
        type: string;
        category: string;
        province: string;
        cityOrTerritory: string;
        healthZone?: string;
        structureName?: string;
        description?: string;
        mediaUrls?: string[];
        timeSince?: TimeSince;
        impactLevel?: ImpactLevel;
        isAnonymous: boolean;
        contactPhone?: string;
        contactPref?: ContactPreference;
    }) {
        // 1. Calcul Gravité (Logique métier V3)
        let gravity = Gravity.NORMAL;

        // Si Impact = MANY -> GRAVE
        if (data.impactLevel === ImpactLevel.MANY) {
            gravity = Gravity.GRAVE;
        }

        // Si Type = ALERTE -> TRES GRAVE
        if (data.type === 'ALERTE_SANITAIRE') {
            gravity = Gravity.TRES_GRAVE;
        }

        // 2. ShortID
        const shortId = `RDC-${Math.floor(1000 + Math.random() * 9000)}`;

        // 3. User Handling
        let authorId = null;
        if (!data.isAnonymous && data.contactPhone) {
            const user = await this.prisma.user.upsert({
                where: { phoneNumber: data.contactPhone },
                update: {},
                create: { phoneNumber: data.contactPhone, role: 'CITOYEN' },
            });
            authorId = user.id;
        }

        // 4. Media Mapping
        const photoUrl = data.mediaUrls?.find(u => u.includes('image') || u.includes('jpg')) || null;
        const audioUrl = data.mediaUrls?.find(u => u.includes('audio') || u.includes('mp3')) || null;

        return this.prisma.ticket.create({
            data: {
                shortId,
                channel: data.channel,
                status: TicketStatus.NOUVEAU,
                gravity,

                type: data.type,
                category: data.category,

                province: data.province,
                cityOrTerritory: data.cityOrTerritory,
                healthZone: data.healthZone,
                structureName: data.structureName,

                description: data.description,
                photoUrl,
                audioUrl,

                timeSince: data.timeSince,
                impactLevel: data.impactLevel,

                isAnonymous: data.isAnonymous,
                contactPhone: data.contactPhone,
                contactPref: data.contactPref,

                authorId,
            },
        });
    }

    async findAll() {
        return this.prisma.ticket.findMany({
            orderBy: { createdAt: 'desc' },
            include: { author: true }
        });
    }
}
