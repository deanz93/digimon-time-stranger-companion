import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: true });
  app.setGlobalPrefix('api');
  app
    .getHttpAdapter()
    .get('/health', (_req: unknown, res: { json: (body: unknown) => void }) =>
      res.json({ ok: true, service: 'dts-api' }),
    );

  await app.listen(Number(process.env.PORT ?? 4000), '0.0.0.0');
}

void bootstrap();
