/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as path from 'path';
import express, { Request, Response } from 'express';

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get('/api', (req: Request, res: Response) => {
  res.send({ message: 'Welcome to express-bk!' });
});

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);
