const knex = require('knex')({
    debug: false,
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'root',
        database: process.env.DB_NAME || 'photo_app',
    }
});

const bookshelf = require('bookshelf')(knex);

const models = {};
models.User = require('./User')(bookshelf);
models.Photo = require('./Photo')(bookshelf);
models.Album = require('./Album')(bookshelf);

module.exports = {
    bookshelf,
    ...models,
};