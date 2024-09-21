import { ApiProperty } from '@nestjs/swagger';

export class MintNftDto {
  @ApiProperty({ type: String, required: true, default: 'ipfs://' })
  imageUri: string;

  @ApiProperty({ type: String, default: 'It is indeed non fungible' })
  description: string;
}
