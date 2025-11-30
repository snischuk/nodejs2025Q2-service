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
import { FavoritesEntityType, FavoritesService } from './favorites.service';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll() {
    return this.favoritesService.findAll();
  }

  @Post(':entityType/:id')
  addToFavorites(
    @Param('entityType') entityType: FavoritesEntityType,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    this.favoritesService.add(entityType, id);

    return `${
      entityType.charAt(0).toUpperCase() + entityType.slice(1)
    } successfully added to favorites`;
  }

  @Delete(':entityType/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFromFavorites(
    @Param('entityType') entityType: FavoritesEntityType,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    this.favoritesService.remove(entityType, id);
  }
}
