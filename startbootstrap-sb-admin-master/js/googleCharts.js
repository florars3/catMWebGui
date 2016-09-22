google.charts.load('upcoming', {packages: ['map']});
google.charts.setOnLoadCallback(drawMap);

function drawMap () {
var data = new google.visualization.DataTable();
data.addColumn('string', 'Address');
data.addColumn('string', 'Location');

data.addRows([
  ['Atlanta', 'Atlanta City']
]);
var options = {
  mapType: 'styledMap',
  zoomLevel: 7,
  showTooltip: true,
  showInfoWindow: true,
  useMapTypeControl: true,
  // User will only be able to view/select custom styled maps.
  mapTypeIds: ['styledMap', 'redEverything', 'imBlue'],
  maps: {
    styledMap: {
      name: 'Styled Map',
      styles: [
        {featureType: 'poi.attraction',
         stylers: [{color: '#fce8b2'}]},
        {featureType: 'road.highway',
         stylers: [{hue: '#0277bd'}, {saturation: -50}]},
        {featureType: 'road.highway', elementType: 'labels.icon',
         stylers: [{hue: '#000'}, {saturation: 100}, {lightness: 50}]},
        {featureType: 'landscape',
         stylers: [{hue: '#259b24'}, {saturation: 10},{lightness: -22}]}
    ]},
    redEverything: {
      name: 'Redden All The Things',
      styles: [
        {featureType: 'landscape',
         stylers: [{color: '#fde0dd'}]},
        {featureType: 'road.highway',
         stylers: [{color: '#67000d'}]},
        {featureType: 'road.highway', elementType: 'labels',
         stylers: [{visibility: 'off'}]},
        {featureType: 'poi',
         stylers: [{hue: '#ff0000'}, {saturation: 50}, {lightness: 0}]},
        {featureType: 'water',
         stylers: [{color: '#67000d'}]},
        {featureType: 'transit.station.airport',
         stylers: [{color: '#ff0000'}, {saturation: 50}, {lightness: -50}]}
    ]},
    imBlue: {
      name: 'All Your Blues are Belong to Us',
      styles: [
        {featureType: 'landscape',
         stylers: [{color: '#c5cae9'}]},
        {featureType: 'road.highway',
         stylers: [{color: '#023858'}]},
        {featureType: 'road.highway', elementType: 'labels',
         stylers: [{visibility: 'off'}]},
        {featureType: 'poi',
         stylers: [{hue: '#0000ff'}, {saturation: 50}, {lightness: 0}]},
        {featureType: 'water',
         stylers: [{color: '#0288d1'}]},
        {featureType: 'transit.station.airport',
         stylers: [{color: '#0000ff'}, {saturation: 50}, {lightness: -50}]}
    ]}
  }
};
var map = new google.visualization.Map(document.getElementById('map_div'));

map.draw(data, options);
}
