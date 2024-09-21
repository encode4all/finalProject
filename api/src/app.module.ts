import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController, NftController } from './controllers';
import { AppService, NftService } from './services';

@Module({
  // from root of app, not this file as base
  imports: [ConfigModule.forRoot({ envFilePath: '../.env' })],
  controllers: [AppController, NftController],
  providers: [AppService, NftService],
})
export class AppModule {}
