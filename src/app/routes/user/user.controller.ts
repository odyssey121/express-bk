import {NextFunction, Request, Response, Router} from 'express';
import {createUser, getUsers, updateUser} from './user.service';

const router = Router();

/**
 * Create user
 * @route {POST} /users
 * @bodyparam username string
 * @bodyparam email string
 * @bodyparam password string
 * @returns user Partial<UserModel>
 */
router.post('/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await createUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
});

/**
 * Get user by id or all
 * @route {GET} /user/:id?
 * @returns data UserModel | Array<UserModel>
 */
router.get('/users/:id?', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedId = parseInt(req.params.id);
        const userId = isNaN(parsedId) ? 0: parsedId;
        const data = await getUsers(req.query, userId);
        res.json(data);
    } catch (error) {
        next(error);
    }
});

/**
 * Update user
 * @user required
 * @route {PUT} /user
 * @bodyparam user UserModel
 * @returns user Partial<UserModel>
 */
router.put('/users/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await updateUser(req.body, parseInt(req.params.id));
        res.json(user);
    } catch (error) {
        next(error);
    }
});

export default router;
