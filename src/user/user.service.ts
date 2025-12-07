// import {
//   Injectable,
//   ForbiddenException,
//   NotFoundException,
//   ConflictException,
// } from '@nestjs/common';
// import { DatabaseService, DbEntity } from 'src/database/database.service';
// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdatePasswordDto } from './dto/update-password.dto';
// import { UserEntity } from './entities/user.entity';

// @Injectable()
// export class UserService {
//   constructor(private databaseService: DatabaseService) {}

//   create(createUserDto: CreateUserDto): UserEntity {
//     const user = new UserEntity({
//       ...createUserDto,
//       version: 1,
//       createdAt: Date.now(),
//       updatedAt: Date.now(),
//     });
//     const existingUser = this.databaseService
//       .findAll<UserEntity>(DbEntity.USER)
//       .find((user) => user.login === createUserDto.login);

//     if (existingUser) {
//       throw new ConflictException('User with the same login already exists');
//     }

//     const createdUser = this.databaseService.create(DbEntity.USER, user);

//     return new UserEntity(createdUser);
//   }

//   findAll(): UserEntity[] {
//     const users = this.databaseService.findAll(DbEntity.USER);

//     return users.map((user) => new UserEntity(user));
//   }

//   findOne(id: string): UserEntity {
//     const user = this.databaseService.findOne(DbEntity.USER, id);

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     return new UserEntity(user);
//   }

//   updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): UserEntity {
//     const user = this.databaseService.findOne<UserEntity>(DbEntity.USER, id);

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     if (updatePasswordDto.oldPassword !== user.password) {
//       throw new ForbiddenException('Old password is incorrect');
//     }

//     const updatedUser = this.databaseService.update(DbEntity.USER, id, {
//       password: updatePasswordDto.newPassword,
//       version: user.version + 1,
//       updatedAt: Date.now(),
//     });

//     return new UserEntity(updatedUser);
//   }

//   remove(id: string): void {
//     const user = this.findOne(id);

//     if (!user) {
//       throw new NotFoundException('User not found');
//     }

//     this.databaseService.remove(DbEntity.USER, id);
//   }
// }
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserEntity } from './entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { handleNotFoundException } from 'src/utils/utils';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.create({ data: createUserDto });

    return new UserEntity(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();

    return users.map((user) => new UserEntity(user));
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return new UserEntity(user);
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (updatePasswordDto.oldPassword !== user.password) {
      throw new ForbiddenException('Old password is incorrect');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        password: updatePasswordDto.newPassword,
        version: { increment: 1 },
      },
    });

    return new UserEntity(updatedUser);
  }

  async remove(id: string) {
    try {
      return await this.prisma.user.delete({ where: { id } });
    } catch (error) {
      handleNotFoundException(error, 'User');
    }
  }
}