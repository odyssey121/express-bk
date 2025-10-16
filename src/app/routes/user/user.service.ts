
import prisma from '../../../prisma/prisma-client';
import HttpException from '../../models/http-exception.model';
import bcrypt from 'bcryptjs'
import {UserInput} from "./user-input.model";
import {UserModel} from "./user.model"

const checkUserUniqueness = async (email: string, username: string) => {
  const existingUserByEmail = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  const existingUserByUsername = await prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
    },
  });

  if (existingUserByEmail || existingUserByUsername) {
    throw new HttpException(422, {
      errors: {
        ...(existingUserByEmail ? { email: ['has already been taken'] } : {}),
        ...(existingUserByUsername ? { username: ['has already been taken'] } : {}),
      },
    });
  }
};

export const createUser = async (input: UserInput): Promise<Partial<UserModel>> => {
  const email = input.email?.trim();
  const username = input.username?.trim();
  const password = input.password?.trim();

  if (!email) {
    throw new HttpException(422, { errors: { email: ["can't be blank"] } });
  }

  if (!username) {
    throw new HttpException(422, { errors: { username: ["can't be blank"] } });
  }

  if (!password) {
    throw new HttpException(422, { errors: { password: ["can't be blank"] } });
  }

  await checkUserUniqueness(email, username);

  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword
    },
    select: {
      id: true,
      email: true,
      username: true,
    },
  })
};

export const getCurrentUser = async (id: number) => {
  const user = (await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      email: true,
      username: true
    },
  })) as UserModel;

  return {
    ...user
  };
};

export const updateUser = async (userPayload: any, id: number) => {
  const { email, username } = userPayload;

  const user = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      ...(email ? { email } : {}),
      ...(username ? { username } : {}),
    },
    select: {
      id: true,
      email: true,
      username: true
    },
  });

  return {
    ...user,
  };
};
