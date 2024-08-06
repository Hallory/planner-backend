import { PrismaService } from '../prisma.service';
import { Module } from '@nestjs/common';
import { TimeBlockController as TimeBlockController } from './time-block.controller';
import { TimeBlockService } from './time-block.service';

@Module({
	controllers: [TimeBlockController],
	providers: [TimeBlockService, PrismaService],
	exports: [TimeBlockService]
})
export class TimeBlockModule {}
