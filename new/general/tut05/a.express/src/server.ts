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

// TODO TUTOR: Add a person

// TODO TUTOR: List all people

// TODO GROUP 1: Read a person's details

// TODO GROUP 2: Update a person

// TODO GROUP 3: Remove a person

// TODO GROUP 4: Get stats

// TODO GROUP 5: Clear

app.listen(port, () => {
  console.log(`Express Server started and awaiting requests at the URL: '${url}:${port}'`);
});
