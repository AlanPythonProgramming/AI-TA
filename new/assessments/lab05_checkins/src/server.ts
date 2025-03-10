import express, { json, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { echo } from './echo';
import { port, url } from './config.json';
import { checkinPatientAdmission, checkoutPatientAdmission, clear, deletePatientAdmission, listPatientAdmissions, updatePatientAdmission } from './checkins';

const PORT: number = parseInt(process.env.PORT || port);
const HOST: string = process.env.IP || '127.0.0.1';

const app = express();

// Use middleware that allows for access from other domains (needed for frontend to connect)
app.use(cors());
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware to log (print to terminal) incoming HTTP requests (OPTIONAL)
app.use(morgan('dev'));

// Root URL
app.get('/', (req: Request, res: Response) => {
  console.log('Print to terminal: someone accessed our root url!');
  res.json({ message: "Welcome to Lab05 Checkins Server's root URL!" });
});

/**
 * READ THIS ROUTE AS WELL AS
 * - echo.ts
 * - echo.test.ts
 * BEFORE STARTING!!!
 */
app.get('/echo/echo', (req: Request, res: Response) => {
  // For GET/DELETE requests, data are passed in a query string.
  // You will need to typecast for GET/DELETE requests.
  const message = req.query.message as string;

  // Logic of the echo function is abstracted away in a different
  // file called echo.ts.
  const result = echo(message);

  // If { error: 'some relevant error' } is returned, we parse the status to 400.
  // Later in the course we will explore throwing/raising exceptions which will simplify this process
  if ('error' in result) {
    // Note also that the 'return' statement is necessary here since res.json() alone does not terminate
    // this route, and we don't want to risk sending a response twice.
    res.status(400).json(result);
    return
  }
  res.json(result);
});

// ========================================================================= //
// YOUR ROUTES SHOULD BE DEFINED BELOW THIS DIVIDER
// ========================================================================= //

app.delete('/clear', (req: Request, res: Response) => {
  // TODO: use the imported clear() function in the response, i.e.. res.json(clear());
  res.status(501).json({ error: 'Not implemented. Please replace this line of code in src/server.ts' });
});

app.post('/admissions/checkin', (req: Request, res: Response) => {
  // For PUT/POST requests, data is transfered through the JSON body and will always be of the correct type.
  const { patientName, patientAge } = req.body;

  // TODO: similar to /echo/echo, call the checkinPatientAdmission function and handle error checking
  console.log('Received patientName:', patientName);
  console.log('Received patientAge:', patientAge);
  res.status(501).json({ error: 'Not implemented. Please replace this line of code in src/server.ts' });
});

app.get('/admissions/list', (req: Request, res: Response) => {
  // To get the maxAge query string, we use req.query.
  // This will always be of type string, so we will need to typecast it to a
  // number (integer) ourselves with parseInt
  const maxAge = parseInt(req.query.maxAge as string);
  console.log('Received maxAge:', maxAge);

  // TODO: similar to /echo/echo, call the listPatientAdmissions function and handle error checking
  res.status(501).json({ error: 'Not implemented. Please replace this line of code in src/server.ts' });
});

app.post('/admissions/:admissionid/checkout', (req: Request, res: Response) => {
  // To get the `:admissionid` parameter from the URL above, we use req.params
  // This will always be of type string, so we will need to typecast it to a
  // number (integer) ourselves with parseInt
  const admissionId = parseInt(req.params.admissionid as string);
  console.log('Received admissionId:', admissionId);

  // TODO: similar to /echo/echo, call the checkoutPatientAdmission function and handle error checking
  res.status(501).json({ error: 'Not implemented. Please replace this line of code in src/server.ts' });
});

// TODO: implement PUT /admissions/:admissionid

// TODO: implement DELETE /admissions/:admissionid

// ========================================================================= //
// YOUR ROUTES SHOULD BE DEFINED ABOVE THIS DIVIDER
// ========================================================================= //

/*
 * 404 Not Found Middleware
 *
 * This should be put at the very end (after all your routes are defined),
 * although still above errorHandlers (if any) and app.listen().
 */
app.use((req: Request, res: Response) => {
  const error = `
    404 Not found - This could be because:
      0. You have defined routes below (not above) this middleware in server.ts
      1. You have not implemented the route ${req.method} ${req.path}
      2. There is a typo in either your test or server, e.g. /admissions/list in one
         and, incorrectly, /admission/list in the other
      3. You are using ts-node (instead of ts-node-dev) to start your server and
         have forgotten to manually restart to load the new changes
      4. You've forgotten a leading slash (/), e.g. you have admissions/list instead
         of /admissions/list in your server.ts or test file
  `;
  res.status(404).json({ error });
});

/**
 * Start server
 */
const server = app.listen(PORT, HOST, () => {
  console.log(`Express Server started and awaiting requests at the URL: '${url}:${PORT}'`);
});

/**
 * Handle Ctrl+C gracefully
 */
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Shutting down server gracefully.');
    process.exit();
  });
});
