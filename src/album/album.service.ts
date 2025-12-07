// import { Injectable, NotFoundException } from '@nestjs/common';
// import { DatabaseService, DbEntity } from '../database/database.service';
// import { Album } from './entities/album.entity';
// import { UpdateAlbumDto } from './dto/update-album.dto';
// import { CreateAlbumDto } from './dto/create-album.dto';
// import { Track } from '../track/entities/track.entity';
// import { PrismaService } from 'src/prisma/prisma.service';

// @Injectable()
// export class AlbumService {
//   constructor(private prisma: PrismaService) {}

//   create(createAlbumDto: CreateAlbumDto): Album {
//     return this.databaseService.create<Album>(DbEntity.ALBUM, createAlbumDto);
//   }

//   findAll(): Album[] {
//     return this.databaseService.findAll<Album>(DbEntity.ALBUM);
//   }

//   findOne(id: string): Album {
//     const album = this.databaseService.findOne<Album>(DbEntity.ALBUM, id);

//     if (!album) {
//       throw new NotFoundException('Album not found');
//     }

//     return album;
//   }

//   update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
//     const album = this.findOne(id);

//     if (!album) {
//       throw new NotFoundException('Album not found');
//     }

//     return this.databaseService.update<Album>(
//       DbEntity.ALBUM,
//       id,
//       updateAlbumDto,
//     );
//   }

//   removeAlbum(id: string): void {
//     const album = this.findOne(id);

//     if (!album) {
//       throw new NotFoundException('Album not found');
//     }

//     this.databaseService.remove(DbEntity.ALBUM, id);

//     this.databaseService.favorites.albums =
//       this.databaseService.favorites.albums.filter((albumId) => albumId !== id);

//     const albumTracks = this.databaseService
//       .findAll<Track>(DbEntity.TRACK)
//       .filter((track) => track.albumId === id);

//     albumTracks.forEach((track) => {
//       track.albumId = null;
//       this.databaseService.update(DbEntity.TRACK, track.id, track);
//     });
//   }
// }
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { CreateAlbumDto } from './dto/create-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { handleNotFoundException } from 'src/utils/utils';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto) {
    return await this.prisma.album.create({ data: createAlbumDto });
  }

  async findAll() {
    return await this.prisma.album.findMany();
  }

  async findOne(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto) {
    try {
      return await this.prisma.album.update({
        where: { id },
        data: updateAlbumDto,
      });
    } catch (error) {
      handleNotFoundException(error, 'Album');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.album.delete({ where: { id } });
    } catch (error) {
      handleNotFoundException(error, 'Album');
    }
  }
}