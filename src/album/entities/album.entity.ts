import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class Album {
  @IsUUID(4)
  id: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @IsInt({ message: 'Year must be an integer' })
  @IsPositive({ message: 'Year must be positive' })
  year: number;

  @ValidateIf((_object, value) => value !== null)
  @IsNotEmpty({ message: 'Artist id is required' })
  @IsUUID(4, { message: 'Artist id must be a valid UUID v4' })
  artistId: string | null;
}
