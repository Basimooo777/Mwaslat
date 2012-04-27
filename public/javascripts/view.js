var map;

function addStops() {
	map = new Map();
	map.initialize();
	map.addDrawingManager();
	map.addPlaceControl();
	map.addRightClick();
	
	map.showNodes();
	// map.showMapRoutes();
}
function showingNodes()
{
	map = new Map();
	map.initialize();
}

function editRoutes()
{
	map = new Map();
	map.initialize();
	map.addDrawingManager();
	map.addPlaceControl();
	map.addRightClick();
	map.showNodes();
	
	map.editRoutes();
}

function showPaths(){
	var overlays = map.getOverlays();
	for(var i = 0; i < overlays.length; i++) {
		confirm(overlays[i].getPointString());
	}
}
function fillPaths() {
	var overlays = map.getOverlays();
	for(var i = 0; i < sub_routes_ids.length; i++) {
		hidden_path_id = "route_sub_routes_attributes_" + sub_routes_ids[i] + "_dest_attributes_path";
		$(hidden_path_id).value = overlays[i].getPointString();
	}
}
// var counter = 2;
// var map;
// var ids = [];
// var selectNode;
// 
// 
// function initialize(isEdit) 
// {
	// var myOptions = 
    // {
  		// center: new google.maps.LatLng(31.246599,29.999199),
  		// zoom: 8,
  		// mapTypeControl: false,
		// scaleControl: true,
		// mapTypeId: google.maps.MapTypeId.ROADMAP
    // };
//     
    // map = new google.maps.Map(document.getElementById('map_canvas'),
      // myOptions);
	// google.maps.Map.prototype.drawingManager = null;
	// google.maps.Map.prototype.overlays = [];
	// google.maps.Map.prototype.lines = [];
// 	
	// google.maps.Map.prototype.selectMode = false;
	// google.maps.Map.prototype.editMode = isEdit;
	// google.maps.Map.prototype.updateMode = false;
	// google.maps.Map.prototype.addMode = !(isEdit);
// 	
	// google.maps.Marker.prototype.id = null;
	// google.maps.Marker.prototype.district = null;
	// google.maps.Marker.prototype.streets = null;
 	// google.maps.Polygon.prototype.id = null;
	// google.maps.Polygon.prototype.district = null;
 	// google.maps.Polygon.prototype.streets = null;
// 		
    // var drawingManager = new google.maps.drawing.DrawingManager(
	// {
  		// drawingMode: google.maps.drawing.OverlayType.MARKER,
		// drawingControl: true,
	  	// drawingControlOptions: 
	  	// {
	    	// position: google.maps.ControlPosition.TOP_CENTER,
	    	// drawingModes:[
    	  		// google.maps.drawing.OverlayType.MARKER,
		  		// google.maps.drawing.OverlayType.POLYGON ]
	  	// },
	  	// markerOptions: 
	  	// {
		  	// draggable: true,
			// animation: google.maps.Animation.DROP,
			// editable : true,
			// icon: 'http://www.google.com/mapfiles/dd-start.png'
			// // icon: 'http://www.google.com/mapfiles/arrow.png'
	  	// },
  		// polygonOptions: 
  		// {
  			// // strokeColor: "#ffff00",
			// // fillColor: "#ffff00",
			// editable: true
 		// }
    // });
    // drawingManager.setMap(map);
    // map.drawingManager = drawingManager;
    // google.maps.event.addListener(drawingManager, "markercomplete", function(marker)
    // {
    	// counter --;
    	// if (counter == 0){
    		// drawingManager.setMap(null);
    		// map.controls[google.maps.ControlPosition.RIGHT_TOP].removeAt(0);
    	// }
//     	
		// dragEvent(marker);
		// if(map.editMode)
		// {
			// addClickListener(marker);
			// goEditMode(marker);
		// }   
		// else
		// {
			// map.overlays.push(marker);
	    	// if(map.overlays.length > 1)
	    	// {
	    		// drawLine(map.overlays.length,false);
	    	// }
		// } 	
    // });
    // google.maps.event.addListener(drawingManager, "polygoncomplete", function(polygon)
    // {
    	// counter --;
    	// if (counter == 0){
    		// drawingManager.setMap(null);
    		// map.controls[google.maps.ControlPosition.RIGHT_TOP].removeAt(0);
    	// }
//     	
		// dragEventPolygon(polygon);
		// if(map.editMode)
		// {
