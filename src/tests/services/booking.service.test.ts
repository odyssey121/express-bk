import prismaMock from "../prisma-mock";
import {createBooking} from "../../app/routes/booking/booking.service";
import {randNumber} from "@ngneat/falso";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime/library";

describe('BookingService', () => {
    describe('createBookingSuccess', () => {
        test('should create new booking ', async () => {
            const eventId = randNumber();
            const userId = randNumber()
            // Given
            const booking = {
                user_id: userId,
                event_id: eventId
            };

            const mockedResponse = {
                id: randNumber(),
                user_id: userId,
                event_id: eventId,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            // When
            // @ts-ignore
            prismaMock.booking.create.mockResolvedValue(mockedResponse);

            // Then
            await expect(createBooking(booking)).resolves.toHaveProperty('id')
        });
    });
    describe('createBookingErrorAlreadyExist', () => {
        test('create booking error already exist', async () => {
            const eventId = randNumber();
            const userId = randNumber()
            // Given
            const booking = {
                user_id: userId,
                event_id: eventId
            };

            // When
            prismaMock.booking.create.mockRejectedValueOnce(
                new PrismaClientKnownRequestError(
                    'Unique constraint failed on the fields: (`user_id`, event_id, booking)`)',
                    {code: 'P2002', clientVersion: '2.x.x', meta: {target: ['user_id']}}
                )
            );
            // Then
            const error = String({errors: {"booking already have a reservation": ["booking for user_id already exists"]}});
            await expect(createBooking(booking)).rejects.toThrow(error);
        });
    });
});