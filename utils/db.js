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
    `;

    return db.query(q);
};
