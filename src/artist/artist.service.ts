// import { Injectable, NotFoundException } from '@nestjs/common';
// import { DatabaseService, DbEntity } from '../database/database.service';
// import { Artist } from './entities/artist.entity';
// import { UpdateArtistDto } from './dto/update-artist.dto';
// import { CreateArtistDto } from './dto/create-artist.dto';
// import { Album } from '../album/entities/album.entity';
// import { Track } from '../track/entities/track.entity';

// @Injectable()
// export class ArtistService {
//   constructor(private databaseService: DatabaseService) {}

//   create(createArtistDto: CreateArtistDto): Artist {
//     return this.databaseService.create<Artist>(
//       DbEntity.ARTIST,
//       createArtistDto,
//     );
//   }

//   findAll(): Artist[] {
//     return this.databaseService.findAll<Artist>(DbEntity.ARTIST);
//   }

//   findOne(id: string): Artist {
//     const artist = this.databaseService.findOne<Artist>(DbEntity.ARTIST, id);

//     if (!artist) {
//       throw new NotFoundException('Artist not found');
//     }

//     return artist;
//   }

//   update(id: string, updateArtistDto: UpdateArtistDto): Artist {
//     const artist = this.findOne(id);

//     if (!artist) {
//       throw new NotFoundException('Artist not found');
//     }

//     return this.databaseService.update<Artist>(
//       DbEntity.ARTIST,
//       id,
//       updateArtistDto,
//     );
//   }

//   removeArtist(id: string): void {
//     const artist = this.findOne(id);

//     if (!artist) {
//       throw new NotFoundException('Artist not found');
//     }

//     this.databaseService.remove(DbEntity.ARTIST, id);

//     this.databaseService.favorites.artists =
//       this.databaseService.favorites.artists.filter(
//         (artistId) => artistId !== id,
//       );

//     const artistAlbums = this.databaseService
//       .findAll<Album>(DbEntity.ALBUM)
//       .filter((album) => album.artistId === id);
//     const artistTracks = this.databaseService
//       .findAll<Track>(DbEntity.TRACK)
//       .filter((track) => track.artistId === id);

//     artistAlbums.forEach((album) => {
//       album.artistId = null;
//       this.databaseService.update(DbEntity.ALBUM, album.id, album);
//     });
//     artistTracks.forEach((track) => {
//       track.artistId = null;
//       this.databaseService.update(DbEntity.TRACK, track.id, track);
//     });
//   }
// }
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { handleNotFoundException } from 'src/utils/utils';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async create(createArtistDto: CreateArtistDto) {
    return await this.prisma.artist.create({ data: createArtistDto });
  }

  async findAll() {
    return await this.prisma.artist.findMany();
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
    try {
      return await this.prisma.artist.update({
        where: { id },
        data: updateArtistDto,
      });
    } catch (error) {
      handleNotFoundException(error, 'Artist');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.artist.delete({ where: { id } });
    } catch (error) {
      handleNotFoundException(error, 'Artist');
    }
  }
}