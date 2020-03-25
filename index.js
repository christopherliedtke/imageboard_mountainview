const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

const s3 = require('./utils/s3');
const conf = require('./config');

const db = require('./utils/db');

const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

app.use(express.json());

app.use(express.static('./public'));

app.get('/images', (req, res) => {
    db.getImages()
        .then(payload => {
            res.json(payload.rows);
        })
        .catch(err => console.log('Error on getImages() on /images: ', err));
});

app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
    let url = conf.s3Url + req.file.filename;
    db.addImage(req.body.title, req.body.username, req.body.description, url)
        .then(response => {
            res.json(response.rows[0]);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.get('/image', (req, res) => {
    console.log('req.query: ', req.query);

    db.getImage(req.query.id)
        .then(payload => {
            res.json(payload.rows[0]);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.listen(PORT, () => console.log('-----> App is listening...'));
