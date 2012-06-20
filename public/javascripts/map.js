function Map () {
	var map =  null;     // for google maps
	var drawingManager = null;     // for the drawing the new polygons
	var lines = [];    // array of all lines in the new route
	var overlays = [];     // for the overlays that used for the route
	var matchNode = null;    // for new node that its position not added 
	var addPlace = null;       // the button AddPlace and Cancel
    var nodeMode = false;       // differ between the adding route mode and adding node mode        
    
    var oldOverlays = [];       // the exists areas in our system 
    
	/*
	 * initailize google map and puts the map in DIV(#map_canvas)
	 * adding some new properyties for "Map" obj. like
	 *     highlight  => the overlay that is highlighted when mouse over
	 * adding some new properyties for "Polygon" obj. like
	 *     id      => id for the existing overlay in the system
	 *     name    => name for the existing overlay in the system
	 *     tip     => tip for the order of positions for overlays in the routes eg. 1,2,3,...   
	 *     title   => title show name for the existing overlay in the system when mouse over
	 *     exist   => check if the overlay is from the old or new overlays
	 *     function del => delete the overlay with its tip
	 *     function getNode => return the first node from the path of polygon using it to draw
	 *         the route from it
	 *     function getPointString => return the array of path as encoded string     
	 */
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
	 	google.maps.Polygon.prototype.isSelected = false;
	 	google.maps.Polygon.prototype.del = function()
	 	{
 			if(this.exist)
 			{
 			    this.isSelected = false
		        this.fillOpacity = 0;
                this.strokeColor = "#000000";
                this.strokeWeight = 1;
 			    this.setMap(map);   
 			}
     	    try{
    	 		this.tip.setMap(null);
     	    }
     	    catch(err){}
	 	}
	 	google.maps.Polygon.prototype.getNode = function(){
			return this.getPath().getAt(0);
		}
		google.maps.Polygon.prototype.getPointString = function()
	 	{
	 		return google.maps.geometry.encoding.encodePath(this.getPath());	
	 	}
	}
	/*
     * default mode is adding routes
     * so this function enable the node mode
     */    
    this.enableNodeMode = function()
    {
        nodeMode = true
    }   
    /*
     * return the array of overlays that used in the route
     */
	this.getOverlays = function()
	{
		return overlays;	
	}
 	/*
 	 * adding drawing manager for drawing the polygons
 	 * is used when 
 	 *    1- adding new route
 	 *    2- adding new node
 	 * adding some new prototypes for the "DrawingManager" obj.
 	 *    function on => activate the drawing manager to draw
 	 *    function off => deactivate the drawing manager to draw   
 	 */
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
				editable: true
	 		},
	 		map: map
	    });
	    /*
	     * this event "polygoncomplete"
	     * check if the user press cancel
	     * check if the adding in node mode or route node
	     * adding some events for completed polygon
	     */
	    google.maps.event.addListener(drawingManager, "polygoncomplete", function(polygon)
	    {
	    	if(getAddPlace() == "Add Place")     // after pressing cancel button
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
    				addTip(polygon, overlays.length + 1);
    				google.maps.event.addListener(polygon.getPath() , "set_at", function(){
    					polygon.tip.setMap(null);
    					dragEvent(polygon);
    					addTip(polygon, overlays.indexOf(polygon) + 1);
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
	/*
	 * adding some events to remove the right click div  when click or right click on over the map
	 */
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
    /*
     * used to add "Add Place" button and its events
     */
	this.addPlaceControl = function()
	{
		addPlace = addControl("adding new place", "Add Place");
		google.maps.event.addDomListener(addPlace, 'click', function()
		{
			if(getAddPlace() == "Add Place")
			{
				setAddPlace("Cancel");
				drawingManager.on();        // activate the drawing mode
			}
			else
			{
				setAddPlace("Add Place");
				drawingManager.off();       // deactivate the drawing mode
			}
		});
		showPlaceControl();
	}
    /*
     * show the Adding place button after overlay is completed
     */
	function showPlaceControl()
	{
		map.controls[google.maps.ControlPosition.TOP_RIGHT].push(addPlace);
	}
    /*
     * hide the adding place button after pressing it to be free in drawing polygons
     */	
    function hidePlaceControl()
	{
		map.controls[google.maps.ControlPosition.TOP_RIGHT].removeAt(0);
	}
	/*
	 * is used to set the text of the top right button (Add place, Cancel)
	 */
	function setAddPlace(text)
	{
		addPlace.firstChild.firstChild.innerHTML = text;
	}
	/*
	 * is used to get the text of the top right button
	 */
    function getAddPlace()
	{
		return addPlace.firstChild.firstChild.innerHTML;
	}
	/*
	 * is a generic function is used for adding control to the map
	 * @param(title) is the title when mouse over the control
	 * @param(text) is the text displayed on the control
	 * in future we will provie it with nice CSS
	 */
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
	/*
	 * draw line between two overlay with index and index-1 
	 * @param(index) is the index of the seconde overlay
	 * @param(dragMod) is a boolean to check if it is a new line or existing line but dragged
	 */
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
    /*
     * is the drag event for the overlay
     * when its first point that used to draw route dragged
     * it make the left and right lines to be dragging with it
     * @param(overlay) is the overlay that its point is dragged
     */	
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
	/*
	 * this event for adding the new node to the first or last of the route
	 * after clicking on the first or last node 
	 *      1- matching line between the first node or last node with new node
     *      2- add new fields in the form
	 *      3- check if it is a new node or selected node to fill its fields with data
	 * @param(overlay) is the overlay in the new route that user want to match between it
	 *     and the new node
	 */
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
	/*
	 * event when clicking the line between 2 overlays in the new route and 
	 *     wanted to put the new added overlay between them
	 * @param(line) is the line wanted to add click event for it   
	 */
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
	/*
	 * delete the overlay from the new route
	 * @param(overlay) is the overlay wanted to delete
	 */
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
	/*
	 * this method used redraw lines and nodes with their new tips of order
	 * is called after added new overlay to the route
	 */
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
			overlays[i].tip.setMap(null);
			addTip(overlays[i], i + 1);
			overlays[i].setMap(map);
			if(i > 0)
				drawLine(i, false);
		}
	}
	/*
	 * create tip of order(1, 2, 3, ..) for the overlay added in the route
	 */
    function addTip(overlay, tip)
	{
		var div = document.createElement("Div");
		div.style.backgroundColor = "yellow";
		div.style.color = "blue";
		div.style.position = "absolute";
		
		div.innerHTML = tip + " ";
		overlay.tip = new CustomeOverlay(overlay.getNode(), div, false);
	}
	/*
	 * add animated title for the overlay (is the name of existing node)
	 * or showing it if it has a title
	 */
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
	/*
	 * add right click component to the map
	 */
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
	/*
	 * add "right click delete" to the overlay to delete the overlay from the  route
	 * @param(overlay) the "right click" menu on it
	 * @param(pos) the positon of the event for "right click" on the overlay
	 */
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
    /*
     * add "right click" for the existing overlays to select the overlay for the route
     * @param(overlay) the "right click" menu on it
     * @param(pos) the positon of the event for "right click" on the overlay
     */
    function rightClickSelect(pos, overlay)
	{
		var div = document.createElement("Div");
		div.style.position = "absolute";
		var button = createButton("Select");
		button.onclick = function (){
		    tip = 0
		    if(overlays.length < 2)
		    {
                overlays.push(overlay);
		        if(overlays.length == 2)
                    drawLine(1, false);
                add_selected_node(overlay.name, overlay.getPointString(), overlay.id, overlays.length - 1, true);
                
                tip = overlays.length;
		    }
		    else
		    {
    			matchNode = overlay;
    			hidePlaceControl();
    			drawingManager.off();
    			
    			tip = overlays.length + 1;
		    }
			addTip(overlay, tip);
			addMatchingEvent(overlay);
			
			// change the color of the selected node
			// confirm("done1");
			overlay.isSelected = true
			overlay.setMap(null)
            overlay.strokeColor = "#000000";
            overlay.fillColor = "#000000";
			overlay.fillOpacity = 0.2;
            overlay.strokeWeight = 3;
			overlay.setMap(map);
			// confirm("done2")
			map.rightClick.setMap(null);
			map.rightClick = null;
			map.highlight = null;
		}
	 	div.appendChild(button);
		map.rightClick = new CustomeOverlay(pos, div, false);
	}
	/*
     * add "right click" for the existing overlays to allow the user to select 
     *  the source or the desitnation from the map 
     * @param(overlay) the "right click" menu on it
     * @param(pos) the positon of the event for "right click" on the overlay
     */
    function rightClickSearch(pos, overlay)
	{
	    var div = document.createElement("Div");
        div.style.position = "absolute";
        div.style.backgroundColor = "white";
        var srcButton = createButton("Select as a source");
        var destButton = createButton("Select as a destination");
        srcButton.onclick = function (){
            document.getElementById("src").value = overlay.name
        }
        destButton.onclick = function (){
            document.getElementById("dest").value = overlay.name
        }
        srcButton.style.width = "200px";
        srcButton.style.textAlign = "left";
        destButton.style.width = "200px";
        destButton.style.textAlign = "left";
        
        div.appendChild(srcButton);
        div.appendChild(destButton);
        map.rightClick = new CustomeOverlay(pos, div, false);
	}
	/*
	 * create a button with some CSS
	 * @return the button
	 */
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
	/*
	 * careate custome overlays like tips and titles 
	 * @param(pos) position of the overlay
	 * @param(div) the div that will used as overlay
	 * @param(isTitle) to differ between the title and tip
	 */
    function CustomeOverlay(pos, div, isTitle)
	{
		this.pos = pos;
		this.div = div;
		this.setMap(map);
		this.isTitle = isTitle;
	}
	// inherit it from OverlayView
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
	/*
	 * "updatable_stops" is an array of the sub routes of the route that wanted
	 *     to be updated
	 */
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
			addTip(poly, i+1);
			overlays.push(poly);
			addMatchingEvent(poly);
			if(i > 0)
				drawLine(i, false);
		}
	}
	/*
	 * For Showing nodes 
	 *     highlight it
     *     add titles for them
     * "nodes" arrays of nodes
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
	/*
	 * add "right click" events for existing overlays that may be 
	 *     select menu
	 *     delete menu
	 */
	this.addSelectEventToNodes = function ()
	{
	    for(var i = 0; i < oldOverlays.length; i ++)
	        setNodeEvent(oldOverlays[i])
        function setNodeEvent(poly)
        {
	        google.maps.event.addListener(poly, "rightclick", function(event){
                if(map.rightClick != null)
                    map.rightClick.setMap(null);
                if(!poly.isSelected)  // not selected before
                {
                    if (matchNode == null)
                        rightClickSelect(event.latLng, poly);
                }
                else
                    rightClickDelete(event.latLng, poly);    
            });
        }
	}
	/*
	 * add "right click" events for existing overlays "for the search page" search menu 
	 */
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
	/*
	 * add some events for old overlays for highlighting
	 */
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
            if(map.highlight != null && !poly.isSelected)
            {
                refreshHighlight(2);
                map.highlight = null;
            }
        });
        google.maps.event.addListener(poly, "mousemove", function(event){
            if(!poly.isSelected)
            {
                if(map.highlight != null)
                {
                    refreshHighlight(2);
                    map.highlight = null;
                }
                heighlight(poly, event.latLng);
            }
        });
	}
    /*
     * @param(poly) is the overlay that the event occurs
     * @param(point) is the point on the overlay at which the event occurs
     * find the smallest area that has this point and highlight it 
     */
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
    // var "searchFlags" is an array of what is the real stops  
    // @param(row) is the index of the required showing route 
    this.showRoute = function(row)
    {
        for(var i = 0; i < overlays.length; i ++)
            overlays[i].del();
        for(var i = 0; i < lines.length; i ++)
            lines[i].setMap(null);

        overlays = []
        lines = []
        var bounds = new google.maps.LatLngBounds();
        var path = google.maps.geometry.encoding.decodePath(searchNodes[row][0].sub_route.src.path);
        var name = searchNodes[row][0].sub_route.src.name
        overlays.push(addPolygon(path, name)); 
        fitBounds(bounds, path);
        addTip(overlays[0], 1)
        addTitle(overlays[0]);
        
        counter = 2;
        for(var i = 0; i < searchNodes[row].length; i ++)
        {
            var path = google.maps.geometry.encoding.decodePath(searchNodes[row][i].sub_route.dest.path);
            var name = searchNodes[row][i].sub_route.dest.name
            overlays.push(addPolygon(path, name));
            fitBounds(bounds, path);
            drawLine(i+1, true);  // here i set drag_mode to prevent from adding line event
            addTitle(overlays[i + 1]);
            
            if(searchFlags[row][i][1])
            {
                addTip(overlays[i + 1], counter);
                counter ++;
            }
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