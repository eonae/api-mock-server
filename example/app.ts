import express, { Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());


/**
 * We have an app witch depends on external api which should be
 * ran at http://localhost:5001
 */

app.post('/data', async (req, res) => {
  const username = req.body.username;
  const getPermissionsUrl = 'http://localhost:5001/permissions';
  try {
    const response = await axios.post(getPermissionsUrl, { username });
    const canProceed = response.status === 200;

    if (canProceed) {
      res.status(200).json({
        data: 'Some data'
      });
    } else {
      res.status(403).send('Forbidden');
    }
  } catch (err) {
    if (err.response) {
      res.status(err.response.status).send();
    } else {
      res.status(500).send();
    }
  }
});

app.listen(3000, () => {
  console.log('App listening on port: 3000');
});
  
export default app;