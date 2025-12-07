// import { Injectable, UnprocessableEntityException } from '@nestjs/common';
// import { Album } from '../album/entities/album.entity';
// import { Artist } from '../artist/entities/artist.entity';
// import { Track } from '../track/entities/track.entity';
// import { DatabaseService, DbEntity } from '../database/database.service';

// export type FavoritesEntityType = 'track' | 'album' | 'artist';

// @Injectable()
// export class FavoritesService {
//   constructor(private databaseService: DatabaseService) {}

//   findAll() {
//     const artists = this.databaseService.favorites.artists.map((id) =>
//       this.databaseService.findOne(DbEntity.ARTIST, id),
//     );
//     const albums = this.databaseService.favorites.albums.map((id) =>
//       this.databaseService.findOne(DbEntity.ALBUM, id),
//     );
//     const tracks = this.databaseService.favorites.tracks.map((id) =>
//       this.databaseService.findOne(DbEntity.TRACK, id),
//     );

//     return { artists, albums, tracks };
//   }

//   private validateEntity(entityType: FavoritesEntityType, id: string) {
//     let entity: Track | Album | Artist;

//     switch (entityType) {
//       case 'track':
//         entity = this.databaseService.findOne(DbEntity.TRACK, id);
//         break;
//       case 'album':
//         entity = this.databaseService.findOne(DbEntity.ALBUM, id);
//         break;
//       case 'artist':
//         entity = this.databaseService.findOne(DbEntity.ARTIST, id);
//         break;
//       default:
//         throw new UnprocessableEntityException('Invalid favorite entity type');
//     }

//     if (!entity) {
//       throw new UnprocessableEntityException(
//         `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} not found`,
//       );
//     }

//     return entity;
//   }

//   add(entityType: FavoritesEntityType, id: string) {
//     this.validateEntity(entityType, id);
//     this.databaseService.favorites[entityType + 's'].push(id);
//   }

//   remove(entityType: FavoritesEntityType, id: string) {
//     this.validateEntity(entityType, id);

//     const entityArrayName = entityType + 's';
//     const index = this.databaseService.favorites[entityArrayName].indexOf(id);

//     if (index > -1) {
//       this.databaseService.favorites[entityArrayName].splice(index, 1);
//     }
//   }
// }
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { Track } from 'src/track/entities/track.entity';

export type FavEntityType = 'track' | 'album' | 'artist';

const FAVORITES_ID = '00000000-0000-0000-0000-000000000000';

@Injectable()
export class FavoritesService {
  constructor(private prisma: PrismaService) {
    this.initFavorites();
  }

  private async initFavorites(): Promise<void> {
    const favorites = await this.prisma.favorites.findUnique({
      where: { id: FAVORITES_ID },
    });

    if (!favorites) {
      await this.prisma.favorites.create({
        data: { id: FAVORITES_ID },
      });
    }
  }

  async findAll() {
    return await this.prisma.favorites.findFirst({
      include: { artists: true, albums: true, tracks: true },
    });
  }

  private async validateEntity(entityType: FavEntityType, id: string) {
    let entity: Track | Album | Artist;

    switch (entityType) {
      case 'track':
        entity = await this.prisma.track.findUnique({ where: { id } });
        break;
      case 'album':
        entity = await this.prisma.album.findUnique({ where: { id } });
        break;
      case 'artist':
        entity = await this.prisma.artist.findUnique({ where: { id } });
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

  async add(entityType: FavEntityType, id: string) {
    await this.validateEntity(entityType, id);
    await this.prisma.favorites.update({
      where: { id: FAVORITES_ID },
      data: {
        [entityType + 's']: { connect: { id } },
      },
    });
  }

  async remove(entityType: FavEntityType, id: string) {
    const removedEntity = await this.validateEntity(entityType, id);

    if (removedEntity) {
      await this.prisma.favorites.update({
        where: { id: FAVORITES_ID },
        data: {
          [entityType + 's']: { disconnect: { id } },
        },
      });
    }
  }
}