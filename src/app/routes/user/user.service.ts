import prisma from '../../../prisma/prisma-client';
import HttpException from '../../models/http-exception.model';
const bcrypt = require('bcryptjs');
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
                ...(existingUserByEmail ? {email: ['has already been taken']} : {}),
                ...(existingUserByUsername ? {username: ['has already been taken']} : {}),
            },
        });
    }
};

export const createUser = async (input: UserInput): Promise<Partial<UserModel>> => {
    const email = input.email?.trim();
    const username = input.username?.trim();
    const password = input.password?.trim();

    if (!email) {
        throw new HttpException(422, {errors: {email: ["can't be blank"]}});
    }

    if (!username) {
        throw new HttpException(422, {errors: {username: ["can't be blank"]}});
    }

    if (!password) {
        throw new HttpException(422, {errors: {password: ["can't be blank"]}});
    }

    await checkUserUniqueness(email, username);

    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
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
    });
};

const buildFindAllQuery = (id: number | undefined) => {
    const queries: any = [];
    const andUserQuery = [];

    if (id) {
        andUserQuery.push({
            id: {
                equals: id,
            },
        });
    }

    // query for not relations (use destruct)
    queries.push(...andUserQuery);

    return queries;
};

export const getUsers = async (query: any, id?: number | undefined) => {
    const andQueries = buildFindAllQuery(id);
    const data = await prisma.event.findMany({
        where: {AND: andQueries},
        orderBy: {
            id: 'desc',
        },
        skip: Number(query.offset) || 0,
        take: Number(query.limit) || 10,
        include: {
            booking: {
                select: {
                    id: true,
                    event_id: true,
                },
            }
        },
    });

    if (!id) {
        const count = await prisma.user.count({
            where: {
                AND: andQueries,
            },
        });
        return {count, data}
    }

    return {data};
};

export const updateUser = async (userPayload: UserInput, id: number): Promise<Partial<UserModel>> => {
    const {email, username, password} = userPayload;

    const user = await prisma.user.update({
        where: {
            id: id,
        },
        data: {
            ...(email ? {email} : {}),
            ...(username ? {username} : {}),
            ...(password ? {password} : {}),
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
