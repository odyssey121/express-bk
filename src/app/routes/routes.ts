import {Router} from 'express';
import userController from './user/user.controller';
import bookingController from './booking/booking.controller';
import eventController from './event/event.controller';

const api = Router()
    .use(userController)
    .use(bookingController)
    .use(eventController);

export default Router().use('/api', api);