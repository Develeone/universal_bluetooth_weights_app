const database = require('../database');

const User = database.sequelize.define('User', {
        name: {
            type: database.Sequelize.STRING,
        },
        age: {
            type: database.Sequelize.INTEGER,
        },
        height: {
            type: database.Sequelize.INTEGER,
        },
    },
    {
        timestamps: false
    });

User.findAll().then(users => {
    console.log("All users:", JSON.stringify(users, null, 4));
});

User.findAll().then(users => {
    console.log("All users:", JSON.stringify(users, null, 4));
});