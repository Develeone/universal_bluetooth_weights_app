const database = require('../database');

module.exports = {

    UserPhoto: database.sequelize.define('users_photos', {
        user_id: {
            type: database.Sequelize.INTEGER,
        },
        photo: {
            type: database.Sequelize.STRING,
        },
    }),

    getAllUserPhotos: function(userId, Period) {
        this.UserPhoto.findAll(
            {
                where: {
                    user_id: userId
                }
            })
            .then(users_photos => {
                console.log("Photos:", JSON.stringify(users_photos, null, 4));
            });
    },

    createUserPhoto: function(userId, photo) {
        this.UserPhoto.create(
            {
                user_id: userId,
                photo: photo,
            })
            .then(() => {
                console.log(
                    "created"
                );
            });
    }
};
