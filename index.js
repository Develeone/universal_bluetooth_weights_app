var debug = true;

if (debug)
    console.log("Start");

var Parser = require("binary-parser").Parser;
var noble = require('noble');
var bodymetrics = require('./lib/bodymetrics');

var auth = require('./lib/server/auth_controller');

var target_controller_name = 'YUNMAI-ISM2-W';//'YUNMAI-SIGNAL-M1US';//'LeFu Scale';//
var isResultsGot = false;

//Определение моделей
var user_data_model = require('./lib/server/models/user_data');
var user_model = require('./lib/server/models/user');
var user_photo_model = require('./lib/server/models/user_photo');

//Вебсокет-сервер
var websocket_server = require('./lib/server/websocket_server');
websocket_server.create_server();

//Тестирование методов
//user_data_model.getLastWeight(1);
//user_model.createUser("Дмитрий2", "1996-07-16", "179", true, "89242336096");
//user_model.updateUser("Дми", "1996-07-16", "179", true, "79242336096");
//user_model.getUser(1);
//user_data_model.getAllUserDatas(1);
//user_data_model.createUserData(1, 70, 700);
//user_photo_model.createUserPhoto(1, "test");
//user_photo_model.getUserPhoto(1, 1, function (photo) {console.log(JSON.stringify(photo));});

noble.on('stateChange', function (state) {
    if (debug)
        console.log('Bluetooth', state);
    noble.startScanning();
});

noble.on('discover', function (peripheral) {
    var advertisement = peripheral.advertisement;
    var localName = advertisement.localName;

    if (debug)
        console.log("Bluetooth peripheral found: ", localName);

    if (localName === target_controller_name) {
        if (debug)
            console.log("Target peripheral found: " + localName);
        Connect(peripheral);
    }
});

function Connect (device) {
    console.log("Производится подключение к весам YUNMAI\n");

    device.connect(function (error) {
        if (debug)
            console.log("Error: ", error);

        discoverServices(device)
        .then(function (services) {
            if (services.length > 0)
                for (var service in services) {

                    if (debug)
                        console.log(services[service]);

                    discoverCharacteristics(services[service])
                        .then(function (characteristics) {
                            for (var characteristic in characteristics) {
                                characteristics[characteristic].on('data', function (data, isNotification) {
                                    if (debug)
                                        console.log(data);

                                    handleWeighting(data);

                                    return;

                                    if (isNotification) {
                                        if (data !== null)
                                            handleEvent(data, device);
                                    } else {
                                        console.log("ATTENTION EMERGENCY SITUATION ПЛИЗ ЛИВ ЗЕ БИЛДИНГ ИММИДЕАТЕЛИ ЮЗИНГ ЭМЕРДЖЕНСИ ЭКСИТС");
                                        console.log(data);
                                    }
                                });

                                characteristics[characteristic].subscribe(function (error) {
                                    if (error)
                                        console.log(error);

                                    if (debug)
                                        console.log("\n\n\nSubscribed!\n\n\n");
                                });
                            }
                        });
                }
            else
                throw new Error('Service not found')
        });
    });
}
//);

const discoverServices = function (peripheral, serviceUUIDs) {
    return new Promise( function (resolve, reject) {
        peripheral.discoverServices(serviceUUIDs, function (error, services) {
            if (error)
                reject(error);
            else
                resolve(services);
        });
    });
};

const discoverCharacteristics = function (service, charUUIDs) {
    return new Promise( function (resolve, reject) {
        service.discoverCharacteristics(charUUIDs, function (error, chars) {
            if (error)
                reject(error);
            else
                resolve(chars);
        });
    });
};




function handleWeighting(data) {
    const packet = parsePacket(data);

    if (packet.packetType === 1) {
        const measuring = parseWeightingProgress(packet.data);
        display(measuring);
    } else if (packet.packetType === 2) {
        const measured = parseWeightingCompleted(packet.data);
        display(measured);
    }
}

function parsePacket(buffer) {
    const packetParser = new Parser()
        .uint8('packetSignature')
        .uint8('firmwareVersion')
        .uint8('packetLength')
        .uint8('packetType')
        .buffer('data', {
            type: 'int32',
            length: function () {
                return this.packetLength - 5;
            }
        })
        .uint8('checksum');

    return packetParser.parse(buffer)
}


const parseWeightingProgress = function (buffer) {
    const weightingParser = new Parser()
        .uint32be('date')
        .uint16be('weight');

    return weightingParser.parse(buffer);
};

const parseWeightingCompleted = function (buffer) {
    const weightingCompletedParser = new Parser()
        .uint8('historicalInfo')
        .uint32be('date')
        .uint32be('userId')
        .uint16be('weight')
        .uint16be('resistance')
        .uint16be('fatPercentage');

    return weightingCompletedParser.parse(buffer)
};

function display(data) {
    if (data.resistance) {

        if (isResultsGot)
            return;

        console.log("\n\nПроизведен биоимпедансный анализ");

        let weight = data.weight / 100;
        let resistance = data.resistance;

        let loggined_user_id = auth.get_logined_user_id();

        if (loggined_user_id) {
            user_data_model.createUserData(loggined_user_id, weight, resistance);
            user_data_model.getAllUserDatas(loggined_user_id, users_datas => {
                console.log(users_datas);

                let weight_diff = "";

                if (users_datas.length > 2) {
                    let diff = weight - users_datas[users_datas.length - 2].weight;
                    weight_diff = (diff > 0 ? "+" : "-") + Math.abs(diff).toFixed(2) + "kg";
                }

                websocket_server.sendToAllConnections({
                    action: "weighting",
                    weight: (data.weight / 100),
                    weight_diff: weight_diff,
                    resistance: data.resistance,
                    previousBodyMetrics: users_datas
                });
            });
        }

        let metric = bodymetrics.constructor(1, 23, 180);

        //console.log("LBMCoefficient: " + metric.getLBMCoefficient(weight, resistance));

        console.log("Вес: "     + data.weight / 100 + "кг");
        console.log("ИМТ: "     + metric.getBMI(weight).toFixed(2));
        console.log("Мышцы: "   + metric.getMuscle(weight, resistance).toFixed(2) + "%");
        console.log("Вода: "    + metric.getWater(weight, resistance).toFixed(2) + "%");
        console.log("Кости: "   + metric.getBonePercentage(weight, resistance).toFixed(2) + "%");
        console.log("Вн. жир: " + metric.getVisceralFat(weight));
        console.log("Жир: "     + metric.getBodyFat(weight, resistance).toFixed(2) + "%");

        //console.log("Fat (our): " + ((1 - (metric.getLBMCoefficient(weight, resistance)/weight)) * 100));

        isResultsGot = true;


    } else {
        process.stdout.cursorTo(0);
        process.stdout.write("Производится взвешивание: " + (data.weight / 100) + "кг     ");
        websocket_server.sendToAllConnections({action: "weighting", weight: (data.weight / 100)});
        isResultsGot = false;
    }
}