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
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1980&q=50',
    'Kalen Emsley',
    'Kluane National Park and Reserve of Canada, Canada',
    'Wet mountain valley'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://images.unsplash.com/photo-1456428199391-a3b1cb5e93ab?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1980&q=50',
    'Steve Carter',
    'Crescent City, California, United States',
    'Man in a bubbling river'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://images.unsplash.com/photo-1443632864897-14973fa006cf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1980&q=50',
    'Jamie Hagan',
    'Zion National Park, United States',
    'Picturesque Mountain View'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1980&q=50',
    'Joshua Earle',
    'Zermatt, Switzerland',
    'Man on snow covered mountain looking at the Matterhorn'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://images.unsplash.com/photo-1480497490787-505ec076689f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1980&q=50',
    'Tim Stief',
    'Toblacher See, Italy',
    'We did a short road trip to the Dolomites (5hrs driving). We stopped the car almost every 5 meters because of the beautiful landscape. It reminded me to take the time and appreciate what is around you.'
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1980&q=50',
    'Tobias Keller',
    'Lake Tekapo, New Zealand',
    'Aerial view on Lake Tekapo with snow covered mountains in the background'
);
