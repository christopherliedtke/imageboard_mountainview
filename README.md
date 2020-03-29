# MOUNTAINview - An imageboard with beautiful mountain images

## Description

This imageboard project includes a website showing all images that have been uploaded to the server (database and AWS S3). The user can upload a new image by providing an image file and optional information like title, description, username and tags. Upon submitting a new image the image will be added to the page view without page reload. On inital page load the overview consists of 9 images retrieved from the server. A 'load-more' button is used to load the next 9 images and will disappear once the last image matching the query has been retrieved from the server. In case a new image has been uploaded since the last rendering process, an indicator shows up. A click on the indicator triggers a retrieval of the newly uploaded image from the server.

On click on an image a modal will open, showing all available information on the image including comments that have been made. Additional comments to the image can be made through the modal and are rendered automatically after submission. On the modal the user can navigate to the next or previous image through click on indicators. The individual indicators disappear in case there is no next/previous image.

In the image modal the user can click on an image tag (in case one has been provided). This triggers the closing of the modal and the rendering of the newest 6 images matching the same tag. A 'load-more' button shows up in case there are more matching images available. A dedicated 'remove-tag' button brings the use back to the initial image overview.

Links to individual images or tags can be shared as the particular data is stored in the `location.hash` thus shows up in the url.

## Key Features

-   SPA with automatic re-rendering on updates without page reload
-   Overview of images incl. title, description, username through data base query (9 images upon initial query, ordered by upload date)
-   'Load More' button to retrieve additional 9 images through database query (shows only as long as there are more images matching the query to be retrieved from the database)
-   Upload image to AWS S3 with title, description, username, tags, file (automated addition of uploaded image in current view)
-   Open sharable single image modal (Vue component) with all image information and comments (Vue component) through click on image (functionality through `location.hash`)
-   Navigate to next/previous image through click on indicator in single image modal
-   Add comment (Vue component) on image through single image modal (automated addition of new comment in current view)
-   View and share images including specific tag through click on tag in single image modal (functionality through `location.hash`)
-   Indication about newly uploaded images since last rendering on image overview -> re-render through button click

## Technologies

-   HTML
-   CSS
-   JavaScript
-   Vue.js
-   Node.js/Express
-   Postgre SQL
-   AWS S3, IAM

## Demo

![alt text](public/montainView_load_comment2.gif 'Image overview | Load more | Comment')

![alt text](public/montainView_viewTag2.gif 'Image by tag')

![alt text](public/montainView_addImage2.gif 'Add image')

[Link to Live App - disabled](#)
