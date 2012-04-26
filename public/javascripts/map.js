function Map () {
	var map =  null;
	var drawingManager = null;
	var lines = [];
	var overlays = [];
	var matchNode = null;
	var addPlace = null;
	var polys = [];
	
	this.initialize = function () 
	{
		var myOptions = {
	  		center: new google.maps.LatLng(31.246599,29.999199),
	  		zoom: 8,
			disableDefaultUI : true,
			scaleControl: true,
			zoomControl : true, 
			mapTypeId: google.maps.MapTypeId.ROADMAP
	    };
	    map = new google.maps.Map(document.getElementById('map_canvas'),
	      myOptions);
	
	 	google.maps.Polygon.prototype.id = null;
		google.maps.Polygon.prototype.district = null;
	 	google.maps.Polygon.prototype.tip = null;
	 	google.maps.Polygon.prototype.del = function()
	 	{
	 		this.setMap(null);
	 		this.tip.setMap(null);
	 	}
	 	google.maps.Polygon.prototype.getNode = function(){
			return this.getPath().getAt(0);
		}
		google.maps.Polygon.prototype.getPointString = function()
	 	{
	 		return google.maps.geometry.encoding.encodePath(this.getPath());	
	 	}
	}
	this.getOverlays = function()
	{
		return overlays;	
	}
 	this.addDrawingManager = function()
	{
		google.maps.drawing.DrawingManager.prototype.on = function()
		{
			this.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
		}
		google.maps.drawing.DrawingManager.prototype.off = function()
		{
			this.setDrawingMode(null);
		}
		drawingManager = new google.maps.drawing.DrawingManager(
		{
	  		drawingMode: null,
	  		rawingModes:[google.maps.drawing.OverlayType.POLYGON ],
			drawingControl: false,
	  		polygonOptions:
	  		{
	  			// strokeColor: "#FFFFFF",
				// fillColor: "#FFFF00" ,
				editable: true ,
	 		},
	 		map: map
	    });
	    google.maps.event.addListener(drawingManager, "polygoncomplete", function(polygon)
	    {
	    	if(getAddPlace() == "Add Place")
	    	{
	    		polygon.setMap(null);
				polygon = null;
	    	}
	    	else
	    	{
		    	setAddPlace("Add Place");
	    		
				overlayComplete(polygon);
				google.maps.event.addListener(polygon.getPath() , "set_at", function(){
					polygon.tip.setMap(null);
					dragEvent(polygon);
					addTip(polygon);
				});
		    	google.maps.event.addListener(polygon, "rightclick", function(event){
		    		if(map.rightDelete != null)
		    			map.rightDelete.setMap(null);
		    		rightClickDelete(event.latLng, polygon);
		    	});
		    	google.maps.event.addListener(polygon, "click", function(event){
		    		if(map.rightDelete != null)
		    		{
		    			map.rightDelete.setMap(null);
		    			map.rightDelete = null;
		    		}
		    	});
				polys.push(polygon);
		    	addTip(polygon);
	    	}
	    });
	}
	function overlayComplete(overlay)
	{
		if(overlays.length < 2)     // note that overlays will increment after that
		{
			overlays.push(overlay);
			if(overlays.length == 2)
				drawLine(1, false);
		}
		else
		{
			matchNode = overlay;
			hidePlaceControl();
		}
		drawingManager.off();
    	addMatchingEvent(overlay);
	}
	this.addPlaceControl = function()
	{
		addPlace = addControl("adding new place", "Add Place");
		google.maps.event.addDomListener(addPlace, 'click', function()
		{
			if(getAddPlace() == "Add Place")
			{
				setAddPlace("Cancel");
				drawingManager.on();
			}
			else
			{
				setAddPlace("Add Place");
				drawingManager.off();
			}
		});
		showPlaceControl();
	}
	function showPlaceControl()
	{
		map.controls[google.maps.ControlPosition.TOP_RIGHT].push(addPlace);
	}
	function hidePlaceControl()
	{
		map.controls[google.maps.ControlPosition.TOP_RIGHT].removeAt(0);
	}
	function setAddPlace(text)
	{
		addPlace.firstChild.firstChild.innerHTML = text;
	}
	function getAddPlace()
	{
		return addPlace.firstChild.firstChild.innerHTML;
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
	function drawLine(index, isDrag){
		var path = [];
		path.push(overlays[index].getNode());
		path.push(overlays[index - 1].getNode());
		var line = new google.maps.Polyline({
			path : path,
			strokeColor : "#0000FF",
			strokeOpacity : 0.7,
			strokeWeight : 3
		});
		line.setMap(map);
		if(isDrag)
			lines[index - 1] = line;
		else
		{
			lines.push(line);
			addLineEvent(line);
		}
	}
	function dragEvent(overlay)
	{
		var index = overlays.indexOf(overlay);
		if(index > 0) // left except the first overlay
		{
			var line1 = lines[index - 1];
			line1.setMap(null);
			drawLine(index, true);
		}
		if(index < overlays.length - 1 && index >= 0) // rigth except the last overlay
		{
			var line2 = lines[index];
			line2.setMap(null);
			drawLine(index + 1, true);
		}
	}
	function addMatchingEvent(overlay)
	{
		google.maps.event.addListener(overlay, "click", function()
		{
			if(matchNode != null)
			{
				var index = overlays.indexOf(overlay);
				if(index == overlays.length - 1)
				{
					overlays.push(matchNode);
					refresh();
					matchNode = null;
					showPlaceControl();
				}
				else if(index == 0)
				{
					overlays.splice(0, 0, matchNode);
					refresh();
					matchNode = null;
					showPlaceControl();
				}
			}
		});
	}
	function addLineEvent(line)
	{
		google.maps.event.addListener(line, "click", function()
		{
			if(matchNode != null)
			{
				var index = lines.indexOf(line);
				overlays.splice(index + 1, 0, matchNode);
				refresh();
				matchNode = null;
				showPlaceControl();
			}
		});
	}
	function deleteOverlay(overlay)
	{
		var index = overlays.indexOf(overlay);
		if(index >= 0)
		{
			var choice = confirm("Are you sure you want to delete stop # " + (index + 1) + " ?");
			if(choice)
			{
				overlays.splice(index, 1);
				overlay.del();
				refresh();
			}
		}
		else  // the matching node
		{
			var choice = confirm("Are you sure you want to delete the new stop ?");
			if(choice)
			{
				overlay.del();
				matchNode = null;
				showPlaceControl();
			}
		}
	}
	function refresh()
	{
		// clear lines
		for(var i = 0; i < lines.length; i ++)
		{
			lines[i].setMap(null);			
		}
		lines = [];
		// change icons and change lines
		for(var i = 0; i < overlays.length; i ++)
		{
			overlays[i].del();
			addTip(overlays[i]);
			overlays[i].setMap(map);
			if(i > 0)
				drawLine(i, false);
		}
	}
	function addTip(overlay)
	{
		var div = document.createElement("Div");
		div.style.backgroundColor = "yellow";
		div.style.color = "blue";
		div.style.position = "absolute";
		
		var index = overlays.indexOf(overlay);
		if(index != -1)
			div.innerHTML = (index + 1) + "";
		else
			div.innerHTML = (overlays.length + 1) + "";
		overlay.tip = new CustomeOverlay(overlay.getNode(), div);
	}
	this.addRightDelete = function()
	{
		google.maps.Map.prototype.rightDelete = null;
		
		google.maps.event.addListener(map, "rightclick", function(){
			if(map.rightDelete != null)
			{
				map.rightDelete.setMap(null);
				map.rightDelete = null;
			}
		});
		google.maps.event.addListener(map, "click", function(){
			if(map.rightDelete != null)
			{
				map.rightDelete.setMap(null);
				map.rightDelete = null;
			}
		});

	}
	function rightClickDelete(pos, overlay)
	{
		var div = document.createElement("Div");
		div.style.position = "absolute";
		var button = createButton("Delete");
		button.onclick = function (){
			deleteOverlay(overlay);
		}
	 	div.appendChild(button);
		map.rightDelete = new CustomeOverlay(pos, div);
	}
	function createButton(text)
	{
		var button = document.createElement("Button");
		button.innerHTML = text;
		button.style.border = "0px";
		button.style.background = "yellow";
		button.style.color = "blue";
		button.style.fontWeight = "bolder";
		button.onmouseout= function()
		{
			this.style.background = 'yellow'	
		}
		button.onmouseover= function()
		{
			this.style.background = '#33FFCC'	
		}
		return button;
	}
	function CustomeOverlay(pos, div)
	{
		this.pos = pos;
		this.div = div;
		this.setMap(map);
	}
	CustomeOverlay.prototype = new google.maps.OverlayView();
	CustomeOverlay.prototype.onAdd = function()
	{
		var panes = this.getPanes();
	 	panes.overlayMouseTarget.appendChild(this.div)
	}
	CustomeOverlay.prototype.draw = function()
	{
		var projection = this.getProjection();
	  	var point = projection.fromLatLngToDivPixel(this.pos);

		var div = this.div;
		div.style.left = point.x + "px";
		div.style.top = point.y + "px";
	}
	CustomeOverlay.prototype.onRemove = function()
	{
		this.div.parentNode.removeChild(this.div);
		this.div = null;
	}

	// --------------------------------------------------------------

	this.showMapRoutes = function ()
	{
		var ids = [];
		for(var i = 0; i < roots.length; i ++)
		{
			var route = roots[i].route;
			route.src.path = google.maps.geometry.encoding.decodePath(route.src.path);
			route.dest.path = google.maps.geometry.encoding.decodePath(route.dest.path);
			
			var points = [];
			
			if(ids.indexOf(route.src.id) == -1)
			{
				addPolygon(route.src);
				ids.push(route.src.id);
			}
			points.push(route.src.path[0]);
			
			if(ids.indexOf(route.dest.id) == -1)
			{
				addPolygon(route.dest);
				ids.push(route.dest.id);
			}
			points.push(route.dest.path[0]);
			drawRoute(points);
		}
		// confirm(ids.length);
	}
	function addPolygon(node)
	{
		var poly = new google.maps.Polygon({
			path: node.path,
			strokeColor: "#FF0000",
			fillColor: "#FF0000",
			editable: false		
		});
		poly.setMap(map);
		google.maps.event.addListener(poly, "rightclick", function()
		{
			overlayComplete(poly);
			addTip(poly);
		});
	}
	function drawRoute(path)
	{
		var line = new google.maps.Polyline({
			path: path,
			strokeColor: "#FF0000",
			strokeOpacity: 0.7,
			strokeWeight: 2
		});
		line.setMap(map);
	}
	
	// -----------------------------------------------------------------------------------
	var temp_poly = null;
	var temp_marker1 = null;
	var temp_marker2 = null;
	var temp_info = null;
	
	this.showNode = function(path)
	{
		path = google.maps.geometry.encoding.decodePath(path);
		var poly = new google.maps.Polygon({
			path: path,
			strokeColor: "#FF0000",
			fillColor: "#FF0000",
			editable: false		
		});
		poly.setMap(map);
		if (temp_poly != null)
		{
			temp_poly.setMap(null);
			temp_info.setMap(null);
			temp_marker1.setMap(null);
			temp_marker2.setMap(null);
		}
		var bounds = new google.maps.LatLngBounds();
		// bounds.extend(path[0]);
		for(var i = 0; i < path.length; i ++)
		{
			bounds.extend(path[i]);
		}
		map.fitBounds(bounds);
		var content = "<b>Zoom:</b> " + map.getZoom() + "<br />"
					+  "<b>Center:</b> " + bounds.getCenter() + "<br />" 
					+  "<b>North East:</b> " + bounds.getNorthEast() + "<br />"
					+  "<b>South East:</b> " + bounds.getSouthWest() + "<br />";
		var info = new google.maps.InfoWindow({
			content: content,
			//map: map,
			position: path[0]
		});
		var marker1 = new google.maps.Marker({
			position: bounds.getNorthEast(),
			animation: google.maps.Animation.BOUNCE,
			map: map
		});
		var marker2 = new google.maps.Marker({
			position: bounds.getSouthWest(),
			animation: google.maps.Animation.BOUNCE,
			map: map
		});
		document.getElementById("data").innerHTML = content;
		temp_poly = poly;
		temp_marker1 = marker1;
		temp_marker2 = marker2;
		temp_info = info;		
	}	
}