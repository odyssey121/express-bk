import { Router } from 'express';
import userController from './user/user.controller';


const api = Router()
    .use(userController)

export default Router().use('/api', api);