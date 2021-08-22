import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors();
  }
  app.useStaticAssets(join(process.cwd(), 'movie'), {
    prefix: '/movie',
  });
  app.useStaticAssets(join(process.cwd(), 'dist-front'), {
    prefix: '/',
  });
  await app.listen(1399);
}

bootstrap();
