DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
    'Kalen Emsley',
    'Kluane National Park and Reserve of Canada, Canada',
    'Wet mountain valley'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://images.unsplash.com/photo-1456428199391-a3b1cb5e93ab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2978&q=80',
    'Steve Carter',
    'Crescent City, California, United States',
    'Man in a bubbling river'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://images.unsplash.com/photo-1443632864897-14973fa006cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2250&q=80',
    'Jamie Hagan',
    'Zion National Park, United States',
    'Picturesque Mountain View'
);
