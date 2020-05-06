import { Router } from 'express';

import CreateSessionService from '../services/CreateSessionService';

const router = Router();

router.post('/', async (request, response) => {
  const { email, password } = request.body;
  const createSessionService = new CreateSessionService();

  const { user, token } = await createSessionService.execute({
    email,
    password,
  });

  return response.json({ user, token });
});

export default router;
