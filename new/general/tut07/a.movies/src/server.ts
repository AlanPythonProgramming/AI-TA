import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { port, url } from './config.json';
import { movieAdd, movieEdit, moviesList, clear } from './movie';

const PORT: number = parseInt(process.env.PORT || port);
const SERVER_URL = `${url}:${PORT}`;

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.post('/movie/add', (req: Request, res) => {
  const result = movieAdd(req.body.title, req.body.director);
  if ('error' in result) {
    res.status(400);
  }
  res.json(result);
});

app.put('/movie/:movieid', (req: Request, res: Response) => {
  const result = movieEdit(parseInt(req.params.movieid), req.body.title, req.body.director);
  if ('error' in result) {
    res.status(400);
  }
  res.json(result);
});

app.get('/movies/list', (req: Request, res: Response) => {
  res.json(moviesList());
});

app.delete('/clear', (req: Request, res: Response) => {
  res.json(clear());
});


const server = app.listen(PORT, () => {
  console.log(`Server started at the URL: '${SERVER_URL}'`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Shutting down server gracefully.');
    process.exit();
  });
});
