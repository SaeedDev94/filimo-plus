import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useStaticAssets({
    root: join(process.cwd(), 'public'),
    index: ['index.html'],
  });
  if (process.env.NODE_ENV !== 'production') {
    app.enableCors();
  }
  await app.listen(1399);
}

bootstrap();
