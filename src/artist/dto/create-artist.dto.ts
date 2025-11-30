import { Artist } from '../entities/artist.entity';
import { OmitType } from '@nestjs/mapped-types';

export class CreateArtistDto extends OmitType(Artist, ['id'] as const) {}
