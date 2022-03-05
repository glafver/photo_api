module.exports = (bookshelf) => {
    return bookshelf.model('Photo', {
        tableName: 'photos',
        albums() {
            return this.belongsToMany('Album');
        },
        user() {
            return this.belongsTo('User');
        }
    });
};