// 			
			// addPolygonClickListener(polygon);
			// goEditMode(polygon);
		// }   
		// else
		// {
			// map.overlays.push(polygon);
	    	// if(map.overlays.length > 1)
	    	// {
				// drawLine(map.overlays.length,false);
	    	// }
		// }
    // });
// 	
	// selectNode = addControl("Select Node as next stop", "select");
	// google.maps.event.addDomListener(selectNode, 'click', function()
	// {
		// drawingManager.setMap(null);
// 		
		// map.controls[google.maps.ControlPosition.RIGHT_TOP].removeAt(0);
// 		
		// if(map.editMode){
			// map.selectMode = true;
		// }else{
			// map.selectMode = true;
			// var counts=map.overlays.length;
			// document.getElementById("stop"+counts+"_district").disabled=true;
			// document.getElementById("btnstreet_stop"+counts).disabled=true;
			// document.getElementById("street_stop"+counts+"1").disabled=true;
		// }
	// });
	// map.controls[google.maps.ControlPosition.RIGHT_TOP].push(selectNode);
// }
// function dragEvent(marker)
// {
	// google.maps.event.addListener(marker, "drag", function (event)
	// {
		// var index = map.overlays.indexOf(marker);
    	// if(index > 0 ){
    		// var line1 = map.lines[index - 1];
    		// line1.setMap(null);
    		// drawLine(index+1,true);
    		// }
    	// if(index+1 < map.overlays.length){
    		// var line2 = map.lines[index];
    		// line2.setMap(null);
    		// drawLine(index+2,true);
    		// }
	// });
// 
// }
// function dragEventPolygon(polygon)
// {
	// google.maps.event.addListener(polygon.getPath() , "set_at", function()
	// {
// 		
		// var index = map.overlays.indexOf(polygon);
    	// if(index > 0 ){
    		// var line1 = map.lines[index - 1];
    		// line1.setMap(null);
    		// drawLine(index+1,true);
    	// }
    	// if(index+1 < map.overlays.length){
    		// var line2 = map.lines[index];
    		// line2.setMap(null);
			// drawLine(index+2,true);
		// }
// 
	// });
// }
// function incrementStop()
// {
	// counter ++;
	// map.drawingManager.setMap(map);
	// if(map.controls[google.maps.ControlPosition.RIGHT_TOP].length == 0)
		// map.controls[google.maps.ControlPosition.RIGHT_TOP].push(selectNode);
// }
// 
// function showNode(path, id, district, streets)
// {
	// path = google.maps.geometry.encoding.decodePath(path);
	// if(path.length == 1)
	// {
		// addMarker(path[0], id, district, streets, false);
	// }
	// else
	// {
		// addPolygon(path, id, district, streets, false);
	// }	
// }
// 
// function showMapRoutes(src_str, dest_str, src_id, dest_id,src_district,dest_district,src_streets,dest_streets, isDrag)
// {
	// src_path = google.maps.geometry.encoding.decodePath(src_str);
	// dest_path = google.maps.geometry.encoding.decodePath(dest_str);	
	// var points = [];
	// if(src_path.length == 1)
	// {
		// addMarker(src_path[0], src_id,src_district,src_streets, isDrag);
		// points.push(src_path[0]);
	// }
	// else
	// {
		// addPolygon(src_path, src_id,src_district,src_streets, isDrag);
		// points.push(src_path[0]);
	// }	
	// if(dest_path.length == 1)
	// {
		// addMarker(dest_path[0], dest_id,dest_district,dest_streets, isDrag);
		// points.push(dest_path[0]);
	// }
	// else
	// {
		// addPolygon(dest_path, dest_id,dest_district,dest_streets, isDrag);
		// points.push(dest_path[0]);
	// }
	// drawRoute(points,isDrag);
// }
// 
// function addMarker(pos, id,district,streets, isDrag)
// {
	// if(ids.indexOf(id) == -1)
		// addRealMarker(pos, id,district,streets, isDrag)
// }
// //el drag elly hena dah beta3 enheya selected or no
// function addRealMarker(pos, id,district,streets, isDrag)
// {
	// ids.push(id);
	// var marker = new google.maps.Marker({
		// position: pos,
		// map: map,
		// draggable: isDrag
	// });
	// marker.setMap(map);
	// marker.id = id;
	// marker.district=district;
	// marker.streets=streets;
// 	
	// var title="<b>District : </b>"+district+"<br/><b>Streets : </b>"+streets.substr(0,streets.length-1);
