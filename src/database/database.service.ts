import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Favorites } from '../favorites/entities/favorite.entity';

export const enum DbEntity {
  USER = 'user',
  TRACK = 'track',
  ARTIST = 'artist',
  ALBUM = 'album',
}

@Injectable()
export class DatabaseService {
  private data: { [key: string]: { [id: string]: object } } = {
    [DbEntity.USER]: {},
    [DbEntity.ALBUM]: {},
    [DbEntity.ARTIST]: {},
    [DbEntity.TRACK]: {},
  };

  favorites = {
    artists: [],
    albums: [],
    tracks: [],
  } as Favorites;

  private getDataObject(entity: DbEntity) {
    return this.data[entity];
  }

  public create<T extends object>(entity: DbEntity, dto: Omit<T, 'id'>): T {
    const id = uuid();
    const newValue = { id, ...dto } as T;

    this.getDataObject(entity)[id] = newValue;

    return newValue;
  }

  public findAll<T extends object>(entity: DbEntity) {
    return Object.values(this.getDataObject(entity)) as T[];
  }

  public findOne<T extends object>(entity: DbEntity, id: string) {
    return this.getDataObject(entity)[id] as T;
  }

  public update<T extends object>(
    entity: DbEntity,
    id: string,
    partial: Partial<T>,
  ) {
    const dataObject = this.getDataObject(entity);

    dataObject[id] = { ...dataObject[id], ...partial };

    return dataObject[id] as T;
  }

  public remove(entity: DbEntity, id: string): void {
    delete this.getDataObject(entity)[id];
  }
}
