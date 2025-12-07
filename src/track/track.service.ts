// import { Injectable, NotFoundException } from '@nestjs/common';
// import { DatabaseService, DbEntity } from '../database/database.service';
// import { Track } from './entities/track.entity';
// import { UpdateTrackDto } from './dto/update-track.dto';
// import { CreateTrackDto } from './dto/create-track.dto';

// @Injectable()
// export class TrackService {
//   constructor(private databaseService: DatabaseService) {}

//   create(createTrackDto: CreateTrackDto): Track {
//     return this.databaseService.create<Track>(DbEntity.TRACK, createTrackDto);
//   }

//   findAll(): Track[] {
//     return this.databaseService.findAll<Track>(DbEntity.TRACK);
//   }

//   findOne(id: string): Track {
//     const track = this.databaseService.findOne<Track>(DbEntity.TRACK, id);

//     if (!track) {
//       throw new NotFoundException('Track not found');
//     }

//     return track;
//   }

//   update(id: string, updateTrackDto: UpdateTrackDto): Track {
//     const track = this.findOne(id);

//     if (!track) {
//       throw new NotFoundException('Track not found');
//     }

//     return this.databaseService.update<Track>(
//       DbEntity.TRACK,
//       id,
//       updateTrackDto,
//     );
//   }

//   remove(id: string): void {
//     const track = this.findOne(id);

//     if (!track) {
//       throw new NotFoundException('Track not found');
//     }

//     this.databaseService.remove(DbEntity.TRACK, id);

//     this.databaseService.favorites.tracks =
//       this.databaseService.favorites.tracks.filter((trackId) => trackId !== id);
//   }
// }
import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTrackDto } from './dto/update-track.dto';
import { CreateTrackDto } from './dto/create-track.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { handleNotFoundException } from 'src/utils/utils';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto) {
    return await this.prisma.track.create({ data: createTrackDto });
  }

  async findAll() {
    return await this.prisma.track.findMany();
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (!track) {
      throw new NotFoundException('Track not found');
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    try {
      return await this.prisma.track.update({
        where: { id },
        data: updateTrackDto,
      });
    } catch (error) {
      handleNotFoundException(error, 'Track');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.track.delete({ where: { id } });
    } catch (error) {
      handleNotFoundException(error, 'Track');
    }
  }
}