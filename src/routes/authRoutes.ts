import { Router } from 'express';
import {
    registerUser,
    login,
    getMyDetails,
    registerAdmin,
    refreshToken
} from '../controller/authController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import { UserRole } from '../model/userModel';

const router = Router()

router.post('/register', registerUser)

router.post('/login', login)

router.get('/me', authenticate, getMyDetails)

router.post(
    '/admin/register', 
    authenticate, 
    requireRole([UserRole.ADMIN]), 
    registerAdmin
)

router.post('/refresh-token', refreshToken)

export default router