// 	
	// var infoWindow = new google.maps.InfoWindow({
  		// content: title,
  		// size: new google.maps.Size(50, 50)
  	// });
// 	
	// addClickListener(isDrag,marker,infoWindow);	
// 
	// if(isDrag)
	// {
		// map.overlays.push(marker);
		// dragEvent(marker);
	// }
// }
// function addPolygon(path, id,district,streets, isDrag)
// {
	// if(ids.indexOf(id) == -1)
		// addRealPolygon(path, id,district,streets, isDrag)
// }
// function addRealPolygon(path, id,district,streets, isDrag)
// {
	// ids.push(id);
	// var poly = new google.maps.Polygon({
		// path: path,
		// strokeColor: "#FF0000",
		// fillColor: "#FF0000",
		// editable: isDrag				
	// });
	// poly.setMap(map);
	// poly.id = id;
	// poly.district=district;
	// poly.streets=streets;
// 	
	// var title="<b>District : </b>"+district+"<br/><b>Streets : </b>"+streets.substr(0,streets.length-1);
// 	
	// var infoWindow = new google.maps.InfoWindow({
  		// content: title,
  		// size: new google.maps.Size(50, 50)
  	// });
// 	
	// addPolygonClickListener(isDrag,poly,infoWindow);
  	// if(isDrag)
	// {
		// map.overlays.push(poly);
		// dragEventPolygon(poly);
	// }
// }
// 
// function drawRoute(path,isDrag)
// {
	// var line = new google.maps.Polyline({
		// path: path,
		// strokeColor: "#FF0000",
		// strokeOpacity: 0.7,
		// strokeWeight: 2
	// });
	// line.setMap(map);
	// if(isDrag){
		// map.lines.push(line);
	// }
// }
// 
// function addControl(title, text)
// {
	// var controlDiv = document.createElement("DIV"); // for the outer
	// var controlUI = document.createElement("DIV"); // for the background
	// var controlText = document.createElement("DIV"); // for the Text
// 	
	// controlDiv.style.padding = '5px';
// 
	// controlUI.style.backgroundColor = 'white';
	// controlUI.style.borderStyle = 'solid';
	// controlUI.style.borderWidth = '2px';
	// controlUI.style.cursor = 'pointer';
	// controlUI.style.textAlign = 'center';
	// controlUI.title = title;
	// controlDiv.appendChild(controlUI);
// 
	// controlText.style.fontFamily = 'Arial,sans-serif';
	// controlText.style.fontSize = '12px';
	// controlText.style.paddingLeft = '4px';
	// controlText.style.paddingRight = '4px';
	// controlText.style.color = "blue";
	// controlText.innerHTML = text;
	// controlUI.appendChild(controlText);
// 
	// return controlDiv;
// }
// 
// function drawLine(len,isDrag)
// {
	// if(len > 1)
	// {
		// var path = [];
		// try
		// {
			// path.push(map.overlays[len - 2].getPosition());
		// }
		// catch(err)
		// {
			// path.push(map.overlays[len - 2].getPath().getAt(0));
		// }
		// try
		// {
			// path.push(map.overlays[len - 1].getPosition());
		// }
		// catch(err)
		// {
			// path.push(map.overlays[len - 1].getPath().getAt(0));
		// }
		// var line = new google.maps.Polyline({
			// path: path,
			// strokeColor: "#0000FF",
			// strokeOpacity: 0.7,
			// strokeWeight: 2
		// });
		// line.setMap(map);
		// if(isDrag)
			// map.lines[len - 2] = line;
		// else
			// map.lines.push(line);
	// }
// }
// 
// function goEditMode(overlay)
// {
	// map.overlays[0].setMap(null);
	// try
	// {
// 		
		// map.overlays[0].icon = 	'http://www.google.com/mapfiles/dd-start.png';
	// }
	// catch(e)
	// {
		// map.overlays[0].strokeColor = "#ffff00";
		// map.overlays[0].fillColor = "#000000";
	// }
	// map.overlays[0].setMap(map);
	// map.overlays[map.overlays.length - 1].setMap(null);
	// try
	// {
		// map.overlays[map.overlays.length - 1].icon = 	'http://www.google.com/mapfiles/dd-start.png';
	// }
	// catch(e)
	// {
		// map.overlays[map.overlays.length - 1].strokeColor = "#ffff00";
		// map.overlays[map.overlays.length - 1].fillColor = "#000000";
	// }
	// map.overlays[map.overlays.length - 1].setMap(map);
	// map.editMode = true;
	// map.overlays.push(overlay);
	// alert(map.overlays.length);
