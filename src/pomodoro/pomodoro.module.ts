import { Module } from '@nestjs/common';
import { PomodoroService } from './pomodoro.service';
import { PomodoroController } from './pomodoro.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [PomodoroService, PrismaService],
  controllers: [PomodoroController],
  exports: [PomodoroService, PrismaService], 
})
export class PomodoroModule {}
