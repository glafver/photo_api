module.exports = (bookshelf) => {
    return bookshelf.model('User', {
        tableName: 'users',
        hidden: ['password', 'id'],
        albums() {
            return this.hasMany('Album');
        },
        photos() {
            return this.hasMany('Photo');
        }
    }, {
        hashSaltRounds: 10
    });
};