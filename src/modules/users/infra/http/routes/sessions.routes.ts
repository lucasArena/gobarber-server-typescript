import { Router } from 'express';
import { Joi, celebrate, Segments } from 'celebrate';

import SessionsController from '../controllers/SessionsController';

const router = Router();
const sessionsController = new SessionsController();

router.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create,
);

export default router;
