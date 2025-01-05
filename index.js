import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import db from './db.js';

import users from './routes/users.js';
import canvases from './routes/canvases.js';


const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use('/api/users', users);
app.use('/api/canvases', canvases);

db().catch(err => console.error(err));

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
