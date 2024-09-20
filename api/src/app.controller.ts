import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { MintNftDto } from './Dtos';

@Controller('nft')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth() {
    return 'OK';
  }

  @Get('info')
  async getNftInfo() {
    const info = await this.appService.getNftMetadata();

    return {
      result: info,
    };
  }

  @Get(':id/tokenUri')
  async getTokenUri(@Param('id') tokenId: number) {
    const tokenUri = await this.appService.getNftTokenUri(tokenId);

    return {
      result: tokenUri,
    };
  }

  @Post('mint')
  async mintNft(@Body() mintDto: MintNftDto) {
    const mintResult = await this.appService.mintNft(mintDto.tokenUri);

    return {
      result: mintResult,
    };
  }
}
