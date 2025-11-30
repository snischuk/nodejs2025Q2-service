import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Album } from '../album/entities/album.entity';
import { Artist } from '../artist/entities/artist.entity';
import { Track } from '../track/entities/track.entity';
import { DatabaseService, DbEntity } from '../database/database.service';

export type FavoritesEntityType = 'track' | 'album' | 'artist';

@Injectable()
export class FavoritesService {
  constructor(private databaseService: DatabaseService) {}

  findAll() {
    const artists = this.databaseService.favorites.artists.map((id) =>
      this.databaseService.findOne(DbEntity.ARTIST, id),
    );
    const albums = this.databaseService.favorites.albums.map((id) =>
      this.databaseService.findOne(DbEntity.ALBUM, id),
    );
    const tracks = this.databaseService.favorites.tracks.map((id) =>
      this.databaseService.findOne(DbEntity.TRACK, id),
    );

    return { artists, albums, tracks };
  }

  private validateEntity(entityType: FavoritesEntityType, id: string) {
    let entity: Track | Album | Artist;

    switch (entityType) {
      case 'track':
        entity = this.databaseService.findOne(DbEntity.TRACK, id);
        break;
      case 'album':
        entity = this.databaseService.findOne(DbEntity.ALBUM, id);
        break;
      case 'artist':
        entity = this.databaseService.findOne(DbEntity.ARTIST, id);
        break;
      default:
        throw new UnprocessableEntityException('Invalid favorite entity type');
    }

    if (!entity) {
      throw new UnprocessableEntityException(
        `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} not found`,
      );
    }

    return entity;
  }

  add(entityType: FavoritesEntityType, id: string) {
    this.validateEntity(entityType, id);
    this.databaseService.favorites[entityType + 's'].push(id);
  }

  remove(entityType: FavoritesEntityType, id: string) {
    this.validateEntity(entityType, id);

    const entityArrayName = entityType + 's';
    const index = this.databaseService.favorites[entityArrayName].indexOf(id);

    if (index > -1) {
      this.databaseService.favorites[entityArrayName].splice(index, 1);
    }
  }
}
