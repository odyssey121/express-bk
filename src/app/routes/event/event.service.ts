import prisma from "../../../prisma/prisma-client";
import HttpException from "../../models/http-exception.model";
import {EventInput} from "./event-input.model";

const buildFindAllQuery = (id: number | undefined) => {
    const queries: any = [];
    const andEventQuery = [];

    if (id) {
        andEventQuery.push({
            id: {
                equals: id,
            },
        });
    }

    // query for not relations (use destruct)
    queries.push(...andEventQuery);

    return queries;
};

export const getEvents = async (query: any, id?: number) => {
    const andQueries = buildFindAllQuery(id);
    const eventCount = await prisma.event.count({
        where: {
            AND: andQueries,
        },
    });

    const events = await prisma.event.findMany({
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
                    user_id: true,
                    event_id: true,
                },
            }
        },

    });
    return {
        count: eventCount,
        events
    };
}

export const createEvent = async (event: EventInput) => {
    const { name, total_seats } = event;

    if (!name) {
        throw new HttpException(422, { errors: { name: ["can't be blank"] } });
    }

    if (!total_seats) {
        throw new HttpException(422, { errors: { total_seats: ["can't be blank"] } });
    }

    if (!Number.isInteger(total_seats)) {
        throw new HttpException(422, { errors: { total_seats: ["can't be not number"] } });
    }

    return await prisma.event.create({
        data: {name, total_seats},
        select: {id: true, name: true, total_seats: true}

    });
};