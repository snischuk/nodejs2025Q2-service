import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class Track {
  @IsUUID(4)
  id: string;

  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @ValidateIf((_object, value) => value !== null)
  @IsNotEmpty({ message: 'Artist id is required' })
  @IsUUID(4, { message: 'Artist id must be a valid UUID v4' })
  artistId: string | null;

  @ValidateIf((_object, value) => value !== null)
  @IsNotEmpty({ message: 'Album id is required' })
  @IsUUID(4, { message: 'Album id must be a valid UUID v4' })
  albumId: string | null;

  @IsNotEmpty({ message: 'Duration is required' })
  @IsInt({ message: 'Duration must be an integer' })
  duration: number;
}
