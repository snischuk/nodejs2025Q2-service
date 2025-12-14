import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import 'dotenv/config';
import * as YAML from 'yaml';
import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { AppModule } from './app.module';
import { LoggerService } from './logger/logger.service';
import { LoggerHttpInterceptor } from './interceptors/logger.interceptor';
import { CatchEverythingFilter } from './filters/exceptions.filter';
import { AuthGuard } from './auth/auth.guard';

const PORT = process.env.NEST_APP_PORT || 4000;

async function initSwagger(app: INestApplication) {
  const file = await readFile(join(__dirname, '../doc/api.yaml'), 'utf8');
  const swaggerDocument = YAML.parse(file);

  SwaggerModule.setup('doc', app, swaggerDocument);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const loggerService = app.get(LoggerService);
  const httpAdapterHost = app.get(HttpAdapterHost);
  const jwtService = app.get(JwtService);
  const reflector = app.get(Reflector);

  app.useLogger(loggerService);
  app.useGlobalInterceptors(new LoggerHttpInterceptor(loggerService));
  app.useGlobalFilters(
    new CatchEverythingFilter(httpAdapterHost, loggerService),
  );
  app.useGlobalGuards(new AuthGuard(jwtService, reflector));
  app.useGlobalPipes(new ValidationPipe());

  await initSwagger(app);

  // === Uncomment to trigger bootstrap unhandled rejection ===
  // throw new Error(`Bootstrap error to cause it's rejection`);

  // === Uncomment to trigger uncaught exception ===
  // setTimeout(() => {
  //   throw new Error('Bootstrap error throw to log uncaught exception');
  // }, 500);

  await app.listen(PORT, () => {
    console.log(`Application is listening on port: ${PORT}`);
    console.log(`Swagger is accessible at: http://localhost:${PORT}/doc`);
  });
}

bootstrap();
