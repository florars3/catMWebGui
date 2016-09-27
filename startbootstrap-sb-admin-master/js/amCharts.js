var chart = AmCharts.makeChart( "chartdiv", {
	"type": "pie",
	"angle": 20.7,
	"balloonText": "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>",
	"labelText": "[[percents]]%",
	"depth3D": 15,
	"titleField": "category",
	"valueField": "column-1",
	"theme": "light",
	"minRadius":80,
	"allLabels": [],
	"balloon": {},
	"legend": {
		"enabled": true,
		"align": "center",
		"markerType": "circle"
	},
	"titles": [
		{
			"id": "Title-1",
			"text": "VEHICLE STATUS"
		}
	],
	"dataProvider": [
		{
			"category": "In Garage",
			"column-1": "20"
		},
		{
			"category": "Stalled",
			"column-1": "10"
		},
		{
			"category": "In transit",
			"column-1": "100"
		}
	]
} );
