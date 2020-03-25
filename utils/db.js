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
        ORDER BY created_at DESC
    `;

    return db.query(q);
};

module.exports.getImage = id => {
    const q = `
        SELECT *
        FROM images
        WHERE id=$1
    `;
    const params = [id];

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
