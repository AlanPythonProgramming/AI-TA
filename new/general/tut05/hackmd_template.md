```typescript=1

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



// TODO: Add a person (Tutor)
    // 1. HTTP Method (POST/GET/PUT/DELETE) =
    // 2. Input Parameter Type (Query/Body) =


// TODO: List all people (Tutor)
    // 1. HTTP Method (POST/GET/PUT/DELETE) =
    // 2. Input Parameter Type (Query/Body) =

// TODO: Read a person's details (AERO)
    // 1. HTTP Method (POST/GET/PUT/DELETE) =
    // 2. Input Parameter Type (Query/Body) = 

// TODO: Update a person (BOOST)
    // 1. HTTP Method (POST/GET/PUT/DELETE) = 
    // 2. Input Parameter Type (Query/Body) = 


// TODO: Remove a person (CRUNCHIE)
    // 1. HTTP Method  = 
    // 2. Input Parameter Type = 

// TODO: Get stats (DREAM)
    // 1. HTTP Method (POST/GET/PUT/DELETE) = 
    // 2. Input Parameter Type (Query/Body) = 


// TODO: Clear (EGGS)
    // 1. HTTP Method (POST/GET/PUT/DELETE) =
    // 2. Input Parameter Type (Query/Body) =


app.listen(port, () => {
  console.log(`Express Server started and awaiting requests at the URL: '${url}:${port}'`);
});


```

