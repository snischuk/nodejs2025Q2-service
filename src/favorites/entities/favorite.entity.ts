import { IsNotEmpty, IsArray } from 'class-validator';

export class Favorites {
  @IsNotEmpty()
  @IsArray()
  artists: string[];

  @IsNotEmpty()
  @IsArray()
  albums: string[];

  @IsNotEmpty()
  @IsArray()
  tracks: string[];
}
