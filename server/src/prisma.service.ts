// src/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaServicio extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    // Esto conecta la base de datos cuando arranca el servidor
    await this.$connect();
  }
}