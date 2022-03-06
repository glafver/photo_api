module.exports = (bookshelf) => {
    return bookshelf.model('Photo', {
        tableName: 'photos',
        hidden: ['_pivot_album_id', '_pivot_photo_id'],
        albums() {
            return this.belongsToMany('Album');
        },
        user() {
            return this.belongsTo('User');
        }
    });
};