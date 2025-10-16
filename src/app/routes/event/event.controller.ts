import {NextFunction, Request, Response, Router} from 'express';
import {getEvents, createEvent} from './event.service';

const router = Router();


/**
 * Get event by id or all
 * @route {GET} /events/:id?
 * @returns
 */
router.get('/events/:id?', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedId = parseInt(req.params.id);
        const eventId = isNaN(parsedId) ? 0 : parsedId;
        const eventsResult = await getEvents(req.query, eventId);
        if (eventsResult.events.length === 1) {
            return res.json(eventsResult.events[0]);
        }
        res.json(eventsResult);
    } catch (error) {
        next(error);
    }
});

/**
 * Create event
 * @route {POST} /events
 * @bodyparam  name
 * @bodyparam  total_seats
 * @returns
 */
router.post('/events', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const booking = await createEvent(req.body);
        res.status(201).json({booking});
    } catch (error) {
        next(error);
    }
});

export default router;