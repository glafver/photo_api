const bcrypt = require('bcrypt');

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
        hashSaltRounds: 10,
        async login(email, password) {
            const user = await new this({ email }).fetch({ require: false });
            if (!user) {
                return false;
            }
            const hash = user.get('password');

            const result = await bcrypt.compare(password, hash);
            if (!result) {
                return false;
            }

            return user;
        }
    });
};