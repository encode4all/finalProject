import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { NftService } from '../services/nft.service';
import { MintNftDto } from '../Dtos';

@Controller('api/nft')
export class NftController {
  constructor(private readonly nftService: NftService) {}

  @Get('info')
  async getNftInfo() {
    const info = await this.nftService.getNftMetadata();

    return {
      result: info,
    };
  }

  @Get(':id/tokenUri')
  async getTokenUri(@Param('id') tokenId: number) {
    const tokenUri = await this.nftService.getNftTokenUri(tokenId);

    return {
      result: tokenUri,
    };
  }

  @Post('mint')
  async mintNft(@Body() mintDto: MintNftDto) {
    const mintResult = await this.nftService.mintNft(mintDto.forAddress);

    return {
      result: mintResult,
    };
  }

  @Get('preview')
  async getNftPreviewUrl() {
    const imagePreviewUrl = await this.nftService.getPreviewUrl();

    return {
      imagePreviewUrl,
    };
  }
}
