function Map () {
	var map =  null;
	var drawingManager = null;
	var lines = [];
	var overlays = [];
	var matchNode = null;
	var addPlace = null;
    var nodeMode = false;
    
    var oldOverlays = [];
        
    this.enableNodeMode = function()
    {
        nodeMode = true
    }	
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
        google.maps.Map.highlight = null;
	 	google.maps.Polygon.prototype.id = null;
		google.maps.Polygon.prototype.name = null;
	 	google.maps.Polygon.prototype.tip = null;
	 	google.maps.Polygon.prototype.title = null;
	 	google.maps.Polygon.prototype.exist = null;
	 	google.maps.Polygon.prototype.del = function()
	 	{
	 		if(!this.exist)
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
				overlayComplete(polygon);
		    	setAddPlace("Add Place");
				if(nodeMode)
				{
				    hidePlaceControl();
				    overlays.push(polygon);
				    drawingManager.off();
				}
				else
				{
    	    		polygon.exist = false;
    				addTip(polygon);
    				google.maps.event.addListener(polygon.getPath() , "set_at", function(){
    					polygon.tip.setMap(null);
    					dragEvent(polygon);
    					addTip(polygon);
    				});
    		    	if(overlays.length < 2)     // note that overlays will increment after that
    				{
    					overlays.push(polygon);
    					if(overlays.length == 2)
    						drawLine(1, false);
    				}
    				else
    				{
    					matchNode = polygon;
    					hidePlaceControl();
    				}
    				drawingManager.off();
    		    	addMatchingEvent(polygon);
				}
	    	}
	    });
	}
	function overlayComplete(polygon)
	{
		google.maps.event.addListener(polygon, "rightclick", function(event){
			if(map.rightClick != null)
				map.rightClick.setMap(null);
			rightClickDelete(event.latLng, polygon);
		});
		google.maps.event.addListener(polygon, "click", function(event){
			if(map.rightClick != null)
			{
				map.rightClick.setMap(null);
				map.rightClick = null;
			}
		});
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
	function drawLine(index, dragMode){
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
		if(dragMode)
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
					if(!matchNode.exist)
					   add_child(index + 1);
				    else
				       add_selected_node(matchNode.name, matchNode.getPointString(), matchNode.id, index + 1, false); 	             
				    matchNode = null;
                    showPlaceControl();
				}
				else if(index == 0)
				{
					overlays.splice(0, 0, matchNode);
					refresh();
					if(!matchNode.exist)
                       add_child(0);
                    else
                       add_selected_node(matchNode.name, matchNode.getPointString(), matchNode.id, 0, false);
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
				
				if(!matchNode.exist)
				    add_child(index + 1);
				else
				    add_selected_node(matchNode.name, matchNode.getPointString(), matchNode.id, index + 1, false);
				matchNode = null;
				showPlaceControl();
			}
		});
	}
	function deleteOverlay(overlay)
	{
	    if(nodeMode)
	    {
	        var choice = confirm("Are you sure you want to delete this stop ?");
            if(choice)
            {
                overlays[0].setMap(null);
                overlays.splice(0, 1);
                showPlaceControl();
            }
	    }
	    else
	    {
    		var index = overlays.indexOf(overlay);
    		if(index >= 0)
    		{
    			var choice = confirm("Are you sure you want to delete stop # " + (index + 1) + " ?");
    			if(choice)
    			{
    				overlays.splice(index, 1);
    			    overlay.del();
    				if(overlays.length > 1) // leave the 2 feilds for stop1 and stop2
    					remove_child(index);
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
		overlay.tip = new CustomeOverlay(overlay.getNode(), div, false);
	}
	function addTitle(overlay)
	{
	    google.maps.event.addListener(overlay, "mousemove", function(event){
	        if(map.rightClick == null)
	        {
	            if(map.highlight != null)
	               overlay = map.highlight;
    	        if(overlay.title)
    	        {
                    overlay.title.pos = event.latLng;
                    overlay.title.redraw();    	            
    	        }
    	        else
    	        {
            	    var div = document.createElement("Div");
                    div.style.backgroundColor = "yellow";
                    div.style.color = "blue";
                    div.style.position = "absolute";
                    div.innerHTML = overlay.name;
                    div.style.width = (overlay.name.length - overlay.name.length/3) + "em";
    
                    overlay.title = new CustomeOverlay(event.latLng, div, true);
    	        }
	        }
	    });
	    google.maps.event.addListener(overlay, "mouseout", function(){
	        if(overlay.title)
	        {
    	        overlay.title.setMap(null);
    	        overlay.title = null;
	        }
        });
        google.maps.event.addListener(overlay, "rightclick", function(){
            if(overlay.title)
            {
                overlay.title.setMap(null);
                overlay.title = null;
            }
        });
	}
	this.addRightClick = function()
	{
		google.maps.Map.prototype.rightClick = null;
		
		google.maps.event.addListener(map, "rightclick", function(){
			if(map.rightClick != null)
			{
				map.rightClick.setMap(null);
				map.rightClick = null;
			}
		});
		google.maps.event.addListener(map, "click", function(){
			if(map.rightClick != null)
			{
				map.rightClick.setMap(null);
				map.rightClick = null;
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
		map.rightClick = new CustomeOverlay(pos, div, false);
	}
	function rightClickSelect(pos, overlay)
	{
		var div = document.createElement("Div");
		div.style.position = "absolute";
		var button = createButton("Select");
		button.onclick = function (){
		    if(overlays.length < 2)
		    {
                overlays.push(overlay);		        
		        if(overlays.length == 2)
                    drawLine(1, false);
                add_selected_node(overlay.name, overlay.getPointString(), overlay.id, overlays.length - 1, true);
		    }
		    else
		    {
    			matchNode = overlay;
    			hidePlaceControl();
    			drawingManager.off();
		    }
			addTip(overlay);
			addMatchingEvent(overlay);
		}
	 	div.appendChild(button);
		map.rightClick = new CustomeOverlay(pos, div, false);
	}
	function rightClickSearch(pos, overlay)
	{
	    var div = document.createElement("Div");
        div.style.position = "absolute";
        var srcButton = createButton("Select as a source");
        var destButton = createButton("Select as a destination");
        srcButton.onclick = function (){
            document.getElementById("src").value = overlay.name
        }
        destButton.onclick = function (){
            document.getElementById("dest").value = overlay.name
        }
        srcButton.style.width = "150px"
        destButton.style.width = "150px"
        
        div.appendChild(srcButton);
        div.appendChild(destButton);
        map.rightClick = new CustomeOverlay(pos, div, false);
	}
	function createButton(text)
	{
		var button = document.createElement("Button");
		button.innerHTML = text;
		button.style.border = "0px";
		button.style.background = "white";
		button.style.color = "blue";
		button.style.fontWeight = "bolder";
		button.onmouseout= function()
		{
			this.style.background = 'white'	
		}
		button.onmouseover= function()
		{
			this.style.background = '#33FFCC'	
		}
		return button;
	}
	function CustomeOverlay(pos, div, isTitle)
	{
		this.pos = pos;
		this.div = div;
		this.setMap(map);
		this.isTitle = isTitle;
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
		if(this.isTitle)
		{
		    div.style.left = point.x + 15 + "px";
            div.style.top = point.y + 15 + "px";
		}
		else
		{
    		div.style.left = point.x + "px";
    		div.style.top = point.y + "px";
		}
	}
	CustomeOverlay.prototype.redraw = function()
	{
        var projection = this.getProjection();
        var point = projection.fromLatLngToDivPixel(this.pos);
        this. div.style.left = point.x + 15 + "px";
        this.div.style.top = point.y + 15 + "px";
	}
	CustomeOverlay.prototype.onRemove = function()
	{
		this.div.parentNode.removeChild(this.div);
		this.div = null;
	}

	// ------------------------------------------- For editting Routes ---------------------
	this.editRoutes = function()
	{
		for(var i = 0; i < updatable_stops.length; i ++)
		{
			var node = updatable_stops[i].sub_route.dest;
			var poly = new google.maps.Polygon({
				path: google.maps.geometry.encoding.decodePath(node.path),
				strokeColor: "#FF0000",
				fillColor: "#FF0000",
				editable: false,
				map: map		
			});
			poly.name = node.name;
			poly.exist = true;
			overlayComplete(poly);
			addTip(poly);
			overlays.push(poly);
			addMatchingEvent(poly);
			if(i > 0)
				drawLine(i, false);
		}
	}
	
	/*
	 * ===================================== For Showing nodes 
	 *     highlight it
     *     add titles for them
	 */
	this.showNodes = function()
	{
	    oldOverlays = [];
		for(var i = 0; i < nodes.length; i ++)
		{
			var node = nodes[i].node;
			var poly = new google.maps.Polygon({
				path: google.maps.geometry.encoding.decodePath(node.path),
				strokeColor: "#000000",
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: "#FFFF33",
                fillOpacity: 0
			});
			poly.name = node.name;
			poly.id = node.id;
			poly.exist = true;
			poly.area = computeArea(poly.getPath());  // must be MVCArray
		    addNodeEvents(poly);
		    addTitle(poly);
		    
		    oldOverlays.push(poly);
		}
		
		oldOverlays.sort(function(a, b){
            return a.area < b.area
        });
        for(var i = 0; i < oldOverlays.length; i ++)
        {
            oldOverlays[i].index = i;
            oldOverlays[i].setMap(map);
        }
	}
	this.addSelectEventToNodes = function ()
	{
	    for(var i = 0; i < oldOverlays.length; i ++)
	        setNodeEvent(oldOverlays[i])
        function setNodeEvent(poly)
        {
	        google.maps.event.addListener(poly, "rightclick", function(event){
                if(map.rightClick != null)
                    map.rightClick.setMap(null);
                if(overlays.indexOf(poly) < 0)  // not selected before
                    rightClickSelect(event.latLng, poly);
                else
                    rightClickDelete(event.latLng, poly);    
            });
        }
	}
	this.addSearchEventToNodes = function ()
    {
        for(var i = 0; i < oldOverlays.length; i ++)
            setNodeEvent(oldOverlays[i])
        function setNodeEvent(poly)
        {
            google.maps.event.addListener(poly, "rightclick", function(event){
                if(map.rightClick != null)
                    map.rightClick.setMap(null);
                rightClickSearch(event.latLng, poly);
            });
        }
    }
	function addNodeEvents(poly)
	{
	    google.maps.event.addListener(poly, "click", function(){
            if(map.rightClick != null)
            {
                map.rightClick.setMap(null);
                map.rightClick = null;
            }
        });
        google.maps.event.addListener(poly, "mouseout", function(){
            if(map.highlight != null)
            {
                refreshHighlight(2);
                map.highlight = null;
            }
        });
        google.maps.event.addListener(poly, "mousemove", function(event){
            if(map.highlight != null)
            {
                refreshHighlight(2);
                map.highlight = null;
            }
            heighlight(poly, event.latLng);
        });
	}
    function heighlight(poly, point)
    {
        var index = poly.index
        var flag = false;
        for(var i =  overlays.length - 1; i > index; i --)
        {
            if(google.maps.geometry.poly.containsLocation(point, overlays[i]))
            {
                map.highlight = overlays[i]
                flag = true
                refreshHighlight(1);
                break
            }
        }
        if(!flag)
        {
            map.highlight = poly
            refreshHighlight(1);
        }
    }
    function refreshHighlight(option)    // 1 for hightlighting // 2 for returnning to originals
    {
        map.highlight.setMap(null);
        if(option == 1)
        {
            map.highlight.fillOpacity = 0.5
            map.highlight.strokeColor = "#FFFF00";
            map.highlight.strokeWeight = 3;
        }
        else
        {
            map.highlight.fillOpacity = 0;
            map.highlight.strokeColor = "#000000";
            map.highlight.strokeWeight = 1;
        }     
        map.highlight.setMap(map);            
    }
	/*
     * For computing the area
     */
    function computeArea(path)  // path is MVCArray
    {
        if(path.length < 3)
            return 0;
        // y is latitude
        // x is logitude
        // p0p1 = (x1 - x0),(y1 - y0)
         
        var area = 0;
        for(var i = 1; i < path.length - 1; i ++)
        {
            var p0pi = new google.maps.LatLng((path.getAt(i).lat() - path.getAt(0).lat()), (path.getAt(i).lng() - path.getAt(0).lng()));
            var p0pi1 = new google.maps.LatLng((path.getAt(i + 1).lat() - path.getAt(0).lat()), (path.getAt(i + 1).lng() - path.getAt(0).lng()));
            
            area += cartProduct(p0pi, p0pi1);
        }
        
        // cartesian product for p1 X p2
        // p1 X p2 = x1 * y2 - x2 * y1
        function cartProduct(p1, p2)
        {
            return p1.lng() * p2.lat() - p2.lng() * p1.lat();
        }
        return Math.abs(area) / 2.0;
    }
	// ------------------------------------------- For Showing one Node and clear it -------------------------
	this.showNode = function(name, path, isEdit)
    {
        path = google.maps.geometry.encoding.decodePath(path);
        var poly = new google.maps.Polygon({
            path: path,
            strokeColor: "#FF0000",
            fillColor: "#FF0000",
            editable: isEdit
        });
        poly.name = name;
        poly.setMap(map);
        if (overlays[0])
            overlays[0].setMap(null);
        overlays[0] = poly;
        
        var bounds = new google.maps.LatLngBounds();
        for(var i = 0; i < path.length; i ++)
            bounds.extend(path[i]);
        map.fitBounds(bounds);
        
        if(!isEdit)
            addTitle(poly);    
    }
    this.clearNode = function()
    {
        try
        {
            overlays[0].setMap(null);
        }
        catch(err){}
    } 
	// ------------------------------------------ For searching --------------------
    // var "searchNodes" is ajson object of a 2d array of subroutes
    // var "row" is the index of the required showing route 
    this.showRoute = function(row)
    {
        for(var i = 0; i < overlays.length; i ++)
            overlays[i].setMap(null);
        for(var i = 0; i < lines.length; i ++)
            lines[i].setMap(null);

        overlays = []
        lines = []
        var bounds = new google.maps.LatLngBounds();
        var path = google.maps.geometry.encoding.decodePath(searchNodes[row][0].sub_route.src.path);
        var name = searchNodes[row][0].sub_route.src.name
        overlays.push(addPolygon(path, name)); 
        fitBounds(bounds, path);
        addTip(overlays[0])
        addTitle(overlays[0]);
        for(var i = 0; i < searchNodes.length; i ++)
        {
            var path = google.maps.geometry.encoding.decodePath(searchNodes[row][i].sub_route.dest.path);
            var name = searchNodes[row][i].sub_route.dest.name
            overlays.push(addPolygon(path, name));
            fitBounds(bounds, path);
            drawLine(i+1, true);  // here i set drag_mode to prevent from adding line event
            addTip(overlays[i + 1])
            addTitle(overlays[i + 1]);
        }
        map.fitBounds(bounds);
    }
    function fitBounds(bounds, path)
    {
        for(var i = 0; i < path.length; i ++)
            bounds.extend(path[i]);
    }
    function addPolygon(path, name)
    {
        var poly = new google.maps.Polygon({
            path: path,
            strokeColor: "#707070",
            fillColor: "#707070",
            editable: false     
        });
        poly.setMap(map);
        poly.name = name
        return poly;
    }
	/*this.showMapRoutes = function ()
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
	}*/
	// -----------------------------------------------------------------------------------
	this.showDataNode = function(path)
	{
		path = google.maps.geometry.encoding.decodePath(path);
		var poly = new google.maps.Polygon({
			map: map,
			path: path,
			strokeColor: "#FF0000",
			fillColor: "#FF0000",
			editable: false		
		});
		if (map.poly != undefined)
		{
			map.poly.setMap(null);
			map.marker1.setMap(null);
			map.marker2.setMap(null);
		}
		var bounds = new google.maps.LatLngBounds();
		for(var i = 0; i < path.length; i ++)
			bounds.extend(path[i]);
		map.fitBounds(bounds);
		var content = "<b>Zoom:</b> " + map.getZoom() + "<br />"
					+  "<b>Center:</b> " + bounds.getCenter() + "<br />" 
					+  "<b>North East:</b> " + bounds.getNorthEast() + "<br />"
					+  "<b>South East:</b> " + bounds.getSouthWest() + "<br />";
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
		map.poly = poly;
		map.marker1 = marker1;
		map.marker2 = marker2;
	}	
}