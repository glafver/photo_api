module.exports = (bookshelf) => {
    return bookshelf.model('Album', {
        tableName: 'albums',
        photos() {
            return this.belongsToMany('Photo');
        },
        user() {
            return this.belongsTo('User');
        }
    });
};