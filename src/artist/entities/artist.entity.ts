import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class Artist {
  @IsUUID(4)
  id: string;

  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsBoolean({ message: 'Grammy status must be a boolean' })
  @IsNotEmpty({ message: 'Grammy status is required' })
  grammy: boolean;
}
