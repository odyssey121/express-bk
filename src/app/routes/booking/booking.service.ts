import prisma from "../../../prisma/prisma-client";
import HttpException from "../../models/http-exception.model";
import {BookingInput} from "./booking-input.model";

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

export const createBooking = async (booking: BookingInput) => {
    const {user_id, event_id} = booking;
    if (!user_id) {
        throw new HttpException(422, {errors: {user_id: ["can't be blank"]}});
    }

    if (!event_id) {
        throw new HttpException(422, {errors: {event_id: ["can't be blank"]}});
    }

    const {
        id: bookingId,
    } = await prisma.booking.create({
        data: {user_id, event_id},
        select: {id: true, user_id: true, event_id: true}

    });

    return {id: bookingId};
};


export const getBookings = async (query: any, id?: number) => {
    const andQueries = buildFindAllQuery(query, id);
    const bookingCount = await prisma.booking.count({
        where: {
            AND: andQueries,
        },
    });

    const bookings = await prisma.booking.findMany({
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
    return {
        count: bookingCount,
        bookings
    };
}