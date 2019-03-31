var targetWeight = 84.7;
var currentWeight = 0;

ConnectWS();

function ConnectWS() {
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    connection = new WebSocket('ws://localhost:1337');

    connection.onopen = function () {
        //            SetLastData("Connected");
    };

    connection.onerror = function (error) {
        SetLastData("Error");
    };

    connection.onmessage = function (message) {
        if (JSON.parse(message.data).data < 200)
            SetLastData(JSON.parse(message.data).data);
    };

}

var lerpingInterval = setInterval(function () {
    currentWeight = lerp(currentWeight, targetWeight);
    document.getElementById("weight").innerHTML = currentWeight.toFixed(1);
}, 10);

function SetLastData(weight) {
    targetWeight = weight;
    console.log(weight);
}

function lerp(from, to) {
    return from+((to-from)/20);
}
