import { IsString, IsNumber, IsArray, IsOptional, Min, IsBoolean } from 'class-validator';
import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { CreateRoomDto } from './create-room.dto';

export class UpdateRoomDto extends PartialType(
  OmitType(CreateRoomDto, [] as const)
) {} 