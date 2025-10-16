import {NextFunction, Request, Response, Router} from 'express';
import {createBooking, getBookings} from './booking.service';

const router = Router();


/**
 * Get bookings by id or all
 * @route {GET} /bookings
 * @returns
 */
router.get('/bookings/:id?', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedId = parseInt(req.params.id);
        const BookingId = isNaN(parsedId) ? 0: parsedId;
        const bookingsResult = await getBookings(req.query, BookingId);
        if(bookingsResult.bookings.length === 1) {
            return res.json(bookingsResult.bookings[0]);
        }
        res.json(bookingsResult);
    } catch (error) {
        next(error);
    }
});

/**
 * Create booking
 * @route {POST} /bookings
 * @bodyparam  user_id
 * @bodyparam  event_id
 * @returns
 */
router.post('/bookings', async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("req.body", req.body)
        const booking = await createBooking(req.body);
        res.status(201).json({ booking });
    } catch (error) {
        next(error);
    }
});

export default router;