// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
function setValues()
{
	var src_lng;
	var src_lat ;
	var dest_lng;
	var dest_lat;

	if(src.typeName == MARKER_TYPE)
	{
		src_lng =	src.getPosition().lng();
		src_lat = src.getPosition().lat();
	}
	else
	{
		var obj = joinArray(src.getPath());
		src_lat = obj.lat;
		src_lng = obj.lng;
	}
	if(dest.typeName == MARKER_TYPE)
	{
		dest_lng =	dest.getPosition().lng();
		dest_lat = dest.getPosition().lat();
	}
	else
	{
		var obj = joinArray(dest.getPath());
		dest_lat = obj.lat;
		dest_lng = obj.lng;
	}
	
	document.getElementById("src_lng").value = src_lng;
	document.getElementById("src_lat").value = src_lat;
	document.getElementById("dest_lng").value = dest_lng;
	document.getElementById("dest_lat").value = dest_lat;
}
function joinArray(points)
{
	var obj = new Object();
	var lat = "";
	var lng = "";
	for(var i = 0; i < points.length; i ++)
	{
		lat += points.getAt(i).lat() + ",";
		lng += points.getAt(i).lng() + ",";
	}
	obj.lat = lat;
	obj.lng = lng;
	return obj;
}
function add_street(direction)
{
	if(direction == "src"){
		// alert("src");
		var count = document.getElementById("count_src").value;
		count ++; 	
		document.getElementById("count_src").value = count;
		var table = document.getElementById("streets_src");
		var row = table.insertRow(table.rows.length);
		var cell0 = row.insertCell(0);
		var cell1 = row.insertCell(1);
	    var e = document.createElement("input");
	    e.type = "text";
	    e.size = "30";
	    e.id = "street_src";
	    e.name = "street_src"+count;
		cell1.appendChild(e);
	}else{
		// alert("dest");
		var count = document.getElementById("count_dest").value;
		count ++; 	
		document.getElementById("count_dest").value = count;
		var table = document.getElementById("streets_dest");
		var row = table.insertRow(table.rows.length);
		var cell0 = row.insertCell(0);
		var cell1 = row.insertCell(1);
	    var e = document.createElement("input");
	    e.type = "text";
	    e.size = "30";
	    e.id = "street_dest";
	    e.name = "street_dest"+count;
		cell1.appendChild(e);
	   }
}

