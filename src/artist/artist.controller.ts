// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   HttpCode,
//   HttpStatus,
//   Param,
//   ParseUUIDPipe,
//   Post,
//   Put,
// } from '@nestjs/common';
// import { ArtistService } from './artist.service';
// import { CreateArtistDto } from './dto/create-artist.dto';
// import { UpdateArtistDto } from './dto/update-artist.dto';

// @Controller('artist')
// export class ArtistController {
//   constructor(private readonly artistService: ArtistService) {}

//   @Post()
//   create(@Body() createArtistDto: CreateArtistDto) {
//     return this.artistService.create(createArtistDto);
//   }

//   @Get()
//   findAll() {
//     return this.artistService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id', ParseUUIDPipe) id: string) {
//     return this.artistService.findOne(id);
//   }

//   @Put(':id')
//   update(
//     @Param('id', ParseUUIDPipe) id: string,
//     @Body() updateArtistDto: UpdateArtistDto,
//   ) {
//     return this.artistService.update(id, updateArtistDto);
//   }

//   @Delete(':id')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   remove(@Param('id', ParseUUIDPipe) id: string) {
//     return this.artistService.removeArtist(id);
//   }
// }
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  async create(@Body() createArtistDto: CreateArtistDto) {
    return await this.artistService.create(createArtistDto);
  }

  @Get()
  async findAll() {
    return await this.artistService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.artistService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return await this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.artistService.remove(id);
  }
}