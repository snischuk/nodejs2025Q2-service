import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { CreateAlbumDto } from './dto/create-album.dto';
import { PrismaService } from '../prisma/prisma.service';
import { handleNotFoundException } from '../utils/utils';

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
