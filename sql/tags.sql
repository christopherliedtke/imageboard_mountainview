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

INSERT INTO tags (image_id, tag) VALUES (
    1,
    'glacier'
);

INSERT INTO tags (image_id, tag) VALUES (
    2,
    'river'
);

INSERT INTO tags (image_id, tag) VALUES (
    2,
    'fog'
);

INSERT INTO tags (image_id, tag) VALUES (
    2,
    'usa'
);

INSERT INTO tags (image_id, tag) VALUES (
    3,
    'valley'
);

INSERT INTO tags (image_id, tag) VALUES (
    3,
    'usa'
);


INSERT INTO tags (image_id, tag) VALUES (
    4,
    'switzerland'
);

INSERT INTO tags (image_id, tag) VALUES (
    4,
    'snow'
);

INSERT INTO tags (image_id, tag) VALUES (
    5,
    'italy'
);

INSERT INTO tags (image_id, tag) VALUES (
    5,
    'lake'
);

INSERT INTO tags (image_id, tag) VALUES (
    6,
    'new_zealand'
);

INSERT INTO tags (image_id, tag) VALUES (
    6,
    'lake'
);

INSERT INTO tags (image_id, tag) VALUES (
    6,
    'snow'
);