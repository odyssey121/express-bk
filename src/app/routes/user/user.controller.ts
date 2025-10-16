import {NextFunction, Request, Response, Router} from 'express';
import {createUser, getUsers, updateUser} from './user.service';

const router = Router();

/**
 * Create user
 * @route {POST} /users
 * @bodyparam username string
 * @bodyparam email string
 * @bodyparam password string
 * @returns
 */
router.post('/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await createUser(req.body);
        res.status(201).json({user});
    } catch (error) {
        next(error);
    }
});

/**
 * Get user by id or all
 * @route {GET} /user/:id?
 * @returns
 */
router.get('/users/:id?', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedId = parseInt(req.params.id);
        const userId = isNaN(parsedId) ? 0: parsedId;
        const usersResult = await getUsers(req.query, userId);
        if(usersResult.users.length === 1) {
            return res.json(usersResult.users[0]);
        }
        res.json(usersResult);
    } catch (error) {
        next(error);
    }
});

/**
 * Update user
 * @user required
 * @route {PUT} /user
 * @bodyparam user User
 * @returns user User
 */
router.put('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await updateUser(req.body, parseInt(req.params.id));
        res.json({user});
    } catch (error) {
        next(error);
    }
});

export default router;
