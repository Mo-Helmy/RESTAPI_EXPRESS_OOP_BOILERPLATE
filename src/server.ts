import express from 'express';
import cors from 'cors';
import apiRoutes from './routes';

const app = express();
const port = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'X-Access-Token',
      'Authorization',
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
    ],
    methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
    preflightContinue: true,
    origin: '*',
  })
);

app.use('/api', apiRoutes);

app.use('/', (req, res) => {
  res.send('backend started!!!!!!!!!');
});

app.listen(port, () => console.log('server start listening on port: ' + port));
