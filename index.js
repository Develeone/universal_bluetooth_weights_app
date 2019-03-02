console.log("Start");

var Parser = require("binary-parser").Parser;
var noble = require('noble');

var target_controller_name = 'YUNMAI-ISM2-W';//'YUNMAI-SIGNAL-M1US';//'LeFu Scale';//

noble.on('stateChange', function (state) {
    console.log('Bluetooth', state);
    noble.startScanning();
});

noble.on('discover', function (peripheral) {
    var advertisement = peripheral.advertisement;
    var localName = advertisement.localName;

    console.log("Bluetooth peripheral found: " + localName);

    if (localName === target_controller_name) {
        console.log("Target peripheral found: " + localName);
        Connect(peripheral);
    }
});

//noble.on('scanStop', function () {
function Connect (device) {
    console.log("Connecting");

    device.connect(function (error) {
        console.log("Error: ", error);

        discoverServices(device)
        .then(function (services) {
            if (services.length > 0)
                for (var service in services)
                    discoverCharacteristics(services[service])
                        .then(function (characteristics) {
                            for (var characteristic in characteristics) {
                                characteristics[characteristic].on('data', function (data, isNotification) {
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

                                    console.log("\n\n\nSubscribed!\n\n\n");
                                });
                            }
                        });
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
    if (data.historicalInfo === 1)
        console.log('Historical');

    if (data.userId)
        console.log('User: '+ data.userId);

    if (data.resistance)
        console.log('Resistance: ' + data.resistance);

    if (data.fatPercentage)
        console.log('Fat: ' + data.fatPercentage);

    console.log(new Date(data.date * 1000), data.weight / 100 + "kg");

    console.log(data);
}