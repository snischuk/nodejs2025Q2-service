import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { FavEntityType, FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async findAll() {
    return await this.favoritesService.findAll();
  }

  @Post(':entityType/:id')
  async addToFavorites(
    @Param('entityType') entityType: FavEntityType,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.favoritesService.add(entityType, id);

    return `${
      entityType.charAt(0).toUpperCase() + entityType.slice(1)
    } successfully added to favorites`;
  }

  @Delete(':entityType/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeFromFavorites(
    @Param('entityType') entityType: FavEntityType,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.favoritesService.remove(entityType, id);
  }
}
