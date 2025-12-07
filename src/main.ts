import 'dotenv/config';
import * as YAML from 'yaml';
import { NestFactory } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { AppModule } from './app.module';

const PORT = process.env.NEST_APP_PORT || 4000;

async function initSwagger(app: INestApplication) {
  const file = await readFile(join(__dirname, '../doc/api.yaml'), 'utf8');
  const swaggerDocument = YAML.parse(file);

  SwaggerModule.setup('doc', app, swaggerDocument);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  await initSwagger(app);

  await app.listen(PORT, () => {
    console.log(`Application is listening on port: ${PORT}`);
    console.log(`Swagger is accessible at: http://localhost:${PORT}/doc`);
  });
}

bootstrap();
