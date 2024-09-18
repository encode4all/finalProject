import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

function setupApiDocs(_app: INestApplication<any>) {
  const config = new DocumentBuilder()
    .setTitle('Voting dApp API')
    .setDescription(
      'The API exposes a voting dApp to cast votes, delegate and query results on chain',
    )
    .setVersion('1.0')
    .addTag('dApp')
    .addTag('web3')
    .build();
  const document = SwaggerModule.createDocument(_app, config);
  SwaggerModule.setup('api/docs', _app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: 'http://localhost:3000' },
  });

  setupApiDocs(app);
  await app.listen(3001);
}
bootstrap();
