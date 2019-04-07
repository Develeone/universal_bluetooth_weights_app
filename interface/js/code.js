// import bodymetrics from 'bodymetrics';

var targetWeight = 84.7;
var currentWeight = 0;

document.addEventListener("DOMContentLoaded", function(event) {

  lerpingInterval = setInterval(function () {
    currentWeight = lerp(currentWeight, targetWeight);
    document.getElementById("weight").innerHTML = currentWeight.toFixed(1);
  }, 10);

  ConnectWS();
});

function ConnectWS() {
    window.WebSocket = window.WebSocket || window.MozWebSocket;

    connection = new WebSocket('ws://localhost:1337');

    connection.onopen = function () {
      //            SetLastWeightData("Connected");
    };

    connection.onerror = function (error) {
        //            SetLastWeightData("Error");
    };

    connection.onmessage = function (message) {
      console.log(message.data);

      message = JSON.parse(message.data);
        let weight = message.weight;
        let resistance = message.resistance;

        SetLastWeightData(weight);

        if (resistance) {
          SetBodymetricsData(weight, resistance);

          // TODO: Паша, делай сюда
        }
    };

}

var lerpingInterval;

function SetLastWeightData(weight) {
    targetWeight = weight;
}

function SetBodymetricsData(weight, resistance) {
  let metric = bodymetrics.constructor(1, 23, 180);

  //console.log("LBMCoefficient: " + metric.getLBMCoefficient(weight, resistance));

  let BMI = metric.getBMI(weight).toFixed(2);
  let muscle = metric.getMuscle(weight, resistance).toFixed(2);
  let water = metric.getWater(weight, resistance).toFixed(2);
  let bones = metric.getBonePercentage(weight, resistance).toFixed(2);
  let visceralFat = metric.getVisceralFat(weight);
  let bodyFat = metric.getBodyFat(weight, resistance).toFixed(2);

  console.log("Вес: "     + weight / 100 + "кг");
  console.log("ИМТ: "     + BMI);
  console.log("Мышцы: "   + muscle);
  console.log("Вода: "    + water);
  console.log("Кости: "   + bones);
  console.log("Вн. жир: " + visceralFat);
  console.log("Жир: "     + bodyFat);
  console.log("Масса тела без жира: "     + metric.getFatFreeMass(weight, resistance).toFixed(2));


  document.querySelector(".bmi-block .indicator-value").innerHTML = BMI;
  document.querySelector(".water-block .indicator-value").innerHTML = water + "%";
  document.querySelector(".body-fat-indicator .indicator-value").innerHTML = bodyFat;
  document.querySelector(".body-fat-indicator").style.backgroundPositionY = (70 - parseInt(bodyFat)) + "vw";
  document.querySelector(".water-block .bar .value").style.width = water + "%";
  document.querySelector(".bmi-block .bar .value").style.marginLeft = BMI * 1.5 + "%";
}

function lerp(from, to) {
    return from+((to-from)/20);
}





function SetTimeRange(object) {
    var items = document.getElementsByClassName("time-range-selector-container");

    for (var i = 0; i < items.length; i++) {
        items[i].classList.remove("active");
    }

    object.classList.add("active");
}