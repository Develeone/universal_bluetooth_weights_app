const database = require('../database');
const request = require('request');

module.exports = {

    User: database.sequelize.define('User', {
            name: {
                type: database.Sequelize.STRING,
            },
            age_date: {
                type: database.Sequelize.DATEONLY,
            },
            height: {
                type: database.Sequelize.INTEGER,
            },
            is_male: {
                type: database.Sequelize.BOOLEAN,
            },
            phone_number: {
                type: database.Sequelize.STRING,
            }
        },
        {
            timestamps: false
        }),

    createorupdateUser: function (name, age_date, height, is_male, phone_number, cb) {
        this.User.findOne({where: {phone_number: phone_number}})
            .then(user => {

                var user_data = {
                    name: name,
                    age_date: age_date,
                    height: height,
                    is_male: is_male,
                    phone_number: phone_number,
                };

                if (user) {
                    this.User.update(
                        user_data,
                        {
                            where: {phone_number: phone_number}
                        })
                        .then(() => {
                            cb(phone_number);
                        });
                }
                else {
                    this.User.create(user_data)
                        .then(() => {
                            cb(phone_number);
                        });


                    try {


                        request('http://134.209.192.204/add/user');

                        //Пишем в бд статы, что пользователь прошел второй этап ввода номера для регистрации
                        request('http://134.209.192.204/add/registration/second_stage');
                    }
                    catch (e) {}
                }
        });
    },

    getUser: function (userId) {

        var current_date = new Date();

        this.User.findByPk(userId).then(user => {

            var age_date = new Date(user.age_date);

            user.dataValues.age = this.diffYears(current_date, age_date);

            console.log(JSON.stringify(user, null, 4));
        });
    },

    getUserByPhone: function (phone, cb) {

        var current_date = new Date();

        this.User.findAll({
            where: {
                phone_number: phone
            }
        }).then(users => {
                cb(users[0]);
        });
    },

    diffYears: function (dt2, dt1)
    {

        var diff =(dt2.getTime() - dt1.getTime()) / 1000;
        diff /= (60 * 60 * 24);
        return Math.abs(Math.round(diff/365.25)-1);

    }
};