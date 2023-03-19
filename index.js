import express from 'express'
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8080;
const whitelist = ['http://localhost:5173/canvasnote/', 'https://abrar74774.github.io/canvasnote']

app.use(cors());
    // {
    // origin: function (origin, callback) {
    //     if (whitelist.indexOf(origin) !== -1) {
    //       callback(null, true)
    //     } else {
    //       callback(new Error('Not allowed by CORS'))
    //     }
    // }
// }

app.get('/', function (req, res) {
    return res.send('Backend in development');
});

app.listen((port), () => {
    console.log(`Server started at ${port}`);
});