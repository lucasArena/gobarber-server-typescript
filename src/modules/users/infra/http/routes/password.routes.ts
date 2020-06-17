import { Router } from 'express';

import ForgotPassworController from '../controllers/ForgotPasswordController';
import ResetPasswordController from '../controllers/ResetPasswordController';

const passwordRouter = Router();
const forgotPassworController = new ForgotPassworController();
const resetPasswordController = new ResetPasswordController();

passwordRouter.post('/forgot', forgotPassworController.create);
passwordRouter.post('/reset', resetPasswordController.create);

export default passwordRouter;
