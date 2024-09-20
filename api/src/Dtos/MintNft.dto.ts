import { ApiProperty } from '@nestjs/swagger';

export class MintNftDto {
  @ApiProperty({ type: String, required: true, default: 'ipfs://' })
  tokenUri: string;
}
