// Place your application-specific JavaScript functions and classes here
// This file is automatically included by javascript_include_tag :defaults
var sub_routes_ids = [];
var remove_counter = -10;
var template_1 = "route_sub_routes_attributes_index_";
var template_2 = "route_sub_routes_attributes_index_dest_attributes_";
var to_replace = new RegExp("index", "g");

// 0. 1. 2. 3. ...
function remove_child(sub_route_index){
	if(sub_route_index < sub_routes_ids.length && (sub_route_index >= 0)){
		var div_index = sub_routes_ids[sub_route_index];
		var div = $("#"+div_index);
		div.hide();
		$("#"+ template_1.replace(to_replace, div_index).replace(".", "\\.") +"_destroy").val("1");
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
		new_sub_route_id = (sub_routes_ids[0]-1)/2;		// (-1 + index)/2 => new source id
		show_time_fields(sub_routes_ids[0]);			// show the old source time fields
		sub_route_before = $("#" + sub_routes_ids[0]);	// old source element
		sub_route_before.before(sub_route_instance.replace(regexp, new_sub_route_id));
		sub_routes_ids.unshift(new_sub_route_id);
		hide_time_fields(sub_routes_ids[0]);
	}
	else{
		if(sub_route_index == sub_routes_ids.length){		// adds a new destination stop
			new_sub_route_id = sub_routes_ids[sub_route_index-1] + 1;
			sub_route_before = $("#" + sub_routes_ids[sub_route_index-1]);
			sub_route_before.after(sub_route_instance.replace(regexp, new_sub_route_id));
			sub_routes_ids.push(new_sub_route_id);
		}
		else if (sub_route_index < sub_routes_ids.length && (sub_route_index > 0)){   // adds a new inbetween stop
			new_sub_route_id = (sub_routes_ids[sub_route_index] + sub_routes_ids[sub_route_index-1])/2;
			sub_route_before = $("#" + sub_routes_ids[sub_route_index-1]);
			sub_route_before.after(sub_route_instance.replace(regexp, new_sub_route_id));
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
		$("label[for=" + template_2.replace(to_replace, sub_routes_ids[i]).replace(".", "\\.") + "name]").html("Stop " + (i+1));
	}
}

// it makes three actions => 
// first : set numbered names of initial stops
// second : changes ids of the initial children divs
// third : hides first time field of first child
function prepare_form(){
	// changes ids of sub_routes divs
	var sub_routes = $("#sub_routes #sub_route_index");
	for(var i=0; i< sub_routes.length; i++){
		sub_routes.eq(i).attr("id", i);
		sub_routes_ids.push(i);		// add the index to array of ids
	}
	// assigns numbered names of stops
	rename_stops(0);
	// hides first time field
	hide_time_fields(0)
}

// shows the time fields of the div of specified id
function show_time_fields(id){
	var element_key = template_1.replace(to_replace, id).replace(".", "\\.")+"duration";
	$("#" + element_key).show();
	$("label[for=" + element_key + "]").show();
}

// hides the time fields of the div of specified id
function hide_time_fields(id){
	var element_key = template_1.replace(to_replace, id).replace(".", "\\.")+"duration";
	$("#" + element_key).hide();
	$("label[for=" + element_key + "]").hide();
}
// isFirst attribute is set to true when it's first node or second node
function add_selected_node(name, path, id, sub_route_index, isFirst){
	if(!isFirst){
		add_child(sub_route_index);
	}
	var node_id_template = "#" + template_2.replace(to_replace, sub_routes_ids[sub_route_index]).replace(".", "\\.");
	$(node_id_template + "name").val(name);
	$(node_id_template + "path").val(path);
	$(node_id_template + "id").val(id);
}

function fillPaths() {
	var overlays = map.getOverlays();
	for(var i = 0; i < sub_routes_ids.length; i++) {
		var hidden_path_id = "#" + template_2.replace(to_replace, sub_routes_ids[i]).replace(".", "\\.") + "path";
		$(hidden_path_id).val(overlays[i].getPointString());
	}
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

function fillNodePath()
{
    var overlays = map.getOverlays();
    $("node_path").value = overlays[0].getPointString();
}

$(function() {
    $( ".auto" ).autocomplete({
        source: function( request, response ) {
            var term = request.term;
            lastXhr = $.getJSON( "/routes/nodes/districts.json", request, function( data, status, xhr ) {
                response( data );
            });
        }
    });
});