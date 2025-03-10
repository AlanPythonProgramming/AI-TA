/**

NOTE:

There are repetitions with getting results from each function, then checking
('error' in result) to parse the status code (not DRYKISS)

This was left intentionally for clarity and simplicity.

Below are a few ways in which this repetition can be mitigated:

  1. Throw exceptions instead of returning an error object, and catch this
exception using an errorHandler middleware. This will be taught in iteration 3

  2. Define a common function to handle the sending of responses and handle the
check ('error' in result) in this one place, then simply call this function in
all routes.

  3. Modify existing "functions" in people.ts which will also contain
information about what the status code should be.

 */

import express, { json, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { port, url } from './config.json';
import {
  clear,
  peopleAdd,
  personView,
  personEdit,
  peopleList,
  personRemove,
  peopleStats,
} from './people';

const PORT: number = parseInt(process.env.PORT || port);
const app = express();

// Use middleware that allows for access from other domains (needed for frontend to connect)
app.use(cors());
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware to log (print to terminal) incoming HTTP requests (OPTIONAL)
app.use(morgan('dev'));

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the root URL of names ages!' });
});

app.post('/people/add', (req: Request, res: Response) => {
  const { name, age } = req.body;
  const result = peopleAdd(name, age);
  if ('error' in result) {
    return res.status(400).json(result);
  }
  res.json(result);
});

app.get('/people/list', (req: Request, res: Response) => {
  const result = peopleList(parseInt(req.query.minAge as string));
  if ('error' in result) {
    return res.status(400).json(result);
  }
  res.json(result);
});

app.get('/person/:personid', (req: Request, res: Response) => {
  const result = personView(parseInt(req.params.personid));
  if ('error' in result) {
    return res.status(400).json(result);
  }
  res.json(result);
});

app.put('/person/:personid', (req: Request, res: Response) => {
  const result = personEdit(parseInt(req.params.personid), req.body.name, req.body.age);
  if ('error' in result) {
    return res.status(400).json(result);
  }
  res.json(result);
});

app.delete('/person/:personid', (req: Request, res: Response) => {
  const result = personRemove(parseInt(req.params.personId));
  if ('error' in result) {
    return res.status(400).json(result);
  }
  res.json(result);
});

app.get('people/stats', (req: Request, res: Response) => {
  const result = peopleStats();
  if ('error' in result) {
    return res.status(400).json(result);
  }
  res.json(result);
});

app.delete('/clear', (req: Request, res: Response) => {
  res.json(clear());
});

app.listen(PORT, () => {
  console.log(`Express Server started and awaiting requests at the URL: '${url}:${port}'`);
});
