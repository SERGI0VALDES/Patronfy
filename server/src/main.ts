import { NestFactory } from '@nestjs/core';
import { ModuloPrincipal } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function encenderServidor() {
  // 1. Creamos la instancia de la aplicación
  const app = await NestFactory.create(ModuloPrincipal);

  // 2. Configuración de validaciones globales (La "Línea Clave")
  // Esto filtrará los datos que entran a tus controladores
  app.useGlobalPipes(new ValidationPipe({
  whitelist: true,          // Ignora datos extra que no estén en el DTO
  forbidNonWhitelisted: false, // No lances error si mandan datos de más
  transform: true,          // <--- ¡ESTO! Intenta convertir strings a números automáticamente
  }));

  // 3. Permitir que la App de celular se conecte (CORS)
  app.enableCors({
    origin: '*',
  allowedHeaders: 'Content-Type, Authorization', // Asegúrate de que Authorization esté aquí
});


  // 4. Escuchar en '0.0.0.0' para ser visible en la red local (WiFi)
  await app.listen(3000, '0.0.0.0');
  
  console.log('--- PATRONFY :) ---');
  console.log(`Servidor corriendo en > ${await app.getUrl()}`);
}

encenderServidor();