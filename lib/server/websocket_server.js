const  WebSocketServer = require('websocket').server;
const http = require('http');

const request = require('request');

//Определение моделей
const user_data_model = require('./models/user_data');
const user_model = require('./models/user');
const user_photo_model = require('./models/user_photo');

const auth = require('./auth_controller');

module.exports = {
    connections: [],

    create_server: function () {
        let self = this;

        var server = http.createServer(function (request, response) {
            // process HTTP request. Since we're writing just WebSockets
            // server we don't have to implement anything.
        });

        server.listen(1337, function () {

        });

        // create the server
        wsServer = new WebSocketServer({
            httpServer: server,
            maxReceivedMessageSize: 10 * 1024 * 1024,
            maxReceivedFrameSize: 131072
        });

        // WebSocket server
        wsServer.on('request', function (request) {
            console.log("Connection got!");

            var connection = request.accept(null, request.origin);

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
                                function (phone_number) {
                                    self.login(phone_number);
                                });
                            break;
                        case "last_weight":
                            user_data_model.getLastWeight(message.data, function (weight) {
                                self.sendToAllConnections(weight);
                            });
                            break;
                        case "logout":
                            auth.logout_user();
                            break;
                        default:
                            console.log("Data is sending");
                            message.data.action = "weighting";
                            self.sendToAllConnections(message.data)
                    }
                }
            });

            connection.on('close', function (connection) {
                console.log("Client has disconnected")
            });

            connection.on('open', function (connection) {
                console.log("OPEN!");
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
        var self = this;

        user_model.getUserByPhone(phone_number, function (user) {

            if (user) {
                auth.login_user(user.id);
                user_data_model.getAllUserDatas(user.id, function (weighings) {
                    user_photo_model.getAllUserPhotos(user.id, 1, function (photos) {
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

                //Пишем в бд статы, что пользователь прошел первый этап ввода номера для регистрации
                request('http://134.209.192.204/add/registration/first_stage');
            }
        });
    },
};