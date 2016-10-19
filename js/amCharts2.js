var chart = AmCharts.makeChart("chartdiv1", {
    "type": "pie",
    "angle": 20.7,
    "balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
    "labelText": "[[percents]]%",
    "depth3D": 15,
    "titleField": "category",
    "valueField": "column-1",
    "theme": "light",
    "minRadius": 70,
    "allLabels": [],
    "balloon": {},
    "legend": {
        "enabled": true,
        "align": "center",
        "markerType": "circle"
    },
    "titles": [{
        "id": "Title-1",
        "text": "DELIVERY STATUS"
    }],
    "dataProvider": [{
        "category": "Running Late",
        "column-1": "8"
    }, {
        "category": "Ahead Of Time",
        "column-1": "12"
    }, {
        "category": "On Time",
        "column-1": "28"
    }]
});
