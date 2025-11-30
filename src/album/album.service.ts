import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService, DbEntity } from '../database/database.service';
import { Album } from './entities/album.entity';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { CreateAlbumDto } from './dto/create-album.dto';
// import { Track } from '../track/entities/track.entity';

@Injectable()
export class AlbumService {
  constructor(private databaseService: DatabaseService) {}

  create(createAlbumDto: CreateAlbumDto): Album {
    return this.databaseService.create<Album>(DbEntity.ALBUM, createAlbumDto);
  }

  findAll(): Album[] {
    return this.databaseService.findAll<Album>(DbEntity.ALBUM);
  }

  findOne(id: string): Album {
    const album = this.databaseService.findOne<Album>(DbEntity.ALBUM, id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    const album = this.findOne(id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return this.databaseService.update<Album>(
      DbEntity.ALBUM,
      id,
      updateAlbumDto,
    );
  }

  removeAlbum(id: string): void {
    const album = this.findOne(id);

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    this.databaseService.remove(DbEntity.ALBUM, id);

    this.databaseService.favorites.albums =
      this.databaseService.favorites.albums.filter((albumId) => albumId !== id);

    // const albumTracks = this.databaseService
    //   .findAll<Track>(DbEntity.TRACK)
    //   .filter((track) => track.albumId === id);

    // albumTracks.forEach((track) => {
    //   track.albumId = null;
    //   this.databaseService.update(DbEntity.TRACK, track.id, track);
    // });
  }
}
