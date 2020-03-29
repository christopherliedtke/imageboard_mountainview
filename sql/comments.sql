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
    'Nice atmosphere! Who is that guy? :D',
    2
);

INSERT INTO comments (username, comment, image_id) VALUES (
    'teichelt',
    'Awesome Pic!!! I want to go there <3',
    1
);