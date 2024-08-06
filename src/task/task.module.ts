import { PrismaService } from '../prisma.service';
import { Module } from '@nestjs/common';
import { TaskController as TaskController } from './task.controller';
import { TaskService } from './task.service';

@Module({
	controllers: [TaskController],
	providers: [TaskService, PrismaService],
	exports: [TaskService]
})
export class TaskModule {}
