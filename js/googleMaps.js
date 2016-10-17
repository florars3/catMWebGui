var bounds;
var info;
var map;
var loTemp = 0;
var hiTemp = 6;
var maxTrucks = 3;

function drawMap() {
 // icons
 var iconurl = 'http://chart.apis.google.com/chart?chst=d_map_pin_icon_withshadow';
 var iconxurl = 'http://chart.apis.google.com/chart?chst=d_map_xpin_icon_withshadow';
 // var truckIcon  = { url: iconurl + '&chld=truck%7CFFA500%7CFFFFFF' };
 var truckIcon = 'images/TruckGreen.png';
 // var alertIcon = { url: iconxurl + '&chld=pin_star%7Ctruck%7CFFA500%7CFF0000' }
 var alertIcon = 'images/TruckGreen_Alert.png';
 // var warehouseIcon = { url: iconurl + '&chld=home%7C008000%7CFFFFFF' };
 var warehouseIcon = 'images/Warehouse.png';
 // var waypointIcon = { url: iconurl + '&chld=flag%7C0000FF%7CFFFFFF' };
 var waypointIcon = 'images/Deliver.png';
 var towerIcon = { url : 'images/Tower.png'};
 
 // trucks
 var tMarker = [];
 var tListener = [];
 
 // warehouse info
 var warehouseAddr = '3350 Donald Lee Hollowell Pkwy NW Atlanta, GA 30331';
 var warehouseCoords = '33.7899380,-84.4993746';
 
 // tower
 var towerCoords = '33.78526463288818,-84.43051099777222';
 
 // waypoints/destinations
 var wpAddress = [
	'Philips Arena, Philips Dr NW, Atlanta, GA 30303-2723',
	'Georgia Dome, 1 Georgia Dome Dr NW, Atlanta, GA 30313-1504',
	'World of Coca-Cola, 121 Baker St NW, Atlanta, GA 30313-1807',
	'Turner Field, 755 Hank Aaron Dr SW, Atlanta, GA 30315-1120',
	'High Museum of Art, 1280 Peachtree St NE, Atlanta, GA 30309-3549',
	'Fulton County Airport-Brown Field, 3952 Aviation Cir NW, Atlanta, GA 30336',
        'Six Flags Over Georgia, 275 Riverside Parkway Southwest, Austell, GA 30168',
        'Atlanta Metropolitan State College, 1630 Metropolitan Pkwy SW, Atlanta, GA 30310',
        'Lakewood Stadium, Lakewood Ave SE, Atlanta, GA 30315',
        'United States Penitentiary Atlanta, 601 McDonough Blvd SE, Atlanta, GA 30315',
	'Georgia Institute of Technology, North Ave NW, Atlanta, GA 30332',
	'Jimmy Carter Presidential Library and Museum, 441 Freedom Pkwy NE, Atlanta, GA 30307',
	'Zoo Atlanta, 800 Cherokee Ave SE, Atlanta, GA 30315',
	'Clark Atlanta University, 223 James P Brawley Dr SW, Atlanta, GA 30314',
	'CSX-Tilford Yard, 1442 Marietta Rd NW, Atlanta, GA 30318'
 ];
 
 var wpCoords = [
	'33.7570100,-84.3973393', // Philips Arena
	'33.7563217, -84.4022164', // Georgia Dome
	'33.7627423, -84.3926638', // World of Coke
	'33.7365,-84.3898', // Turner Field
	'33.7892,-84.3849', // High Museum of Art
	'33.7771,-84.5217', // Fulton County Airport
        '33.7699,-84.5476', // Six Flags Over Georgia
        '33.7119,-84.4057', // Atlanta Metropolitan State College
        '33.7119,-84.3803', // Lakewood Stadium
        '33.7116,-84.3711', // United States Penitentiary Atlanta
	'33.7713,-84.3912', // Georgia Institute of Technology
        '33.7665,-84.3562', // Jimmy Carter Presidential Library and Museum
        '33.7341,-84.3723', // Zoo Atlanta
	'33.7540,-84.4120', // Clark Atlanta University
	'33.7888,-84.4363' // CSX-Tilford Yard
 ];
 
 var wpName = [];
 for(var i = 0; i < wpAddress.length; i++)  {
	 var name = wpAddress[i].split(",", 1);
	 wpName.push(name[0]);
	 // console.log(name[0]);
 }

 var Waypt = [];
 for(var i = 0; i < wpAddress.length; i++)  {
	 Waypt.push({ location: wpAddress[i] });
 }
 
 // define map
 var mapOptions = {
   mapType: 'normal',
   fullscreenControl: true,
   showTooltip: true,
   showInfoWindow: true,
   mapTypeControl: true,
   scaleControl: true,
   scrollWheel: true,
   streetViewControl: true,
   zoomControl: true,
   
   // User will only be able to view/select custom styled maps.
   mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.SATELLITE, google.maps.MapTypeId.HYBRID, 
     google.maps.MapTypeId.TERRAIN],
 }; // end mapOptions
 
 // draw map
 map = new google.maps.Map(document.getElementById('map_div'), mapOptions);
 
 bounds = new google.maps.LatLngBounds;
 info = new google.maps.InfoWindow();

 // display tower icon
 var latlng = towerCoords.split(",");
 var towerPos = new google.maps.LatLng(parseFloat(latlng[0]), parseFloat(latlng[1]));
 var towerMarker = new google.maps.Marker({
	 position: towerPos,
	 icon: towerIcon,
	 map: map,
	 title: 'Cell Tower',
	 html: 'Cell tower with CAT-M service'
 });

 bounds.extend(towerPos);
 towerMarker.addListener('click', function() { 
       info.setContent(this.html);
       info.open(map, this); 
 });

 // display warehouse icon
 latlng = warehouseCoords.split(",");
 var warehousePos = new google.maps.LatLng(parseFloat(latlng[0]), parseFloat(latlng[1]));
 var warehouseMarker = new google.maps.Marker({
	 position: warehousePos,
	 icon: warehouseIcon,
	 map: map,
	 title: 'Warehouse',
	 html: '<h4>Warehouse:</h4>' + warehouseAddr
 });

 bounds.extend(warehousePos);
 google.maps.event.addListener(warehouseMarker, 'click', function() { 
       info.setContent(this.html);
       info.open(map, this); 
 });

 // display all waypoint location icons
 for(var i = 0; i < wpAddress.length; i++) {
	 latlng = wpCoords[i].split(",");
	 var pos = new google.maps.LatLng(parseFloat(latlng[0]), parseFloat(latlng[1]));
	 var marker = new google.maps.Marker({
		 position: pos,
		 icon: waypointIcon,
		 map: map,
		 title: wpName[i],
		 html: wpAddress[i]
	});
	
	bounds.extend(pos);

        google.maps.event.addListener(marker, 'click', function() { 
	       info.setContent(this.html);
	       info.open(map, this); } );	
 } // end for each Addresses
       
 map.fitBounds(bounds);
 map.setCenter(bounds.getCenter());

 // initialize trucks
 for(var truck = 0; truck < maxTrucks; truck++) {
	 // console.log("Initializing truck " + truck);
	 tMarker[truck]= new google.maps.Marker({
		 map: map,
		 position: warehousePos,
		 icon: truckIcon,
		 title: 'Truck '+ truck + ' is OK.',
		 html: '<h4>Truck '+truck+':</h4><b>Location:</b> ' + warehouseCoords
	       }); // end marker;
	 
	 tListener[truck] = tMarker[truck].addListener('click', function() { 
	       info.setContent(this.html);
	       info.open(map, this); 
	 }); 
 } // end for truck
 
 // Run trucks around their routes
 var interval = self.setInterval(function() { 
	for(var truck = 0; truck < maxTrucks; truck++) {
		var jsonFile = 'json/truck' + truck + '.json';
		// console.log('json file ' + truck + ': ' + jsonFile);
		
		$.getJSON(jsonFile, function(data) {
			 // console.log('Truck ' + data.truck);
			 var html = '<h4>Truck: ' + data.name + '</h4><table>';
			 var pos = new google.maps.LatLng(parseFloat(data.lat), parseFloat(data.lng));
			 
			 tMarker[data.truck].setPosition(pos);
			 
			 if(data.accident || data.door || data.temp < loTemp || data.temp > hiTemp) {
				 tMarker[data.truck].setAnimation(google.maps.Animation.BOUNCE);
				 tMarker[data.truck].setIcon(alertIcon);
				 tMarker[data.truck].setTitle(data.name + ' has a problem!')
				 html += '<tr><td><b>Status:</b></td>' +
					'<td align=right><b class=red>PROBLEM!</b><td></tr>';
			 }
			 else {
				 tMarker[data.truck].setAnimation(null);
				 tMarker[data.truck].setIcon(truckIcon);
				 tMarker[data.truck].setTitle(data.name + ' is OK.')
				 html += '<tr><td><b>Status:</b></td>' +
					'<td align=right>OK</td></tr>';
			 }
			 
			 
			 html += '<tr><td><b>Driver:</b></td><td align=right>' + data.driver + '</td></tr>';
			 html += '<tr><td><b>Location:</b></td><td align=right>' + 
				data.lat + ', ' + data.lng + '</td></tr>';
			 
			 // accident
			 html += '<tr><td><b>Accident:</b></td>';			 
			 if(data.accident)
				 html += '<td align=right><b class=red>YES</b></td></tr>';
			 else
				 html += '<td align=right>No</td></tr>';
			 
			 // door 
			 html += '<tr><td><b>Door:</b></td>';
			 if(data.door)
				 html += '<td align=right><b class=red>OPEN</b></td></tr>';
			 else
				 html += '<td align=right>Closed</td></tr>';
			 
			 // temperature
			 html += '<tr><td><b>Temperature:</b></td>' + 
				'<td align=right>' + data.temp + '&deg;C';
			 if(data.temp < loTemp)
				 html += ' is <b class=blue>TOO COLD</b></td></tr>';
			 else if(data.temp > hiTemp)
				 html += ' is <b class=red>TOO HOT</b></td></tr>';
			 
			 html += '</table>';
			 
			 // listener for infowindow
			 google.maps.event.removeListener(tListener[data.truck]);
			 tListener[data.truck] = tMarker[data.truck].addListener('click', function() { 
			       info.setContent(html);
			       info.open(map, this); 
			 }); // end addListener	
		}); // end getJSON
	} // end for truck
 }, 
 5000 // ms
 );
}
