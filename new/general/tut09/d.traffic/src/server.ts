
import express, { json, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { port, url } from './config.json';
import {
 updateLight, reset, getState, load, save
} from './traffic';

const PORT: number = parseInt(process.env.PORT || port);
const app = express();

// Use middleware that allows for access from other domains (needed for frontend to connect)
app.use(cors());
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware to log (print to terminal) incoming HTTP requests (OPTIONAL)
app.use(morgan('dev'));

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the root URL of traffic light!' });
});


app.put('/updateLight', (req: Request, res: Response) => {
  load();
  const action = req.body.action
  const result = updateLight(action)
  save();
  if ('error' in result) {
    return res.status(400).json({ error: result.error });
  }
  res.json(result)
}) 

app.put('/resetState', (req: Request, res: Response) => {
  load();
  const result = reset();
  save();
  res.json(result);
}) 

app.get('/getState', (req: Request, res: Response) => {
  load();
  const result = getState();
  save();
  res.json(result);
}) 


app.listen(PORT, () => {
  console.log(`Express Server started and awaiting requests at the URL: '${url}:${port}'`);
});
