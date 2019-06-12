const Sequelize = require('sequelize');

const sequelize = new Sequelize('revision_db', 'revision_admin', '89242336096', {
    host: '127.0.0.1',
    dialect: 'postgres',
    logging: false
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = {sequelize: sequelize, Sequelize: Sequelize};