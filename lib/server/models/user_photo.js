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

    getAllUserPhotos: function (userId, period, callback) {

        //Получаем фото, следующее за периодом
        let period_date = new Date();
        period_date.setDate(period_date.getDate() - period);

        this.UserPhoto.findOne(
            {
                order:
                    [["createdAt", "DESC"]],
                where: {
                    user_id: userId,
                    createdAt: {
                        [database.Sequelize.Op.lt]: period_date,
                    }
                }
            })
            .then(user_photo => {
                if (user_photo)
                    callback(JSON.stringify(user_photo, null, 4));
                else
                    this.UserPhoto.findOne(
                        {
                            where: {
                                user_id: userId
                            }
                        })
                        .then(user_photo => {
                            //console.log(JSON.stringify(user_photo, null, 4));
                        });
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
            });
    }
};
