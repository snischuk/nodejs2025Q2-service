import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { DatabaseService, DbEntity } from 'src/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private databaseService: DatabaseService) {}

  create(createUserDto: CreateUserDto): UserEntity {
    const user = new UserEntity({
      ...createUserDto,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    const existingUser = this.databaseService
      .findAll<UserEntity>(DbEntity.USER)
      .find((user) => user.login === createUserDto.login);

    if (existingUser) {
      throw new ConflictException('User with the same login already exists');
    }

    const createdUser = this.databaseService.create(DbEntity.USER, user);

    return new UserEntity(createdUser);
  }

  findAll(): UserEntity[] {
    const users = this.databaseService.findAll(DbEntity.USER);

    return users.map((user) => new UserEntity(user));
  }

  findOne(id: string): UserEntity {
    const user = this.databaseService.findOne(DbEntity.USER, id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserEntity(user);
  }

  updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): UserEntity {
    const user = this.databaseService.findOne<UserEntity>(DbEntity.USER, id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updatePasswordDto.oldPassword !== user.password) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const updatedUser = this.databaseService.update(DbEntity.USER, id, {
      password: updatePasswordDto.newPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    });

    return new UserEntity(updatedUser);
  }

  remove(id: string): void {
    const user = this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    this.databaseService.remove(DbEntity.USER, id);
  }
}
