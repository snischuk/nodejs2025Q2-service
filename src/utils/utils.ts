import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function handleNotFoundException(error: any, entity: string) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error?.code === 'P2025'
  ) {
    throw new NotFoundException(`${entity} not found`);
  }

  throw error;
}
