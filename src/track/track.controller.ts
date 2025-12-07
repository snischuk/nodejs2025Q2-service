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
// import { CreateTrackDto } from './dto/create-track.dto';
// import { UpdateTrackDto } from './dto/update-track.dto';
// import { TrackService } from './track.service';

// @Controller('track')
// export class TrackController {
//   constructor(private readonly trackService: TrackService) {}

//   @Post()
//   create(@Body() createTrackDto: CreateTrackDto) {
//     return this.trackService.create(createTrackDto);
//   }

//   @Get()
//   findAll() {
//     return this.trackService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id', ParseUUIDPipe) id: string) {
//     return this.trackService.findOne(id);
//   }

//   @Put(':id')
//   update(
//     @Param('id', ParseUUIDPipe) id: string,
//     @Body() updateTrackDto: UpdateTrackDto,
//   ) {
//     return this.trackService.update(id, updateTrackDto);
//   }

//   @Delete(':id')
//   @HttpCode(HttpStatus.NO_CONTENT)
//   remove(@Param('id', ParseUUIDPipe) id: string) {
//     return this.trackService.remove(id);
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
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  async create(@Body() createTrackDto: CreateTrackDto) {
    return await this.trackService.create(createTrackDto);
  }

  @Get()
  async findAll() {
    return await this.trackService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.trackService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return await this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.trackService.remove(id);
  }
}