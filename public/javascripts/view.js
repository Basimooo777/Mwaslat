var map;

function addStops() {
	map = new Map();
	map.initialize();
	map.addDrawingManager();
	map.addPlaceControl();
	map.addRightClick();
	
	map.showNodes();
	map.addSelectEventToNodes();
}
function editRoutes()
{
	map = new Map();
	map.initialize();
	map.addDrawingManager();
	map.addPlaceControl();
	map.addRightClick();
	map.showNodes();
	map.addSelectEventToNodes();
	map.editRoutes();
}
function showingNodes()
{
	map = new Map();
    map.initialize();
    map.enableNodeMode();
    map.addDrawingManager();
    map.addPlaceControl();
    map.addRightClick();
}
function editNode()
{
    map = new Map();
    map.initialize();
    map.showNode(document.getElementById("node_name").value, document.getElementById("node_path").value, true);
} 
function showNode()
{
    map = new Map();
    map.initialize();

// $('#hasmap').equalHeights();
// $('#hasmap').equalWidths();
}
function search()
{
    map = new Map();
    map.initialize();
    map.showNodes();
    map.addRightClick();
    map.addSearchEventToNodes();
}
