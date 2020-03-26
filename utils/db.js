const spicedPg = require('spiced-pg');

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbUser, dbPw, dbName } = require('./secrets');
    db = spicedPg(`postgres:${dbUser}:${dbPw}@localhost:5432/${dbName}`);
}

module.exports.getImages = () => {
    const q = `
        SELECT *
        FROM images
        ORDER BY id DESC
        LIMIT 3
    `;

    return db.query(q);
};

module.exports.getMoreImages = startId => {
    const q = `
        SELECT id, url, username, title, description, (
            SELECT id
            FROM images
            ORDER BY id ASC
            LIMIT 1
        ) AS "lowestId"
        FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 3
    `;
    const params = [startId];

    return db.query(q, params);
};

module.exports.getImage = imageId => {
    const q = `
        SELECT *, (
            SELECT id 
            FROM images
            WHERE id>$1
            ORDER BY id ASC
            LIMIT 1
        ) AS "nextId", (
            SELECT id 
            FROM images
            WHERE id<$1
            ORDER BY id DESC
            LIMIT 1
        ) AS "prevId"
        FROM images
        WHERE id=$1
    `;
    const params = [imageId];

    return db.query(q, params);
};

module.exports.addTag = (tag, imageId) => {
    const q = `
        INSERT INTO tags (tag, image_id)
        VALUES ($1, $2)
        RETURNING tag
    `;
    const params = [tag, imageId];

    return db.query(q, params);
};

module.exports.getImageTags = imageId => {
    const q = `
        SELECT tag
        FROM tags
        WHERE image_id=$1
    `;
    const params = [imageId];

    return db.query(q, params);
};

module.exports.addImage = (title, description, username, url) => {
    const q = `
        INSERT INTO images (title, username, description, url)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const params = [title, description, username, url];

    return db.query(q, params);
};

module.exports.getComments = imageId => {
    const q = `
        SELECT *
        FROM comments
        WHERE image_id=$1
    `;
    const params = [imageId];

    return db.query(q, params);
};

module.exports.addComment = (comment, username, imageId) => {
    const q = `
        INSERT INTO comments (comment, username, image_id)
        VALUES ($1, $2, $3)
        RETURNING *
    `;
    const params = [comment, username, imageId];

    return db.query(q, params);
};
