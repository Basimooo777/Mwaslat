// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
var sub_routes_ids = [];

// 0. 1. 2. 3. ...
function remove_child(sub_route_index){
	if(sub_route_index < sub_routes_ids.length && (sub_route_index >= 0)){
		$(sub_routes_ids[sub_route_index].toString()).hide();
		$("route_sub_routes_attributes_"+sub_routes_ids[sub_route_index]+"__destroy").value = "1";
		if(sub_route_index == 0){			// if first node, then hide next duration field
			sub_routes_ids.shift();
			hide_time_fields(sub_routes_ids[0]);
		}
		else{
			sub_routes_ids.splice(sub_route_index, 1);
		}
	}
	else{
		alert("Problem");
	}
	rename_stops(sub_route_index);
}

// 0. 1. 2. 3. .....
function add_child(sub_route_index){
	// "sub_route_element" is a variable set using the form builder in the .html.erb file
	var sub_route_instance = sub_route_element.toString();
	var regexp = new RegExp("sub_route_index", "g");
	var new_sub_route_id;
	var sub_route_before;
	if(sub_route_index == 0){				// adds a new source stop
		new_sub_route_id = (sub_routes_ids[0]-1)/2;
		show_time_fields(sub_routes_ids[0]);
		$("sub_routes").insert({
			top: sub_route_instance.replace(regexp, new_sub_route_id)
		});
		sub_routes_ids.unshift(new_sub_route_id);
		hide_time_fields(sub_routes_ids[0]);
	}
	else{
		if(sub_route_index == sub_routes_ids.length){		// adds a new destination stop
			new_sub_route_id = sub_routes_ids[sub_route_index-1] + 1;
			sub_route_before = $(sub_routes_ids[sub_route_index-1].toString());
			sub_route_before.insert({
				after: sub_route_instance.replace(regexp, new_sub_route_id)
			});
			sub_routes_ids.push(new_sub_route_id);
		}
		else if (sub_route_index < sub_routes_ids.length && (sub_route_index > 0)){   // adds a new inbetween stop
			new_sub_route_id = (sub_routes_ids[sub_route_index] + sub_routes_ids[sub_route_index-1])/2;
			sub_route_before = $(sub_routes_ids[sub_route_index-1].toString());
			sub_route_before.insert({
				after: sub_route_instance.replace(regexp, new_sub_route_id)
			});
			sub_routes_ids.splice(sub_route_index, 0, new_sub_route_id);
		}
		else{
			alert("Problem");
		}
	}
	rename_stops(sub_route_index);
}

function rename_stops(start) {
	for(var i=start; i < sub_routes_ids.length; i++){
		$("route_sub_routes_attributes_"+sub_routes_ids[i]+"_dest_attributes_name").previous(1).innerHTML = "Stop " + (i+1);
	}
}

// it makes three actions => first : set numbered names of first 2 stops
// second : changes ids of first 2 children divs
// third : hides first time field of first children
function prepare_form(){
	// changes ids of sub_routes divs
	var sub_routes = $("sub_routes").childElements();
	var index = 0;
	for(var i=0; i< sub_routes.length; i++){
		if(sub_routes[i].id == "sub_route_index"){
			sub_routes[i].id = index;
			sub_routes_ids.push(index);		// add the index to array of ids
			index++;
		}
	}
	// assigns numbered names of stops
	rename_stops(0);
	// hides first time field
	hide_time_fields(0)
}

// shows the time fields of the div of specified id
function show_time_fields(id){
	var to_show_field = $("route_sub_routes_attributes_"+id+"_duration");
	to_show_field.show();
	to_show_field.previous().show();
	to_show_field.previous(1).show();
	to_show_field.next().show();
}

// hides the time fields of the div of specified id
function hide_time_fields(id){
	var to_hide_field = $("route_sub_routes_attributes_"+id+"_duration");
	to_hide_field.hide();
	to_hide_field.previous(0).hide();
	to_hide_field.previous(1).hide();
	to_hide_field.next().hide();
}
// isFirst attribute is set to true when it's first node or second node
function add_selected_node(name, path, id, sub_route_index, isFirst){
	if(!isFirst){
		add_child(sub_route_index);
	}
	var node_id_template = "route_sub_routes_attributes_"+ sub_routes_ids[sub_route_index] +"_dest_attributes_";
	$(node_id_template + "name").value = name;
	$(node_id_template + "path").value = path;
	$(node_id_template + "id").value = id;
}


//remove node from my nodes
function remove_node(element,id){
	if (confirm("Are you sure ?")) { 
 		new Ajax.Request("/nodes/delete", {
      		method: 'post',
      		parameters: "id="+id,
      		onSuccess:     function(request) { 
      	    	if(request.responseText=="1"){
		    		$(element).previous("input[type=hidden]").value = "1";
					$(element).ancestors()[1].hide();
			    }else{
			    	alert ("Cannot be deleted as used by other routes");
			    }
      	 	},
      		onFailure:     function(request) { alert ("Error Contacting server");}
    	});
	}
	
}

//show node on map
function showNode(path){
	alert("Path on map");
}