// }
// 
// function addClickListener(isDrag,marker,infoWindow){
	// google.maps.event.addListener(marker, 'click', function()
  	// {
  		// if(map.selectMode)
  		// {
  			// marker.setMap(null);
			// marker.icon = "http://www.google.com/mapfiles/dd-start.png";
			// marker.setMap(map);
			// counter --;
			// map.selectMode = false;
			// if (counter >0){
	    		// map.drawingManager.setMap(map);
				// map.controls[google.maps.ControlPosition.RIGHT_TOP].push(selectNode);	
    		// }
    		// if(isDrag || map.addMode)
    		// {
	    		// map.overlays.push(marker);
		    	// if(map.overlays.length > 1)
		    	// {
		    		// drawLine(map.overlays.length,false);
		    	// }
    		// }
    		// else
	    	// {
				// goEditMode(marker);
	    	// }
// 	    	
			// var counts = map.overlays.length - 1;
// 
	    	// fillStopData(counts,marker.streets,marker.district,true,false);
// 			
  		// }
  		// else if(map.editMode)
  		// {
  			// if(map.overlays.indexOf(marker) == 0)
			// { 
				// map.editMode = false;
				// for (var i = 0; i <map.overlays.length - 1; i ++)
				// {
				   // map.overlays.push(map.overlays.shift());
				// }
				// for (var i = 0; i <map.lines.length; i ++)
				// {
					// map.lines[i].setMap(null);
				// }
				// for (var i = 1; i <= map.overlays.length ; i ++)
				// {
					// drawLine(i,true);
				// }
			// }
			// else if(map.overlays.indexOf(marker) == map.overlays.length - 2)
			// {
				// map.editMode = false;
				// for (var i = 0; i <map.lines.length; i ++)
				// {
					// map.lines[i].setMap(null);
				// }
				// for (var i = 1; i <= map.overlays.length ; i ++)
				// {
					// drawLine(i,true);
				// }
			// }  	
  		// }
  		// else
  		// {
  			// infoWindow.open(map, marker);
		// }
  	// });
// 
// }
// 
// function addPolygonClickListener (poly,infoWindow) {
  // google.maps.event.addListener(poly, 'click', function(event)
  	// {
  		// if(map.updateMode)
  		// {
  			// poly.setMap(null);
			// poly.fillColor = "#FFFF00";
			// poly.strokeColor = "#000000"
			// poly.setMap(map);
			// counter --;
			// map.selectMode = false;
			// if (counter >0){
	    		// map.drawingManager.setMap(map);
				// map.controls[google.maps.ControlPosition.RIGHT_TOP].push(selectNode);	
    		// }
	    	// if(map.editMode)
    		// {
	    		// map.overlays.push(marker);
		    	// if(map.overlays.length > 1)
		    	// {
		    		// drawLine(map.overlays.length,false);
		    	// }
    		// }
    		// else
	    	// {
				// goEditMode(poly);
	    	// }
			// var counts = map.overlays.length - 1;
// 
	    	// fillStopData(counts,poly.streets,poly.district,true,false);
// 			
// 	
  		// }else if(map.editMode)
  		// {
  			// if(map.overlays.indexOf(poly) == 0)
			// {
				// map.editMode = false;
				// for (var i = 0; i <map.overlays.length - 1; i ++)
				// {
				   // map.overlays.push(map.overlays.shift());
				// }
				// for (var i = 0; i <map.lines.length; i ++)
				// {
					// map.lines[i].setMap(null);
				// }
				// for (var i = 1; i <= map.overlays.length ; i ++)
				// {
					// drawLine(i,true);
				// }
			// }
			// else if(map.overlays.indexOf(poly) == map.overlays.length - 2)
			// {
				// map.editMode = false;
				// for (var i = 0; i <map.lines.length; i ++)
				// {
					// map.lines[i].setMap(null);
				// }
				// for (var i = 1; i <= map.overlays.length ; i ++)
				// {
					// drawLine(i,true);
				// }
			// }  	
  		// }
  		// else
  		// {
			// infoWindow.setPosition(event.latLng);
			// infoWindow.open(map);
		// }
  	// });
// }
// function addMapStop(){
	// //map.drawingManager.setMap(map);
	// //map.controls[google.maps.ControlPosition.RIGHT_TOP].push(selectNode);
// 	
// }