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
        SELECT id, url, username, title, description, (
            SELECT id
            FROM images
            ORDER BY id ASC
            LIMIT 1
        ) AS "lowestId"
        FROM images
        ORDER BY id DESC
        LIMIT 9
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
        LIMIT 9
    `;
    const params = [startId];

    return db.query(q, params);
};

module.exports.getImagesByTag = tag => {
    const q = `
        SELECT images.id, images.url, images.username, images.title, images.description, images.created_at, (
            SELECT image_id
            FROM tags
            WHERE tag = $1
            ORDER BY id ASC
            LIMIT 1
        ) AS "lowestId"
        FROM tags
        LEFT JOIN images
        ON images.id=tags.image_id
        WHERE tags.tag = $1
        ORDER BY images.id DESC
        LIMIT 6
    `;
    const params = [tag];

    return db.query(q, params);
};

module.exports.getMoreImagesByTag = (tag, startId) => {
    const q = `
        SELECT  images.id, images.url, images.username, images.title, images.description, images.created_at, (
            SELECT image_id
            FROM tags
            WHERE tag = $1
            ORDER BY id ASC
            LIMIT 1
        ) AS "lowestId"
        FROM tags
        LEFT JOIN images
        ON images.id=tags.image_id
        WHERE tags.tag = $1 AND images.id < $2
        ORDER BY tags.image_id DESC
        LIMIT 6
    `;
    const params = [tag, startId];

    return db.query(q, params);
};

// module.exports.getImagesBySearchterm = searchTerm => {
//     const q = `
//         SELECT id, url, username, title, description, (
//             SELECT id
//             FROM images
//             WHERE title LIKE $1 OR description LIKE $1 OR username LIKE $1
//             ORDER BY id ASC
//             LIMIT 1
//         ) AS "lowestId"
//         FROM images
//         WHERE title LIKE $1 OR description LIKE $1 OR username LIKE $1
//         ORDER BY id DESC
//         LIMIT 6
//     `;
//     const params = [searchTerm];

//     return db.query(q, params);
// };

// module.exports.getMoreImagesBySearchterm = (startId, searchTerm) => {
//     const q = `
//         SELECT id, url, username, title, description, (
//             SELECT id
//             FROM images
//             WHERE title LIKE '%$2%' OR description LIKE '%$2%' OR username LIKE '%$2%'
//             ORDER BY id ASC
//             LIMIT 1
//         ) AS "lowestId"
//         FROM images
//         WHERE id < $1 AND (title LIKE '%$2%' OR description LIKE '%$2%' OR username LIKE '%$2%')
//         ORDER BY id DESC
//         LIMIT 6
//     `;
//     const params = [startId, searchTerm];

//     return db.query(q, params);
// };

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

module.exports.getHighestImageId = () => {
    const q = `
        SELECT id
        FROM images
        ORDER BY id DESC
        LIMIT 1
    `;

    return db.query(q);
};
