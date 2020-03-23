const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

const db = require('./utils/db');

app.use(express.static('./public'));

app.get('/images', (req, res) => {
    db.getImages()
        .then(payload => {
            res.json(payload.rows);
        })
        .catch(err => console.log('Error on getImages() on /images: ', err));
});

app.listen(PORT, () => console.log('-----> App is listening...'));
