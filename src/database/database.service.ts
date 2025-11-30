import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

interface DatabaseValue {
  id?: string;
}

@Injectable()
export class DatabaseService<T extends DatabaseValue> {
  private dataObject: { [id: string]: T } = {};

  public create(partial: Partial<T>): T {
    const id = uuid();
    const newValue = { id, ...partial } as T;

    this.dataObject[id] = newValue;

    return newValue;
  }

  public findAll(): T[] {
    return Object.values(this.dataObject);
  }

  public findOne(id: string): T {
    return this.dataObject[id];
  }

  public update(id: string, record: Partial<T>): T {
    this.dataObject[id] = { ...this.dataObject[id], ...record };

    return this.dataObject[id];
  }

  public remove(id: string): void {
    delete this.dataObject[id];
  }
}
