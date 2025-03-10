import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import morgan from 'morgan';
import { echo } from './echo';
import { DATABASE_FILE, setData, addName, viewNames, clear } from './names';
import { port, url } from './config.json';
import { InputError } from './errors';

const PORT: number = parseInt(process.env.PORT ?? port);
const SERVER_URL = `${url}:${PORT}`;

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

type ErrorResponse = {
  error: string;
};

app.get('/', (req: Request, res: Response<{ message: string }>) => {
  console.log('Print to terminal: someone accessed our root url!');
  res.status(200).json({ message: "Welcome to Lab09 Deploy Server's root URL!" });
});

app.get(
  '/echo/echo',
  (req: Request<{ message: string }>, res: Response<ErrorResponse | ReturnType<typeof echo>>) => {
    try {
      const data = echo(req.query.message as string);
      return res.status(200).json(data);
    } catch (err) {
      if (err instanceof InputError) {
        return res.status(400).json({ error: err.message });
      } else {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
);

app.post(
  '/add/name',
  (req: Request<{ name: string }>, res: Response<ErrorResponse | ReturnType<typeof addName>>) => {
    try {
      const data = addName(req.body.name);
      return res.status(200).json(data);
    } catch (err) {
      if (err instanceof InputError) {
        return res.status(400).json({ error: err.message });
      } else {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
);

app.get(
  '/view/names',
  (req: Request, res: Response<ErrorResponse | ReturnType<typeof viewNames>>) => {
    try {
      const data = viewNames();
      return res.status(200).json(data);
    } catch (err) {
      if (err instanceof InputError) {
        return res.status(400).json({ error: err.message });
      } else {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  }
);

app.delete('/clear', (req: Request, res: Response<ErrorResponse | ReturnType<typeof clear>>) => {
  try {
    const data = clear();
    return res.status(200).json(data);
  } catch (err) {
    if (err instanceof InputError) {
      return res.status(400).json({ error: err.message });
    } else {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

const server = app.listen(PORT, '0.0.0.0', () => {
  // Load existing persistent data before server starts
  if (fs.existsSync(DATABASE_FILE)) {
    setData(JSON.parse(String(fs.readFileSync(DATABASE_FILE))));
  } else {
    fs.writeFileSync(
      DATABASE_FILE,
      JSON.stringify({
        names: []
      })
    );
  }

  console.log(`Server started at the URL: '${SERVER_URL}'`);
});

process.on('SIGINT', () => {
  server.close(() => {
    console.log('Shutting down server gracefully.');
    process.exit();
  });
});

export default app;
