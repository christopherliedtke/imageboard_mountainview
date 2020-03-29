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

app.get('/moreImages', (req, res) => {
    db.getMoreImages(req.query.lastImageId)
        .then(payload => {
            res.json(payload.rows);
        })
        .catch(err => console.log('Error on getMoreImages() on /moreImages: ', err));
});

app.get('/imagesByTag', (req, res) => {
    db.getImagesByTag(req.query.tag)
        .then(payload => {
            res.json(payload.rows);
        })
        .catch(err => console.log('Error on getImagesByTag() on /imagesbytag: ', err));
});

app.get('/moreImagesByTag', (req, res) => {
    db.getMoreImagesByTag(req.query.tag, req.query.lastImageId)
        .then(payload => {
            res.json(payload.rows);
        })
        .catch(err => console.log('Error on getMoreImagesByTag() on /moreImagesByTag: ', err));
});

// app.get('/imagesBySearchterm', (req, res) => {
//     console.log('req.query.q: ', req.query.q);
//     let searchTerm = '%' + req.query.q + '%';
//     console.log('searchTerm: ', searchTerm);

//     db.getImagesBySearchterm(searchTerm)
//         .then(payload => {
//             console.log('payload.rows: ', payload.rows);

//             res.json(payload.rows);
//         })
//         .catch(err => console.log('Error on getImagesBySearchterm() on /imagesBySearchterm: ', err));
// });

app.post('/upload', uploader.single('file'), s3.upload, (req, res) => {
    let url = conf.s3Url + req.file.filename;

    db.addImage(req.body.title, req.body.username, req.body.description, url)
        .then(response => {
            const imageObj = { ...response.rows[0] };

            if (req.body.tags) {
                imageObj.tags = [];
                req.body.tags.split(',').forEach(tag => {
                    db.addTag(
                        tag
                            .toLowerCase()
                            .trim()
                            .replace(' ', '_'),
                        response.rows[0].id
                    )
                        .then(responseTag => {
                            imageObj.tags.push(responseTag.rows[0]);
                        })
                        .catch(err => console.log('Error on addTag() on /upload: ', err));
                });
            }

            res.json(imageObj);
        })
        .catch(err => {
            console.log('Error on addImage() on /upload: ', err);
            res.sendStatus(500);
        });
});

app.get('/image', (req, res) => {
    const id = parseInt(req.query.id, 10);

    if (!isNaN(id)) {
        db.getImage(id)
            .then(payload => {
                res.json(payload.rows[0]);
            })
            .catch(err => {
                console.log('Error on getImage() on /image: ', err);
                res.sendStatus(500);
            });
    } else {
        res.sendStatus(204);
    }
});

app.get('/comments', (req, res) => {
    const id = parseInt(req.query.id, 10);

    if (!isNaN(id)) {
        db.getComments(id)
            .then(payload => {
                res.json(payload.rows);
            })
            .catch(err => {
                console.log('Error on getComments() on /image: ', err);
                res.sendStatus(500);
            });
    } else {
        res.sendStatus(204);
    }
});

app.get('/tags', (req, res) => {
    const id = parseInt(req.query.imageId, 10);

    if (!isNaN(id)) {
        db.getImageTags(id)
            .then(payload => {
                res.json(payload.rows);
            })
            .catch(err => {
                console.log('Error on getImageTags() on /tags: ', err);
                res.sendStatus(500);
            });
    } else {
        res.sendStatus(204);
    }
});

app.post('/addComment', (req, res) => {
    db.addComment(req.body.comment, req.body.username, req.body.id)
        .then(response => {
            res.json(response.rows[0]);
        })
        .catch(err => {
            console.log('Error on addComment() on /addComment: ', err);
            res.sendStatus(500);
        });
});

app.get('/getHighestImageId', (req, res) => {
    //
    db.getHighestImageId()
        .then(response => {
            res.json(response.rows[0]);
        })
        .catch(err => {
            console.log('Error on getHighestImageId() on /getHighestImageId: ', err);
            res.sendStatus(500);
        });
});

app.listen(PORT, () => console.log('-----> App is listening...'));
