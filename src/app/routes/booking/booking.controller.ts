import {NextFunction, Request, Response, Router} from 'express';
import {createBooking, getBookings} from './booking.service';

const router = Router();


/**
 * Get bookings by id or all
 * @route {GET} /bookings
 * @returns booking BookingModel | Array<BookingModel>
 */
router.get('/bookings/:id?', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedId = parseInt(req.params.id);
        const BookingId = isNaN(parsedId) ? 0: parsedId;
        const data = await getBookings(req.query, BookingId);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

/**
 * Create booking
 * @route {POST} /bookings
 * @bodyparam  user_id
 * @bodyparam  event_id
 * @returns booking BookingModel
 */
router.post('/bookings', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const booking = await createBooking(req.body);
        res.status(201).json(booking);
    } catch (error) {
        next(error);
    }
});

export default router;