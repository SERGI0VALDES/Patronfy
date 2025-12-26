import { Module } from '@nestjs/common';
import { PatronesService } from './patrones.service';
import { PatronesController } from './patrones.controller';
import { PrismaServicio } from '../prisma.service';

@Module({
  controllers: [PatronesController],
  providers: [PatronesService,
    PrismaServicio
  ],
})
export class PatronesModule {}
