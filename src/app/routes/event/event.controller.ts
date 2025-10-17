import {NextFunction, Request, Response, Router} from 'express';
import {getEvents, createEvent} from './event.service';

const router = Router();


/**
 * Get event by id or all
 * @route {GET} /events/:id?
 * @returns event EventModel | Array<EventModel>
 */
router.get('/events/:id?', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedId = parseInt(req.params.id);
        const eventId = isNaN(parsedId) ? 0 : parsedId;
        const data = await getEvents(req.query, eventId);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

/**
 * Create event
 * @route {POST} /events
 * @bodyparam  name
 * @bodyparam  total_seats
 * @returns event EventModel
 */
router.post('/events', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const event = await createEvent(req.body);
        res.status(201).json(event);
    } catch (error) {
        next(error);
    }
});

export default router;