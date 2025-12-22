import { NestFactory } from '@nestjs/core';
import { ModuloPrincipal } from './app.module';

async function encenderServidor() {
  const app = await NestFactory.create(ModuloPrincipal);
  
  // Esto permite que tu App de celular se conecte al servidor
  app.enableCors(); 

  await app.listen(3000);
  console.log('--- PATRONFY ---');
  console.log('Servidor corriendo en: http://localhost:3000');
}

encenderServidor();