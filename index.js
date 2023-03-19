import express from 'express'
const app = express();
const port = process.env.PORT || 8080;

app.get('/', function (req, res) {
    return res.send('Backend in development');
});

app.listen((port), () => {
    console.log(`Server started at ${port}`);
});