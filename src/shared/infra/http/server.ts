import 'reflect-metadata';

import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import uploadConfig from '@config/upload';

import AppError from '@shared/errors/AppError';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const app = express();

app.use(express.json());
app.use('/files', express.static(uploadConfig.tmpFolder));
app.use(cors());
app.use(routes);

app.use(
  (error: Error, request: Request, response: Response, _: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.status).json({
        status: 'error',
        message: error.message,
      });
    }

    console.error(error);

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error',
      description: error.message,
    });
  },
);

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333');
});
