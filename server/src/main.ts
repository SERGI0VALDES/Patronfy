import { NestFactory } from '@nestjs/core';
import { ModuloPrincipal } from './app.module';

async function encenderServidor() {
  const app = await NestFactory.create(ModuloPrincipal);
  
  // Esto permite que la App de celular se conecte al servidor
  app.enableCors(); 

  // Añadimos '0.0.0.0' para que escuche en toda la red local
  await app.listen(3000, '0.0.0.0');
  console.log('--- PATRONFY :) ---');
  console.log(`Servidor corriendo en > ${await app.getUrl()}`);
}

encenderServidor();