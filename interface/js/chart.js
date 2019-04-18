/*
var chart = null;

/!*document.addEventListener("DOMContentLoaded", function(event) {

});*!/

function showChart(userMetrics) {
    //am4core.useTheme(am4themes_dark);
    // Themes end

    chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    var data = [];

/!*
    for (var i = 0; i < userMetrics.length; i++)
        data.push({ date: new Date(userMetrics[i].date), open: userMetrics[i].weight, close: Math.floor(bodymetrics.getFatFreeMass(userMetrics[i].weight, userMetrics[i].resistance))});
*!/
    for (var i = 0; i < userMetrics.length; i++)
        data.push({ date: new Date(2018, 0, i), open: Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 4), close: Math.round(open + Math.random() * 5 + i / 5 - (Math.random() < 0.5 ? 1 : -1) * Math.random() * 2) });


    //{ date: new Date(2018, 0, i), open: Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 4), close: Math.round(open + Math.random() * 5 + i / 5 - (Math.random() < 0.5 ? 1 : -1) * Math.random() * 2) }
    console.log(data);

    chart.data = data;

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.strokeOpacity = 0;
    dateAxis.renderer.baseGrid.disabled = true;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.grid.template.strokeOpacity = 0;
    valueAxis.renderer.baseGrid.disabled = true;

    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.openValueY = "Вес";
    series.dataFields.valueY = "Вес без жира";
    series.tooltipText = "Вес: {openValueY.value} Вес без жира: {valueY.value}";
    series.strokeWidth = 4;
    series.tensionX = 0.9;
    series.sequencedInterpolation = true;
    series.fillOpacity = 0.2;
    series.defaultState.transitionDuration = 1000;
    series.tensionX = 0.8;
    series.bullets.push(new am4charts.CircleBullet());

    var series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.dateX = "date";
    series2.dataFields.valueY = "Вес";
    series2.sequencedInterpolation = true;
    series2.strokeWidth = 3;
    series2.bullets.push(new am4charts.CircleBullet());
    series2.defaultState.transitionDuration = 1500;
    series2.stroke = chart.colors.getIndex(4);
    series2.tensionX = 0.8;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
    //chart.scrollbarX = new am4core.Scrollbar();
}*/

var chart = null;
var datas = null;

function showChart(userMetrics) {
    datas = userMetrics;
    localStorage.setItem("datas", JSON.stringify(datas));
    //am4core.useTheme(am4themes_dark);
    // Themes end

    chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    var data = [];

    for (var i = 0; i < userMetrics.length; i++)
        data.push({ date: new Date(userMetrics[i].date), open: userMetrics[i].weight, close: Math.floor(bodymetrics.getFatFreeMass(userMetrics[i].weight, userMetrics[i].resistance))});

    chart.data = data;

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.strokeOpacity = 0;
    dateAxis.renderer.baseGrid.disabled = true;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.grid.template.strokeOpacity = 0;
    valueAxis.renderer.baseGrid.disabled = true;

    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.openValueY = "open";
    series.dataFields.valueY = "close";
    series.tooltipText = "open: {openValueY.value} close: {valueY.value}";
    series.strokeWidth = 4;
    series.tensionX = 0.9;
    series.sequencedInterpolation = true;
    series.fillOpacity = 0.2;
    series.defaultState.transitionDuration = 1000;
    series.tensionX = 0.8;
    series.bullets.push(new am4charts.CircleBullet());

    var series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.dateX = "date";
    series2.dataFields.valueY = "open";
    series2.sequencedInterpolation = true;
    series2.strokeWidth = 3;
    series2.bullets.push(new am4charts.CircleBullet());
    series2.defaultState.transitionDuration = 1500;
    series2.stroke = chart.colors.getIndex(4);
    series2.tensionX = 0.8;

    chart.cursor = new am4charts.XYCursor();
    chart.cursor.xAxis = dateAxis;
    //chart.scrollbarX = new am4core.Scrollbar();
}