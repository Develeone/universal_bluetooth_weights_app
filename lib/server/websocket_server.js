const  WebSocketServer = require('websocket').server;
const http = require('http');

const request = require('request');

//Определение моделей
const user_data_model = require('./models/user_data');
const user_model = require('./models/user');
const user_photo_model = require('./models/user_photo');
const activity_types_model = require('./models/activity_type');
const training_goals_types = require('./models/training_goals_type');

const auth = require('./auth_controller');

module.exports = {
    connections: [],

    create_server: function () {
        let self = this;

        let server = http.createServer();
        server.listen(1337);

        // create the server
        wsServer = new WebSocketServer({
            httpServer: server,
            maxReceivedMessageSize: 10 * 1024 * 1024,
            maxReceivedFrameSize: 131072
        });

        // WebSocket server
        wsServer.on('request', function (request) {
            console.log("Connection got!");

            let connection = request.accept(null, request.origin);

            connection.on('message', function (message) {
                if (message.type === 'utf8') {
                    message = JSON.parse(message.utf8Data);
                    console.log("Server has got message: ", message);

                    switch (message.action) {
                        case "photo_got":
                            console.log("Photo is saving");
                            user_photo_model.createUserPhoto(message.data.user_id, message.data.photo);
                            break;
                        case "phone_got":
                            self.login(message.data);
                            break;
                        case "create_or_update_user":
                            user_model.createorupdateUser(
                                message.data.name,
                                message.data.age_date,
                                message.data.height,
                                message.data.is_male,
                                message.data.phone_number,
                                message.data.activity_type_id,
                                function (phone_number) {
                                    self.login(phone_number);
                                });
                            break;
                        case "logout":
                            auth.logout_user();
                            break;
                        case "get_photo":
                            user_photo_model.getUserPhoto(
                                message.data.user_id,
                                message.data.period,
                                function (response) {
                                    self.sendToAllConnections({
                                        action: "user_photo_by_period",
                                        data: response
                                    });
                                }
                            );
                            break;
                        case "get_activity_types":
                            activity_types_model.getAllTypes(
                                function (response) {
                                    self.sendToAllConnections({
                                        action: "activity_types",
                                        data: response
                                    });
                                }
                            );
                            break;
                        case "get_training_goals_types":
                            training_goals_types.getAllTypes(
                                function (response) {
                                    self.sendToAllConnections({
                                        action: "training_goals_types",
                                        data: response
                                    });
                                }
                            );
                            break;
                        case "set_training_goals_type":
                            user_model.updateTrainingGoal(
                                message.data.phone_number,
                                message.data.training_goals_type_id,
                            ).then(result => {
                                self.sendToAllConnections({
                                    action: "setted_training_goals_type",
                                    data: result
                                });
                            });
                            break;
                        default:
                            console.error("WS: Received unknown message action");
                            // message.action = "WTF";
                            // self.sendToAllConnections(message.data)
                    }
                }
            });

            connection.on('close', function (connection) {
                console.log("Client has disconnected")
            });

            self.connections.push(connection);
        });
    },

    sendToAllConnections: function(data) {
        this.connections.forEach(function (t) {
            t.send(JSON.stringify(data));
        });
    },

    login: function (phone_number) {
        let self = this;

        user_model.getUserByPhone(phone_number, function (user) {

            if (user) {
                auth.login_user(user.id);
                user_data_model.getAllUserDatas(user.id, function (weighings) {
                    user_photo_model.getUserPhoto(user.id, 1, function (photos) {
                        var response = {
                            action: "gettingUserByPhone",
                            user: user,
                            weighings: weighings,
                            photos: photos,
                        };
                        self.sendToAllConnections(response);
                    });
                });
            }
            else {
                self.sendToAllConnections({action: "gettingUserByPhone"});

                try {
					//Пишем в бд статы, что пользователь прошел первый этап ввода номера для регистрации
					request('http://134.209.192.204/add/registration/first_stage');
				} catch (e) {}
            }
        });
    },
};