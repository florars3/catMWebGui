var chart = AmCharts.makeChart("chartdiv2", {
    "type": "serial",
    "categoryField": "category",
    "angle": 30,
    "depth3D": 30,
    "startDuration": 1,
    "theme": "light",
    "categoryAxis": {
        "gridPosition": "start",
        "titleFontSize": 0
    },
    "trendLines": [],
    "graphs": [{
        "balloonText": "[[title]] of [[category]]:[[value]]",
        "fillAlphas": 1,
        "id": "AmGraph-1",
        "title": "Fuel Cost(Annually)",
        "type": "column",
        "valueField": "column-1"
    }, {
        "balloonText": "[[title]] of [[category]]:[[value]]",
        "fillAlphas": 1,
        "id": "AmGraph-2",
        "title": "Fuel Cost Reduced 33%(Annually)",
        "type": "column",
        "valueField": "column-2"
    }],
    "guides": [],
    "valueAxes": [{
        "id": "ValueAxis-1",
        "title": "Fuel Cost(Annually)"
    }],
    "allLabels": [],
    "balloon": {},
    "legend": {
        "enabled": true,
        "useGraphSettings": true
    },
    "titles": [{
        "id": "Title-1",
        "size": 15,
        "text": "Reduced $ by Controlling Aggressive Driving"
    }],
    "dataProvider": [{
        "category": "2013",
        "column-1": "100",
        "column-2": "70"
    }, {
        "category": "2014",
        "column-1": "60",
        "column-2": "40"
    }, {
        "category": "2015",
        "column-1": "50",
        "column-2": "40"
    }]
});
