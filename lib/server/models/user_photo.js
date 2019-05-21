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

    getUserPhoto: function (userId, period, callback) {

        //Получаем фото, следующее за периодом
        let period_date = new Date();
        period_date.setDate(period_date.getDate() - period);

        console.log(period_date)
        this.UserPhoto.findOne(
            {
                order:
                    [["createdAt", "ASC"]],
                where: {
                    user_id: userId,
                    createdAt: {
                        [database.Sequelize.Op.gte]: period_date,
                    }
                }
            })
            .then(user_photo => {
                if (user_photo)
                    callback(user_photo);
                    this.UserPhoto.findOne(
                        {
                            where: {
                                user_id: userId
                            }
                        })
                        .then(user_photo => {
                            callback(user_photo);
                        }
                    );
            });

    },

    createUserPhoto: function (userId, photo) {
        this.UserPhoto.create(
            {
                user_id: userId,
                photo: photo,
            })
            .then(() => {
                console.log(
                    "created"
                );
            }
        );
    }
};
