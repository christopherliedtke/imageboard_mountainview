DROP TABLE IF EXISTS tags;

CREATE TABLE tags(
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_id INTEGER NOT NULL REFERENCES images(id),
    tag VARCHAR NOT NULL
);

INSERT INTO tags (image_id, tag) VALUES (
    1,
    'canada'
);

INSERT INTO tags (image_id, tag) VALUES (
    1,
    'valley'
);