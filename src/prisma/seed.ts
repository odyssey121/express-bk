import prisma from './prisma-client'
import {createUser} from "../app/routes/user/user.service";
import {UserModel} from "../app/routes/user/user.model"
import {
    randEmail,
    randFullName,
    randPassword
} from '@ngneat/falso';

export const generateUser = async (): Promise<Partial<UserModel>> =>
    createUser({
        username: randFullName(),
        email: randEmail(),
        password: randPassword()
    });

async function main() {
    try {
        const users = await Promise.all(Array.from({length: 12}, () => generateUser()));
        users?.map(user => user);

        // eslint-disable-next-line no-restricted-syntax
        for await (const user of users) {
            console.log('user', user);
        }
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