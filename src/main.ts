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
  app.enableCors({
    origin: (requestOrigin, callback) => {
      if (process.env.NODE_ENV === 'production') {
        callback(new Error('Not allowed'), false);
        return;
      }
      let hostname: string;
      try {
        hostname = new URL(requestOrigin).hostname;
      } finally {
        if (hostname === 'localhost') {
          callback(null, true);
        } else {
          callback(new Error('Not allowed'), false);
        }
      }
    },
  });
  await app.listen(1399);
}

bootstrap();
