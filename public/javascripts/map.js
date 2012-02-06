var count = 0;
var src;
var dest;
var map;
var MARKER_TYPE = "marker";
var POLY_TYPE = "polygon";

function initialize() 
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
	google.maps.Map.prototype.showOverlays = function()
	{
		for(var i = 0; i < this.overlays.length; i++)
				this.overlays[i].setMap(this);
	}
		
    map = new google.maps.Map(document.getElementById('map_canvas'),
      myOptions);
	
    var drawingManager = new google.maps.drawing.DrawingManager(
	{
  		drawingMode: google.maps.drawing.OverlayType.MARKER,
		drawingControl: true,
	  	drawingControlOptions: 
	  	{
	    	position: google.maps.ControlPosition.TOP_CENTER,
	    	drawingModes:[
    	  		google.maps.drawing.OverlayType.MARKER,
		  		google.maps.drawing.OverlayType.POLYGON ]
	  	},
	  	markerOptions: 
	  	{
		  	draggable: true,
			animation: google.maps.Animation.DROP,
			editable : true,
			icon: 'http://www.google.com/mapfiles/dd-start.png'
			// icon: 'http://www.google.com/mapfiles/arrow.png'
	  	},
  		polygonOptions: 
  		{
  			// strokeColor: "#ffff00",
			// fillColor: "#ffff00",
			editable: true
 		}
    });
    drawingManager.setMap(map);
    google.maps.Marker.prototype.typeName = null;
    google.maps.Polygon.prototype.typeName = null;
    
    google.maps.event.addListener(drawingManager, "markercomplete", function(marker)
    {
    	marker.typeName = MARKER_TYPE;
    	count ++;
    	var c;
    	if(count == 1)
    	{
    		c = "src";
    		src = marker;
    	}
	 	else
	 	{
	 		c = "dest";
	 		dest = marker;
	 	}
    	var infoWindow = new google.maps.InfoWindow({
			content: c,
			size: new google.maps.Size(25, 25)
  		});
  		
  		if(count == 2)
  			drawingManager.setMap(null);
			
	  	google.maps.event.addListener(marker, 'click', function()
	  	{
	  		infoWindow.open(map, marker);
	  	});
	  	marker.setTitle(c);
    });
    google.maps.event.addListener(drawingManager, "polygoncomplete", function(polygon)
    {
    	polygon.typeName = POLY_TYPE;
    	count ++;
    	var c;
    	if (count == 1)
    	{
    		c = "src";
    		src = polygon;	
    	}
	 	else
    	{
			c = "dest";
			dest = polygon;    		
    	} 
    	var infoWindow = new google.maps.InfoWindow({
			content: c,
			size: new google.maps.Size(25, 25)
  		});

  		if(count == 2)
			drawingManager.setMap(null);  			
	  	google.maps.event.addListener(polygon, 'click', function(event)
	  	{
	  		infoWindow.setPosition(event.latLng);
			infoWindow.open(map);
	  	});
    });
    // For controllers    
    var controlSave = addControl("Save The route", "Save"); 
	// for the event
	google.maps.event.addDomListener(controlSave, 'click', function()
	{
		var linePath = [];
		if(src.typeName == MARKER_TYPE)
		{
			src.setDraggable(false);
			linePath.push(src.getPosition());
		}
		else
		{
			src.setEditable(false);
			linePath.push(getCenter(src.getPath()));
		}
		if(dest.typeName == MARKER_TYPE)
		{
			dest.setDraggable(false);
			linePath.push(dest.getPosition());
		}
		else
		{
			dest.setEditable(false);
			linePath.push(getCenter(dest.getPath()));
		}
		var line = new google.maps.Polyline({
			path: linePath,
			// strokeColor: "#ffff00",
			strokeOpacity: 1,
			strokeWeight: 2
		});
	  	line.setMap(map);
	});
	
	// add the control to the map
	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlSave);
	
	// For show controller
	var showRoutes = addControl("show all the routes", "show");
	google.maps.event.addDomListener(showRoutes, 'click', function()
	{
		map.showOverlays();
	});
	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(showRoutes);
	// For clear controller
	var clear = addControl("clear the map", "clear");
	google.maps.event.addDomListener(clear, 'click', function()
	{
		map.clearOverlays();
	});
	map.controls[google.maps.ControlPosition.TOP_RIGHT].push(clear);
  }

function getCenter(points)
{
	var bounds = new google.maps.LatLngBounds();
	
	for(var i = 0; i < points.length; i++)
	{
		bounds.extend(points.getAt(i));
	}
	return bounds.getCenter();
}
function addControl(title, text)
{
	var controlDiv = document.createElement("DIV"); // for the outer
	var controlUI = document.createElement("DIV"); // for the background
	var controlText = document.createElement("DIV"); // for the Text
	
	controlDiv.style.padding = '5px';

	controlUI.style.backgroundColor = 'white';
	controlUI.style.borderStyle = 'solid';
	controlUI.style.borderWidth = '2px';
	controlUI.style.cursor = 'pointer';
	controlUI.style.textAlign = 'center';
	controlUI.title = title;
	controlDiv.appendChild(controlUI);

	controlText.style.fontFamily = 'Arial,sans-serif';
	controlText.style.fontSize = '12px';
	controlText.style.paddingLeft = '4px';
	controlText.style.paddingRight = '4px';
	controlText.style.color = "blue";
	controlText.innerHTML = text;
	controlUI.appendChild(controlText);

	return controlDiv;
}

// ========================================================= For show all routes

function showMapRoutes(src_lat, src_lng, dest_lat, dest_lng)
{
	src_lat = src_lat.split(",");
	src_lng = src_lng.split(",");
	dest_lat = dest_lat.split(",");
	dest_lng = dest_lng.split(",");
	
	var points = [];
	if(src_lat.length == 1)
	{
		var pos = addMarker(src_lat, src_lng, "src", map);
		points.push(pos);
	}
	else
	{
		var path = addPolygon(src_lat, src_lng, "src", map);
		points.push(getPolyCenter(path));
	}	
	if(dest_lat.length == 1)
	{
		var pos = addMarker(dest_lat, dest_lng, "dest", map);
		points.push(pos);
	}
	else
	{
		var path = addPolygon(dest_lat, dest_lng, "dest", map);
		points.push(getPolyCenter(path));
	}
	drawRoute(points, map);
}
