import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { NftController } from './nft.controller';
import { AppService } from './app.service';

@Module({
  // from root of app, not this file as base
  imports: [ConfigModule.forRoot({ envFilePath: '../.env' })],
  controllers: [AppController, NftController],
  providers: [AppService],
})
export class AppModule {}
