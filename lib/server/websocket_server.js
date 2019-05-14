const  WebSocketServer = require('websocket').server;
const http = require('http');

//Определение моделей
const user_data_model = require('./models/user_data');
const user_model = require('./models/user');
const user_photo_model = require('./models/user_photo');

module.exports = {
    connections: [],

    create_server: function () {
        var self = this;

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
                            user_photo_model.createUserPhoto(1, message.data);
                            break;
                        case "phone_got":
                            user_model.getUserByPhone(message.data, function (user) {

                                if (user) {
                                    user_data_model.getAllUserDatas(user.id, function (result) {
                                        var response = {
                                            action: "gettingUserByPhone",
                                            user: user,
                                            weighings: result,
                                        };
                                        self.sendToAllConnections(response);
                                    });
                                }
                                else self.sendToAllConnections({action: "gettingUserByPhone"});
                            });
                            break;
                        case "register_user":
                            user_model.createUser(
                                message.data.name,
                                message.data.age_date,
                                message.data.height,
                                message.data.is_male,
                                message.data.phone_number,
                                function (message) {
                                    self.sendToAllConnections({message: message});
                                });
                            break;
                        case "update_user":
                            user_model.updateUser(
                                message.data.name,
                                message.data.age_date,
                                message.data.height,
                                message.data.is_male,
                                message.data.phone_number,
                                function (message) {
                                    self.sendToAllConnections({message: message});
                                });
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
};