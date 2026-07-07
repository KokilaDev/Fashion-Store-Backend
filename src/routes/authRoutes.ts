import { Router } from 'express';
import {
    registerUser,
    login,
    getMyDetails,
    registerAdmin,
    refreshToken,
    logout,
    updateMyDetails
} from '../controller/authController';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/role';
import { UserRole } from '../model/userModel';

const router = Router()

router.post('/register', registerUser)

router.post('/login', login)

router.get('/me', authenticate, getMyDetails)

router.put('/profile', authenticate, updateMyDetails)

router.post(
    '/admin/register', 
    // authenticate, 
    // requireRole([UserRole.ADMIN]), 
    registerAdmin
)

router.post('/refresh-token', refreshToken)

router.post('/logout', authenticate, logout)

export default router