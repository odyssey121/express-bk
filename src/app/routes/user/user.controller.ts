import {NextFunction, Request, Response, Router} from 'express';
import {createUser, getCurrentUser, updateUser} from './user.service';

const router = Router();

/**
 * Create an user
 * @user none
 * @route {POST} /users
 * @bodyparam user User
 * @returns user User
 */
router.post('/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await createUser({...req.body.user});
        res.status(201).json({user});
    } catch (error) {
        next(error);
    }
});

/**
 * Get current user
 * @user required
 * @route {GET} /user
 * @returns user User
 */
router.get('/user/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedId = parseInt(req.params.id);
        const userId = isNaN(parsedId) ? 0: parsedId;
        const user = await getCurrentUser(userId);
        res.json({user});
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
router.put('/user', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await updateUser(req.body.user, req.body.used?.id);
        res.json({user});
    } catch (error) {
        next(error);
    }
});

export default router;
