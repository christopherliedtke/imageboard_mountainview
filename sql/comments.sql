DROP TABLE IF EXISTS comments;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL,
    comment TEXT NOT NULL,
    image_id INTEGER NOT NULL REFERENCES images(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO comments (username, comment, image_id) VALUES (
    'kmauri',
    'Awesome Pic!!!',
    10
);

INSERT INTO comments (username, comment, image_id) VALUES (
    'teichelt',
    'Who is that guy? :-)',
    10
);