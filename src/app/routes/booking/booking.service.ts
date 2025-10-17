import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";
import prisma from "../../../prisma/prisma-client";
import HttpException from "../../models/http-exception.model";
import {BookingInput} from "./booking-input.model";
import {BookingModel} from "./booking.model";


class BookingAlreadyExistsError extends HttpException {
}

const buildFindAllQuery = (query: any, id: number | undefined) => {
    const queries: any = [];
    const andUserQuery = [];
    const andBookingQuery = [];

    if (id) {
        andBookingQuery.push({
            id: {
                equals: id,
            },
        });
    }
    // query for not relations (use destruct)
    queries.push(...andBookingQuery);

    if ('email' in query) {
        andUserQuery.push({
            email: {
                equals: query.email,
            },
        });
    }

    const userQuery = {
        user: {
            AND: andUserQuery,
        },
    };

    queries.push(userQuery);

    return queries;
};

export const createBooking = async (input: BookingInput): Promise<BookingModel> => {
    const {user_id, event_id} = input;
    if (isNaN(parseInt(user_id))) {
        throw new HttpException(422, {errors: {user_id: ["incorrect user_id"]}});
    }

    if (isNaN(parseInt(event_id))) {
        throw new HttpException(422, {errors: {event_id: ["incorrect event_id"]}});
    }

    try {
        return await prisma.booking.create({
            data: {user_id, event_id},
            select: {id: true, user_id: true, event_id: true, createdAt: true, updatedAt: true}
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new BookingAlreadyExistsError(422, {errors: {"booking already have a reservation": ["booking for user_id already exists"]}});
            }
        }
        throw error;
    }
};


export const getBookings = async (query: any, id?: number) => {
    const andQueries = buildFindAllQuery(query, id);
    const data = await prisma.booking.findMany({
        where: {AND: andQueries},
        orderBy: {
            createdAt: 'desc',
        },
        skip: Number(query.offset) || 0,
        take: Number(query.limit) || 10,
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                },
            }
        },

    });
    if (!id) {
        const count = await prisma.booking.count({
            where: {
                AND: andQueries,
            },
        });
        return {count, data}
    }

    return {data};
}