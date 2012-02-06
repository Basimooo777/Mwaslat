var searchMap;
function initView()
{
	var myOptions = 
    {
  		center: new google.maps.LatLng(31.246599,29.999199),
  		zoom: 8,
  		mapTypeControl: false,
		scaleControl: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
    };
	google.maps.Map.prototype.overlays = [];
	google.maps.Map.prototype.clearOverlays = function()
	{
		for(var i = 0; i < this.overlays.length; i++)
				this.overlays[i].setMap(null);
	}
	
    searchMap = new google.maps.Map(document.getElementById('search_map'),
      myOptions);
}

function view(src_lat, src_lng, dest_lat, dest_lng)
{
	searchMap.clearOverlays();
	src_lat = src_lat.split(",");
	src_lng = src_lng.split(",");
	dest_lat = dest_lat.split(",");
	dest_lng = dest_lng.split(",");
	
	var bounds = new google.maps.LatLngBounds();

	var points = [];
	if(src_lat.length == 1)
	{
		var pos = addMarker(src_lat, src_lng, "src", searchMap);
		points.push(pos);
		bounds.extend(pos);
	}
	else
	{
		var path = addPolygon(src_lat, src_lng, "src", searchMap);
		points.push(getPolyCenter(path));
		for(var i = 0; i < path.length; i ++)
		{
			bounds.extend(path[i]);
		}
	}	
	if(dest_lat.length == 1)
	{
		var pos = addMarker(dest_lat, dest_lng, "dest", searchMap);
		points.push(pos);
		bounds.extend(pos);		
	}
	else
	{
		var path = addPolygon(dest_lat, dest_lng, "dest", searchMap);
		points.push(getPolyCenter(path));
		for(var i = 0; i < path.length; i ++)
		{
			bounds.extend(path[i]);
		}
	}
	drawRoute(points, searchMap);
	searchMap.fitBounds(bounds);
}

function addMarker(lat, lng, title, map)
{
	var pos = new google.maps.LatLng(Number(lat), Number(lng));
	var marker = new google.maps.Marker({
		position: pos,
		map: map,
		draggable: false,
		title: title
	});
	var infoWindow = new google.maps.InfoWindow({
  		content: title,
  		size: new google.maps.Size(50, 50)
  	});
	  	
  	google.maps.event.addListener(marker, 'click', function()
  	{
		infoWindow.open(map, marker);
  	});
	map.overlays.push(marker);
	return pos;
}

function addPolygon(lat, lng, title, map)
{
	var path = [];
	for(var i = 0; i < lat.length; i ++)
	{
		path.push(new google.maps.LatLng( Number(lat[i]), Number(lng[i]) ))
	}
	var poly = new google.maps.Polygon({
		path: path,
		// storkeColor: "#FF0000",
		// strokeOpacity: 1,
		// strokeWeight: 2,
		// fillColor: "#FF0000",
		// fillOpacity: 0.35,
		strokeColor: "#FF0000",
		fillColor: "#FF0000",
		editable: false				
	});

	poly.setMap(map);
	
	var infoWindow = new google.maps.InfoWindow({
		content: title,
		size: new google.maps.Size(30, 30)
	});
	google.maps.event.addListener(poly, 'click', function(event)
	{
		infoWindow.setPosition(event.latLng);
		infoWindow.open(map);
	});
	map.overlays.push(poly);
	map.overlays.push(infoWindow);
	return path;
}

function drawRoute(path, map)
{
	var line = new google.maps.Polyline({
		path: path,
		strokeColor: "#FF0000",
		strokeOpacity: 0.7,
		strokeWeight: 2
	});
	
	line.setMap(map);
	map.overlays.push(line);
}
function getPolyCenter(points)
{
	var bounds = new google.maps.LatLngBounds();
	
	for(var i = 0; i < points.length; i++)
	{
		bounds.extend(points[i]);
	}
	return bounds.getCenter();
}