import { ApiProperty } from '@nestjs/swagger';
import { Address } from 'viem';

export class MintNftDto {
  @ApiProperty({ required: false, type: String })
  forAddress: Address;
}
