import prisma from "../../../prisma/prisma-client";
import HttpException from "../../models/http-exception.model";
import {EventInput} from "./event-input.model";
import {EventModel} from "./event.model";

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
                    user_id: true,
                    event_id: true,
                },
            }
        },

    });
    if (!id) {
        const count = await prisma.event.count({
            where: {
                AND: andQueries,
            },
        });
        return {count, data}
    }
    return {data};
}

export const createEvent = async (event: EventInput):Promise<EventModel> => {
    const { name, total_seats } = event;

    if (!name) {
        throw new HttpException(422, { errors: { name: ["can't be blank"] } });
    }

    if (isNaN(parseInt(total_seats))) {
        throw new HttpException(422, { errors: { total_seats: ["incorrect total_seats"] } });
    }

    return prisma.event.create({
        data: {name, total_seats},
        select: {id: true, name: true, total_seats: true}

    });
};