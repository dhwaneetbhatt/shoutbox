Shoutbox
========

A twitter style message broadcasting tool. It uses nodejs with express and socket.io on the backend and Backbone.js on the front-end.

### Setup
1. Install nodejs and npm
2. Clone repo and type `npm install .`
3. Run `npm start` and open `http://localhost:3000`

### Docker
1. Install Docker
2. Clone repo and build image `docker build . -t shoutbox:latest`
3. Run `docker run --rm --name shoutbox -p 3000:3000 shoutbox:latest`
4. Open `http://localhost:3000`
