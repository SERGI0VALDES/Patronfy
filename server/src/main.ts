import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { ModuloPrincipal } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function encenderServidor() {
  // 1. Creamos la instancia de la aplicación
  const app = await NestFactory.create<NestExpressApplication>(ModuloPrincipal);
  //const app = await NestFactory.create(ModuloPrincipal);

  // Servir archivos estáticos: ahora puedes acceder a http://localhost:3000/uploads/nombre-foto.jpg
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // 2. Configuración de validaciones globales (La "Línea Clave")
  app.useGlobalPipes(new ValidationPipe({
  whitelist: true,          // Ignora datos extra que no estén en el DTO
  forbidNonWhitelisted: false, // Evita lancar error si mandan datos de mas...
  transform: true,          // Esto intenta convertir strings a números automáticamente
  }));

  // 3. Permitir que la App de celular se conecte (CORS)
  app.enableCors({
    origin: '*',
  allowedHeaders: 'Content-Type, Authorization', // Asegúrate de que Authorization esté aquí
});


  // 4. Escuchar en '0.0.0.0' para ser visible en la red local (WiFi)
  await app.listen(3000, '0.0.0.0');
  
  console.log('--- PATRONFY ---');
  console.log(`Servidor corriendo en ${await app.getUrl()}`);
}

encenderServidor();