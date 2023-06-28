import { Router } from 'express';
import {
  getAllUsers,
  getUserByUsername,
  loginUser,
  registerUser,
  requestOTP,
  verifyOTP,
} from '@controllers/users/users.controller';
import {
  userLoginZodSchema,
  userRegisterZodSchema,
} from '@schemas/users.schema';
import { validateResource } from '@middlewares/index';

const router = Router();

router.route('/').get(getAllUsers);
router.route('/:username').get(getUserByUsername);
router.route('/request-otp/:type').post(requestOTP);
router.route('/verify-otp/:type').post(verifyOTP);
router.route('/login').post(validateResource(userLoginZodSchema), loginUser);
router
  .route('/register')
  .post(validateResource(userRegisterZodSchema), registerUser);

export default router;
