import prisma from './prisma-client'
import {createUser} from "../app/routes/user/user.service";
import {UserModel} from "../app/routes/user/user.model"
import {
    randEmail,
    randFullName, randNumber,
    randPassword, randPhrase
} from '@ngneat/falso';
import {createEvent} from "../app/routes/event/event.service";

export const generateUser = async (): Promise<Partial<UserModel>> =>
    createUser({
        username: randFullName(),
        email: randEmail(),
        password: randPassword()
    });

export const generateEvents = async () =>
    createEvent(
        {
            name: randPhrase(),
            total_seats: randNumber({min: 10, max: 999}),
        }
    );


async function main() {
    try {
        await Promise.all(Array.from({length: 12}, () => generateUser()));
        await Promise.all(Array.from({length: 12}, () => generateEvents()));
    } catch (e) {
        console.error(e);

    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })