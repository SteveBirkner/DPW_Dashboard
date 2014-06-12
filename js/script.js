/*jslint browser: true*/
/*global ismobile*/
(function()
{
	"use strict";

	function queryLayer(map, evt)
	{
        
            var xhr = new XMLHttpRequest(),
                json;
            xhr.open('POST', 'php/identifylayers.php', false);
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");		
            xhr.send("json=" + JSON.stringify(evt.mapPoint) + "&extent=" + JSON.stringify(map.extent));
            if(xhr.readyState === 4 && xhr.status === 200)
            {
                if(xhr.responseText !== "")
                {
                    json = JSON.parse(xhr.responseText);
                    console.log(json);
                    if (json['layer'] == "Catchbasin") {
                    	basinPopInfo(map,evt,json);
                    } else if (json['layer'] == "Storm Water Manhole") {
                    	swManholeInfo(map,evt,json);
                    } else if (json['layer'] == "Outfall") {
                    	outfallInfo(map,evt,json);
                    }
                    
                   	                 
                }
            }
        
	}
    function outfallInfo(map,evt,json) {
    	var popup = map.infoWindow,
    		ownedBy = (json['ownedBy'] != "") ? json['ownedBy'] : "",
    		muni = (json['muni'] != "Null") ? json['muni'] : "",
    		locDesc = (json['locDesc'] != "Null") ? json['locDesc'] : "",
    		material = (json['material'] != "Null") ? json['material'] : "",
    		recWater = (json['recWater'] != "Null") ? json['recWater'] : "",
    		comments = (json['comments'] != "Null") ? json['comments'] : "";
    	var dia = (json['dia'] != "Null") ? Number(json['dia']) : -1;
     	if (dia != -1) {
     		var diaFt = Math.floor(dia);
     		var diaIn = ((dia - diaFt) * 12).toFixed(0);
     	} else {
     		var diaFt = 0;
     		var diaIn = 0;
     	} 
	    var	outAttr = '<div style="height: 5px"></div>' +
							'<form action="php/outfall.php" method="post" target="_blank">' +
								'<input type="hidden" name="oid" value="'+ json["oid"] +'" >' +
								'<input type="hidden" name="time" value="null"><b>Outfall #:   </b>' +
								'<button><div class="outfallID">' + json["oid"] + '</div></button>' +
							'</form><div style="height: 5px"></div>' +
							'<form action="" onsubmit="return postOutfall()" method="post">' +
								'<input type="hidden" name="oid" value="'+ json["oid"] +'" >' +
								'<label for="OwnedBy">Owned By:  ' +
									'<select name="OwnedBy" id="OwnedBy">' +
										'<option value=""></option>'+
										'<option value="Municipality">Municipality</option>'+
										'<option value="County">County</option>'+
										'<option value="State">State</option>'+
										'<option value="Private">Private</option>'+
									'</select>'+
								'</label>' +
								'<label for="address">Municipality:  ' +
									'<input type="text" name="municipality" id="muni" value="'+ muni +'" autocomplete="off" style="width: 250px">' +
								'</label>' +
								'<label for="address">Location Description:  ' +
									'<input type="text" name="locDesc" id="locDesc" value="'+ locDesc +'" autocomplete="off" style="width: 250px">' +
								'</label>' +
								'<label for="address">Material:  ' +
									'<select name="Material" id="Material">' +
										'<option value=""></option>'+
										'<option value="Asbestos Concrete Pipe">Asbestos Concrete Pipe</option>'+
										'<option value="Cast Iron Pipe">Cast Iron Pipe</option>'+
										'<option value="Ductile Iron Pipe">Ductile Iron Pipe</option>'+
										'<option value="Reinforced Concrete Pipe">Reinforced Concrete Pipe</option>'+
										'<option value="Vitrified Clay Pipe">Vitrified Clay Pipe</option>'+
										'<option value="Unknown">Unknown</option>'+
										'<option value="Other">Other</option>'+
										'<option value="Polyvinyl Chloride">Polyvinyl Chloride</option>'+
										'<option value="High Density Polyethylene Pipe">High Density Polyethylene Pipe</option>'+
										'<option value="Corrugated Metal Pipe">Corrugated Metal Pipe</option>'+
										'<option value="Concrete Pipe">Concrete Pipe</option>'+
										'<option value="Concrete Cylinder Pipe">Concrete Cylinder Pipe</option>'+
										'<option value="Elliptical Corrugated Metal Pipe">Elliptical Corrugated Metal Pipe</option>'+
									'</select>'+
								'</label>' + 
								'<label for="address">Receiving Water:  ' +
									'<input type="text" name="recWater" id="recWater" value="'+ recWater +'" autocomplete="off" style="width: 250px">' +
								'</label>' +
								'<label>Diameter: ' +
							 		'<input type="text" name="diaFt" id="diaFt" style="width: 50px;" value="'+diaFt+'"> (ft) ' + 
							 		'<input type="text" name="diaIn" id="diaIn" style="width: 50px;" value="'+diaIn+'"> (in)' +
							 	'</label>' + 
							 	'<label>Comments: <br>' +
							 		'<textarea name="Comments" id="Comments" cols="30" rows="10" style="height: 75px;">'+comments+'</textarea>' +
							 	'</label><br>' + 
							 	'<input type="submit" value="Submit">' +
							'</form>',

	    	outOpLog = '<iframe style="display:none;" src="" name="myiframe"></iframe>' +
						'<div style="height: 5px"></div>' +
						'<form action="php/outfall.php" method="post" target="_blank">' +
							'<input type="hidden" name="oid" value="'+ json["oid"] +'" >' +
							'<input type="hidden" name="time" value="null">' +
							'<b>Outfall #:   </b>' +
							'<button><div class="outfallID">' + json["oid"] + '</div></button>' +
						'</form>' +
						'<div style="height: 5px"></div>' + 
						'<form action="php/processimage.php" method="post" onsubmit="return postOutOpLog()" enctype="multipart/form-data" target="myiframe">' +
							'<input type="hidden" name="oid" value="'+ json["oid"] +'" >' +
							'<label for="response_type">Response Type: ' +
								'<select name="response_type" id="responseType">' +
									'<option value="Routine Maintenance">Routine Maintenance</option>' +
									'<option value="Repair">Repair</option><option value="Emergency Response/Recovery">Emergency Response/Recovery</option>' +
								'</select>' +
							'</label>' +
							'<label for="derisCol">Debris Collected (ft&sup3;): <input type="text" name="debrisCol" id="debrisCol"></label>' +
							'<label for="responseNotes">Response Notes: <br>' +
								'<textarea name="responseNotes" id="respoNote" cols="30" rows="10" style="height: 150px;"></textarea>' +
							'</label>' +
							'<label for="photo">Photo:  ' + 
								'<input type="file" name="image" id="image">' +
							'</label>' +
							'<input type="submit" value="Submit">' +
						'</form>',


	    	tabPane = '<div class="tab-content"><div class="tab-pane active" id="manhole">'+outAttr+'</div><div class="tab-pane" id="swOpLog">'+outOpLog+'</div></div>',
			tabs = '<ul class="nav nav-tabs"><li class="active" ><a href="#manhole" data-toggle="tab">Attributes</a></li><li><a href="#swOpLog" data-toggle="tab">Operations Log</a></li></ul>',
			cont = '<div id="cont" class="tabbable maincon" style="width: 350px; height=350px;">' + tabs + tabPane + '</div>';
    	if(!ismobile) {
         	popup.setTitle("Selected Outfall");
         	popup.setContent(cont);
	        popup.resize(390,550);
	        popup.show(evt.mapPoint);
	        

         } else {
         	console.log("mobile");
         	$("#popcon").html(cont);
         	$("#selTitle").html("Selected Catchbasin");
         	var pop = document.getElementById("pop");
          	pop.style.visibility='visible';

         }
        var sel = document.getElementById('OwnedBy');
        var opts = sel.options;
        for(var opt, j = 0; opt = opts[j]; j++) {
          	if (opt.value == ownedBy) {
          		sel.selectedIndex = j;
          		break;
          	}
        }
        sel = document.getElementById('Material');
        opts = sel.options;
        for(var opt, j = 0; opt = opts[j]; j++) {
          	if (opt.value == material) {
          		sel.selectedIndex = j;
          		break;
          	}
        }

    }
    function basinPopInfo(map,evt,json) {
    	 var popup = map.infoWindow;
    	 var address = (json['address'] != null) ? json['address'] : "";
    	 var length = (json['length'] != null) ? json['length'] : 0;
         var width = (json['width'] != null) ? json['width'] : 0;
         var depth = (json['depth'] != null) ? json['depth'] : 0;
         var size = (json['size'] != null) ? json['size'] : 0;
         var line_size = Number(json['line_size']);
         if (line_size != "") {
         	var line_sizeFt = Math.floor(line_size);
         	var line_sizeIn = ((line_size - line_sizeFt) * 12).toFixed(0);
         } else {
         	var line_sizeFt = 0;
         	var line_sizeIn = 0;
         }
         var drains = json['drains_to'];
         var select = '<select name="drainsTo" id="drainsTo"><option value=""></option> +<option value="Ackerman\'s Creek">Ackerman\'s Creek</option><option value="Bellman\'s Creek">Bellman\'s Creek</option><option value="Berry\'s Creek">Berry\'s Creek</option><option value="Berry\'s Creek Canal">Berry\'s Creek Canal</option><option value="Cromakill Creek">Cromakill Creek</option><option value="East Riser Ditch">East Riser Ditch</option><option value="Frank\'s Creek">Frank\'s Creek</option><option value="Hackensack River">Hackensack River</option><option value="Hudson River">Hudson River</option><option value="Kingsland Creek">Kingsland Creek</option><option value="Losen Slote Creek">Losen Slote Creek</option><option value="Mary Ann Creek">Mary Ann Creek</option><option value="Moonachie Creek">Moonachie Creek</option><option value="Nevertouch Creek">Nevertouch Creek</option><option value="Overpeck Creek">Overpeck Creek</option><option value="Passaic River">Passaic River</option><option value="Paunpeck Creek">Paunpeck Creek</option><option value="Peach Island Creek">Peach Island Creek</option><option value="Penhorn Creek">Penhorn Creek</option><option value="Walden Swamp Creek">Walden Swamp Creek</option><option value="West River Ditch">West River Ditch</option><option value="Wolf\'s Creek">Wolf\'s Creek</option></select>';
         var condition = json['condition'];
         var ownedBy = (json['ownedBy'] != null) ? json['ownedBy'] : "",
         	muni = (json['muni'] != null) ? json['muni'] : "",
         	locDesc = json['locDesc'],
         	cbType = json['CBType'];
         var rimEl = Number(json['rimEl']);
         if (rimEl != "") {
         	var rimElFt = Math.floor(rimEl);
         	var rimElIn = ((rimEl - rimElFt) * 12).toFixed(0);
         } else {
         	var rimElFt = 0;
         	var rimElIn = 0;
         }
         var accDia = Number(json['accDia']);
         if (accDia != "") {
         	var accDiaFt = Math.floor(accDia);
         	var accDiaIn = ((accDia - accDiaFt) * 12).toFixed(0);
         } else {
         	var accDiaFt = 0;
         	var accDiaIn = 0;
         }
         var accMat = (json['accMat'] != null) ? json['accMat'] : "";
         var accType = (json['accType'] != null) ? json['accType'] : "";
         var inverEl = Number(json['inverEl']);
         if (inverEl != "") {
         	var inverElFt = Math.floor(inverEl);
         	var inverElIn = ((inverEl - inverElFt) * 12).toFixed(0);
         } else {
         	var inverElFt = 0;
         	var inverElIn = 0;
         }
         var comments = json['comments'];

         var basin = '<div style="height: 5px"></div>' +
						'<form action="php/basin.php" method="post" target="_blank">' +
							'<input type="hidden" name="bid" value="'+ json["basin#"] +'" >' +
							'<input type="hidden" name="time" value="null"><b>Basin #:   </b>' +
							'<button><div class="basinID">' + json["basin#"] + '</div></button>' +
						'</form><div style="height: 5px"></div>' + 
						'<form action="" onsubmit="return postBasin()" method="post">' +
						 	'<input type="hidden" name="bid" value="'+ json["basin#"] +'" >' +
						 	'<label for="address">Address:  ' +
								'<input type="text" name="address" id="address" value="'+ address +'" autocomplete="off" style="width: 250px">' +
							'</label>' +
						 	'<label for="length">Length (ft): ' +
						 		'<input class="target" type="text" name="length" id="length" value="'+ length +'" autocomplete="off">' +
						 	'</label>' +
						 	'<label for="width">Width (ft): ' +
						 		'<input class="taret" type="text" name="width" id="width"  value="'+ width +'" autocomplete="off">' +
						 	'</label>' +
						 	'<label for="depth">Depth (ft): ' + 
						 		'<input class="target" type="text" name="depth" id="depth"  value="'+ depth +'" autocomplete="off"></label>' +
						 	'<label for="cube">Cubic Feet: <button type="button" onClick="cubicCalc()" id="gen">Generate</button>' +
						 		'<div style="margin-bottom: 10px;"></div>' +
						 		'<input type="text" name="cube" id="cube" disabled  value="'+ size +'" autocomplete="off">'+
						 	'</label>' +
						 	'<label for="lineSize">Line Size Connection: ' +
						 		'<input type="text" name="lineSizeFt" id="lineSizeFt" style="width: 50px;"  value="'+ line_sizeFt +'" autocomplete="off"> (ft) ' +
						 		'<input type="text" name="lineSizeIn" id="lineSizeIn" style="width: 50px;"  value="'+ line_sizeIn +'" autocomplete="off"> (in) ' +
						 	'</label>' +
						 	'<label for="drainsTo">Drains To: '+ select +'</label><br>' + 
						 	'<label> Condition: ' +
									'<select name="condition" id="condition">' +
									'<option value=""></option>' +
									'<option value="Good">Good</option>' +
									'<option value="Poor">Poor</option>' +
									'<option value="Needs Maintenance">Needs Maintenance</option>' +
								'</select>' +
							'</label><br><br>' +
						 	'<button type="button" id="addInfo">Addtional Atrributes <span class="glyphicon glyphicon-plus-sign"></span></button><br><p id="testTog" style="display: none">' + 
						 	'<br><label>Owned By: ' +
						 		'<select name="OwnedBy" id="OwnedBy">' +
									'<option value=""></option>'+
									'<option value="Municipality">Municipality</option>'+
									'<option value="County">County</option>'+
									'<option value="State">State</option>'+
									'<option value="Private">Private</option>'+
								'</select>'+ 
						 	'</label>' + 
						 	'<label>Municipality: ' +
						 		'<input type="text" name="Municipality" id="Municipality" value="'+muni+'">' + 
						 	'</label>' +
						 	'<label>Location Description: ' +
						 		'<input type="text" name="LocationDescription" id="LocationDescription" value="'+locDesc+'">' + 
						 	'</label>' + 
						 	'<label>CB Type: ' +
						 		'<input type="text" name="CBType" id="CBType" value="'+cbType+'">' + 
						 	'</label>' + 
						 	'<label>Top of Structure: ' +
						 		'<input type="text" name="RimElevationFt" id="RimElevationFt" style="width: 50px;" value="'+rimElFt+'"> (ft) ' + 
						 		'<input type="text" name="RimElevationIn" id="RimElevationIn" style="width: 50px;" value="'+rimElIn+'"> (in)' + 
						 	'</label>' + 
						 	'<label>Diameter: ' +
						 		'<input type="text" name="AccessDiameterFt" id="AccessDiameterFt" style="width: 50px;" value="'+accDiaFt+'"> (ft) ' + 
						 		'<input type="text" name="AccessDiameterIn" id="AccessDiameterIn" style="width: 50px;" value="'+accDiaIn+'"> (in)' +
						 	'</label>' + 
						 	'<label>Access Material: ' +
						 		'<select name="AccessMaterial" id="AccessMaterial">' +
									'<option value=""></option>'+
									'<option value="Steel">Steel</option>'+
									'<option value="Iron">Iron</option>'+
									'<option value="Other">Other</option>' +
									'<option value="Unknown">Unknown</option>'+
								'</select>'+
						 	'</label>' + 
						 	'<label>Access Type: ' +
						 		'<select name="AccessType" id="AccessType">' +
									'<option value=""></option>'+
									'<option value="Door">Door</option>'+
									'<option value="Grate">Grate</option>'+
									'<option value="Hand">Hand</option>'+
									'<option value="Lid">Lid</option>'+
									'<option value="Manhole Cover">Manhole Cover</option>'+
									'<option value="Other">Other</option>'+
									'<option value="Unkown">Unkown</option>'+
								'</select>'+ 
						 	'</label>' + 
						 	'<label>Invert Elevation: ' +
						 		'<input type="text" name="InvertElevationFt" id="InvertElevationFt" style="width: 50px;" value="'+inverElFt+'"> (ft) ' +
						 		'<input type="text" name="InvertElevationIn" id="InvertElevationIn" style="width: 50px;" value="'+inverElIn+'"> (in) ' +
						 	'</label>' + 
						 	'<label>Comments: <br>' +
						 		'<textarea name="Comments" id="Comments" cols="30" rows="10" style="height: 150px;">'+comments+'</textarea>' +
						 	'</label>' + 
						 	'</p><br>' +
						 	'<input type="submit" value="Submit">' +
						 '</form>';
         var form = '<iframe style="display:none;" src="" name="myiframe"></iframe>' +
					'<div style="height: 5px"></div>' +
					'<form action="php/basin.php" method="post" target="_blank">' +
						'<input type="hidden" name="bid" value="'+ json["basin#"] +'" >' +
						'<input type="hidden" name="time" value="null">' +
						'<b>Basin #:   </b>' +
						'<button><div class="basinID">' + json["basin#"] + '</div></button>' +
					'</form>' +
					'<div style="height: 5px"></div>' + 
					'<form action="php/processimage.php" method="post" onsubmit="return postOpLog()" enctype="multipart/form-data" target="myiframe">' +
						'<input type="hidden" name="bid" value="'+ json["basin#"] +'" >' +
						'<label for="response_type">Response Type: ' +
							'<select name="response_type" id="responseType">' +
								'<option value="Routine Maintenance">Routine Maintenance</option>' +
								'<option value="Repair">Repair</option><option value="Emergency Response/Recovery">Emergency Response/Recovery</option>' +
							'</select>' +
						'</label>' +
						'<label for="derisCol">Debris Collected (ft&sup3;): <input type="text" name="debrisCol" id="debrisCol"></label>' +
						'<label for="responseNotes">Response Notes: <br>' +
							'<textarea name="responseNotes" id="respoNote" cols="30" rows="10" style="height: 150px;"></textarea>' +
						'</label>' +
						'<label for="photo">Photo:  ' + 
							'<input type="file" name="image" id="image">' +
						'</label>' +
						'<input type="submit" value="Submit">' +
					'</form>';
         
         var tabPane = '<div class="tab-content"><div class="tab-pane active" id="basin">' + basin +'</div><div class="tab-pane" id="form">' + form +'</div></div>';
         var tabs = '<ul class="nav nav-tabs"><li class="active" ><a href="#basin" data-toggle="tab">Attributes</a></li><li><a href="#form" data-toggle="tab">Operations Log</a></li></ul>'
         var cont = '<div id="cont" class="tabbable maincon" style="width: 350px; height=350px;">' + tabs + tabPane + '</div>';
         
         if(!ismobile) {
         	popup.setTitle("Selected Catchbasin");
         	popup.setContent(cont);
	        popup.resize(370,500);
	        popup.show(evt.mapPoint);
	        

         } else {
         	console.log("mobile");
         	$("#popcon").html(cont);
         	$("#selTitle").html("Selected Catchbasin");
         	var pop = document.getElementById("pop");
          	pop.style.visibility='visible';

         }
        var sel = document.getElementById('drainsTo');
        var opts = sel.options;
        for(var opt, j = 0; opt = opts[j]; j++) {
          	if (opt.value == drains) {
          		sel.selectedIndex = j;
          		break;
          	}
        }
        sel = document.getElementById('condition');
        opts = sel.options;
        for(var opt, j = 0; opt = opts[j]; j++) {
        if (opt.value == condition) {
          	sel.selectedIndex = j;
          	break;
          	}
        }
        sel = document.getElementById('AccessMaterial');
        opts = sel.options;
        for(var opt, j = 0; opt = opts[j]; j++) {
        if (opt.value == accMat) {
          	sel.selectedIndex = j;
          	break;
          	}
        }
        sel = document.getElementById('AccessType');
        opts = sel.options;
        for(var opt, j = 0; opt = opts[j]; j++) {
        if (opt.value == accType) {
          	sel.selectedIndex = j;
          	break;
          	}
        }
        sel = document.getElementById('OwnedBy');
        opts = sel.options;
        for(var opt, j = 0; opt = opts[j]; j++) {
          	if (opt.value == ownedBy) {
          		sel.selectedIndex = j;
          		break;
          	}
        }
        $("#addInfo").click(function() {
        	$("#testTog").toggle("fast");
        });

    }
   
    function swManholeInfo(map,evt,json) {
    	var popup = map.infoWindow,
    		mid = json['manhole#'],
    		address = (json['address'] != null) ? json['address'] : "",
    		topRimEl = (json['topRimEl'] != null) ? json['topRimEl'] : 0,
    		condition = json['condition'],
    		ownedBy = (json['ownedBy'] != null) ? json['ownedBy'] : "",
    		muni = (json['muni'] != null) ? json['muni'] : "",
    		locDesc = (json['locDesc'] != null) ? json['locDesc'] : "";
    		var accDia = Number(json['accDia']);
	        if (accDia != "") {
		        var accDiaFt = Math.floor(accDia);
		        var accDiaIn = ((accDia - accDiaFt) * 12).toFixed(0);
	        } else {
		        var accDiaFt = 0;
		        var accDiaIn = 0;
	        }
	        var accType = (json['accType'] != null) ? json['accType'] : "",
	        	groundType = (json['groundType'] != null) ? json['groundType'] : "";
	        var hpe = Number(json['hpe']);
	        if (hpe != "") {
		        var hpeFt = Math.floor(hpe);
		        var hpeIn = ((hpe - hpeFt) * 12).toFixed(0);
	        } else {
		        var hpeFt = 0;
		        var hpeIn = 0;
	        }
	        var rimEl = Number(json['rimEl']);
	        if (rimEl != "") {
		        var rimElFt = Math.floor(rimEl);
		        var rimElIn = ((rimEl - rimElFt) * 12).toFixed(0);
	        } else {
		        var rimElFt = 0;
		        var rimElIn = 0;
	        }
	        var inverEl = Number(json['inverEl']);
	        if (inverEl != "") {
		        var inverElFt = Math.floor(inverEl);
		        var inverElIn = ((inverEl - inverElFt) * 12).toFixed(0);
	        } else {
		        var inverElFt = 0;
		        var inverElIn = 0;
	        }
	        var interDrop = Number(json['interDrop']);
	        if (interDrop != "") {
		        var interDropFt = Math.floor(interDrop);
		        var interDropIn = ((interDrop - interDropFt) * 12).toFixed(0);
	        } else {
		        var interDropFt = 0;interDrop
		        var interDropIn = 0;
	        }
	        var manholeDrop = (json['manholeDrop'] != null) ? json['manholeDrop'] : "",
	        	wallMat = (json['wallMat'] != null) ? json['wallMat'] : "",
	        	structShape = (json['structShape'] != null) ? json['structShape'] : "",
	        	manholeType = (json['manholeType'] != null) ? json['manholeType'] : "",
	        	metered = (json['metered'] != null) ? json['metered'] : "";
	        	if (metered == 0 || metered == 'False') {
	        		metered = "False";
	        		var mv = "0";
	        	} else if (metered == 1 || metered == 'True') {
	        		metered = "True";
	        		var mv = "1";

	        	} else {
	        		metered = "";
	        	}
	        var comments = (json['comments'] != null) ? json['comments'] : "",
			manAttr = '<div style="height: 5px"></div>' +
						'<form action="php/manhole.php" method="post" target="_blank">' +
							'<input type="hidden" name="mid" value="'+ mid +'" >' +
							'<input type="hidden" name="time" value="null">' +
							'<b>Manhole #:   </b>' +
							'<button><div class="manholeID">' + mid + '</div></button>' +
						'</form><br>' + 
						'<form action="" onsubmit="return postManhole()" method="post">' + 
							'<label for="address">Address:  ' +
								'<input type="text" name="address" id="address" value="'+ address+'">' +
							'</label>' +
							'<label for="reimEl">' +
								'Top Rim Elevation:  ' +  
								'<input type="text" name="rimEl" id="rimEl" value="'+topRimEl+'">' +
							'</label><br>' +
							'<label> Condition: ' +
									'<select name="condition" id="mhCondition">' +
									'<option value=""></option>' +
									'<option value="Good">Good</option>' +
									'<option value="Poor">Poor</option>' +
									'<option value="Needs Maintenance">Needs Maintenance</option>' +
								'</select>' +
							'</label><br><br>' +
							'<button type="button" id="addInfo">Addtional Atrributes <span class="glyphicon glyphicon-plus-sign"></span></button><br><p id="testTog" style="display: none">' + 
							'<br><label>Owned By: ' +
						 		'<select name="OwnedBy" id="OwnedBy">' +
									'<option value=""></option>'+
									'<option value="Municipality">Municipality</option>'+
									'<option value="County">County</option>'+
									'<option value="State">State</option>'+
									'<option value="Private">Private</option>'+
								'</select>'+ 
						 	'</label>' + 
						 	'<label>Municipality: ' +
						 		'<input type="text" name="Municipality" id="Municipality" value="'+muni+'">' + 
						 	'</label>' +
						 	'<label>Location Description: ' +
						 		'<input type="text" name="LocationDescription" id="LocationDescription" value="'+locDesc+'">' + 
						 	'</label>' + 
						 	'<label>Access Diameter: ' +
						 		'<input type="text" name="AccessDiameterFt" id="AccessDiameterFt" style="width: 50px;" value="'+accDiaFt+'"> (ft) ' +
						 		'<input type="text" name="AccessDiameterIn" id="AccessDiameterIn" style="width: 50px;" value="'+accDiaIn+'"> (in) ' +
						 	'</label>' + 
						 	'<label>Access Type: ' +
						 		'<select name="AccessType" id="AccessType">' +
									'<option value=""></option>'+
									'<option value="Door">Door</option>'+
									'<option value="Grate">Grate</option>'+
									'<option value="Hand">Hand</option>'+
									'<option value="Lid">Lid</option>'+
									'<option value="Manhole Cover">Manhole Cover</option>'+
									'<option value="Other">Other</option>'+
									'<option value="Unkown">Unkown</option>'+
								'</select>'+ 
						 	'</label>' + 
						 	'<label>Ground Type: ' +
						 		'<input type="text" name="GroundType" id="GroundType" value="'+groundType+'">' + 
						 	'</label>' + 
						 	'<label>High Pipe Elevation: ' +
						 		'<input type="text" name="HighPipeElevation" id="HighPipeElevationFt" style="width: 50px;" value="'+hpeFt+'"> (ft) ' +
						 		'<input type="text" name="HighPipeElevation" id="HighPipeElevationIn" style="width: 50px;" value="'+hpeIn+'"> (in) ' +
						 	'</label>' + 
						 	'<label>Rim Elevation: ' +
						 		'<input type="text" name="RimElevation" id="RimElevationFt" style="width: 50px;" value="'+rimElFt+'"> (ft) ' +
						 		'<input type="text" name="RimElevation" id="RimElevationIn" style="width: 50px;" value="'+rimElIn+'"> (in) ' +
						 	'</label>' + 
						 	'<label>Invert Elevation: ' +
						 		'<input type="text" name="InvertElevation" id="InvertElevationFt" style="width: 50px;" value="'+inverElFt+'"> (ft) ' +
						 		'<input type="text" name="InvertElevation" id="InvertElevationIn" style="width: 50px;" value="'+inverElIn+'"> (in) ' +
						 	'</label>' + 
						 	'<label>Manhole Drop: ' +
						 		'<input type="text" name="ManholeDrop" id="ManholeDrop" value="'+manholeDrop+'">' + 
						 	'</label>' + 
						 	'<label>Interior Drop: ' +
						 		'<input type="text" name="InteriorDrop" id="InteriorDropFt" style="width: 50px;" value="'+interDropFt+'"> (ft) ' +
						 		'<input type="text" name="InteriorDrop" id="InteriorDropIn" style="width: 50px;" value="'+interDropIn+'"> (in) ' +
						 	'</label>' + 
						 	'<label>Wall Material: ' +
								'<select name="WallMaterial" id="WallMaterial">' +
									'<option value=""></option>'+
									'<option value="Brick">Brick</option>'+
									'<option value="Concrete">Concrete</option>'+
									'<option value="Reinforced Concrete">Reinforced Concrete</option>'+
									'<option value="Other">Other</option>'+
									'<option value="Unkown">Unkown</option>'+
								'</select>'+						 	
							'</label>' + 
						 	'<label>Structural Shape: ' +
						 		'<input type="text" name="StructuralShape" id="StructuralShape" value="'+structShape+'">' + 
						 	'</label>' + 
						 	'<label>Manhole Type: ' +
						 		'<input type="text" name="ManholeType" id="ManholeType" value="'+manholeType+'">' + 
						 	'</label>' + 
						 	'<label>Metered: ' +
						 		'<select name="Metered" id="Metered">' +
									'<option value=""></option>'+
									'<option value="0">False</option>'+
									'<option value="1">True</option>'+
								'</select>'+
						 	'</label>' + 
						 	'<label>Comments: <br>' +
						 		'<textarea name="Comments" id="Comments" cols="30" rows="10" style="height: 150px;">'+comments+'</textarea>' +
						 	'</label>' + 
						 	'</p><br>' +
							'<input type="submit" value="Submit">' + 
						'</form>',
			manOpLog = '<iframe style="display:none;" src="" name="myiframe"></iframe>' +
							'<div style="height: 5px"></div>' +
							'<form action="php/manhole.php" method="post" target="_blank">' +
								'<input type="hidden" name="mid" value="'+ mid +'" >' +
								'<input type="hidden" name="time" value="null">' +
								'<b>Manhole #:   </b>' +
								'<button><div class="manholeID">' + mid + '</div></button>' +
							'</form>' +
							'<div style="height: 5px"></div>' + 
							'<form action="php/processimage.php" method="post" onsubmit="return postManOpLog()" enctype="multipart/form-data" target="myiframe">' +
								'<input type="hidden" name="mid" value="'+ mid +'" >' +
								'<label for="response_type">Response Type: ' +
									'<select name="response_type" id="responseType">' +
										'<option value="Routine Maintenance">Routine Maintenance</option>' +
										'<option value="Repair">Repair</option><option value="Emergency Response/Recovery">Emergency Response/Recovery</option>' +
									'</select>' +
								'</label>' +
								'<label for="derisCol">Debris Collected (ft&sup3;): <input type="text" name="debrisCol" id="debrisCol"></label>' +
								'<label for="responseNotes">Response Notes: <br>' +
									'<textarea name="responseNotes" id="respoNote" cols="30" rows="10" style="height: 150px;"></textarea>' +
								'</label>' +
								'<label for="photo">Photo:  ' + 
									'<input type="file" name="image" id="image">' +
								'</label>' +
								'<input type="submit" value="Submit">' +
							'</form>',
			tabPane = '<div class="tab-content"><div class="tab-pane active" id="manhole">' + manAttr +'</div><div class="tab-pane" id="swOpLog">'+manOpLog+'</div></div>',
			tabs = '<ul class="nav nav-tabs"><li class="active" ><a href="#manhole" data-toggle="tab">Attributes</a></li><li><a href="#swOpLog" data-toggle="tab">Operations Log</a></li></ul>',
			cont = '<div id="cont" class="tabbable maincon" style="width: 350px; height=350px;">' + tabs + tabPane + '</div>';
        popup.setTitle("Selected Storm Water Manhole");
        if(!ismobile) {
         	popup.setContent(cont);
	        popup.resize(370,500);
	        popup.show(evt.mapPoint);
         } else {
         	console.log("mobile");
         	$("#popcon").html(cont);
         	$("#selTitle").html("Selected Storm Water Manhole");
         	var pop = document.getElementById("pop");
          	pop.style.visibility='visible';
         }
        var sel = document.getElementById('mhCondition');
        var opts = sel.options;
        for(var opt, j = 0; opt = opts[j]; j++) {
	        if (opt.value == condition) {
	          	sel.selectedIndex = j;
	          	break;
          	}
        }
        sel = document.getElementById('AccessType');
        opts = sel.options;
        for(var opt, j = 0; opt = opts[j]; j++) {
        if (opt.value == accType) {
          	sel.selectedIndex = j;
          	break;
          	}
        }
        sel = document.getElementById('Metered');
        opts = sel.options;
        for(var opt, j = 0; opt = opts[j]; j++) {
          	if (opt.value == mv) {
          		sel.selectedIndex = j;
          		break;
          	}
        }
        sel = document.getElementById('OwnedBy');
        opts = sel.options;
        for(var opt, j = 0; opt = opts[j]; j++) {
          	if (opt.value == ownedBy) {
          		sel.selectedIndex = j;
          		break;
          	}
        }
        sel = document.getElementById('WallMaterial');
        opts = sel.options;
        for(var opt, j = 0; opt = opts[j]; j++) {
          	if (opt.value == wallMat) {
          		sel.selectedIndex = j;
          		break;
          	}
        }
        $("#addInfo").click(function() {
        	$("#testTog").toggle("fast");
        });
    }
    
	function updateLayers(map, checkbox)
	{
		var layers = map.getLayer('layer'),
			visiblelayer = layers.visibleLayers;
		if(checkbox.checked) {
			visiblelayer.push(parseInt(checkbox.value, 10));
		} else {
			visiblelayer.splice(visiblelayer.indexOf(parseInt(checkbox.value, 10)), 1);
		}
		if(visiblelayer.length > 0) {
			layers.setVisibleLayers(visiblelayer);
		} else {
			layers.setVisibleLayers([-1]);
		}
	}
	function buildLayerList(map)
	{
		var array,
			index = 0,
			xhr = new XMLHttpRequest(),
			layerjson = {},
			layers = {},
			length = 0,
			legend,
			legendimg,
			list = document.getElementById("list"),
			listlayers = document.createElement("ul"),
			lilayer,
			checkboxlayer,
			labellayer,
			target,
			object = {},
			listener = function(checkbox) {
				checkbox.addEventListener("change", function(){
					updateLayers(map, checkbox);
				});
			};
		xhr.open("GET", "http://arcgis5.njmeadowlands.gov/webmaps/rest/services/Utility/20140430_DPW_Assets/MapServer?f=json&pretty=false", false);
		xhr.send();
		listlayers.className = "layer-list";
		if(xhr.readyState === 4 && xhr.status === 200)
		{
			layerjson = JSON.parse(xhr.responseText.trim());
			layers = layerjson.layers;
			length = layers.length;
			xhr.open("GET", "http://arcgis5.njmeadowlands.gov/webmaps/rest/services/Utility/20140430_DPW_Assets/MapServer/legend?f=json&pretty=false", false);
			xhr.send();
			if(xhr.readyState === 4 && xhr.status === 200)
			{
				legend = JSON.parse(xhr.responseText.trim()).layers;
				for(index = 0; index < length; index += 1)
				{
					lilayer = document.createElement("li");
					checkboxlayer = document.createElement("input");
					checkboxlayer.type = "checkbox";
					checkboxlayer.id = "layer-" + layers[index].id;
					checkboxlayer.className = "checkbox";
					checkboxlayer.value = layers[index].id;
					labellayer = '<label for="' + checkboxlayer.id + '">' + layers[index].name + '</label>';
					legendimg = document.createElement("img");
					legendimg.className = "legend-image";
					legendimg.src = "data:" + legend[layers[index].id].legend[0].contentType + ";base64," + legend[layers[index].id].legend[0].imageData;
					lilayer.appendChild(checkboxlayer);
					lilayer.innerHTML += labellayer;
					lilayer.appendChild(legendimg);
					listlayers.appendChild(lilayer);
					object[layers[index].id] = layers[index].defaultVisibility;
				}
				list.appendChild(listlayers);
				array = list.childNodes[0].childNodes;
				for(index = 0; index < array.length; index += 1) {
					target = array[index].childNodes[0];
					target.checked = object[target.value];
					listener(target);
				}
			}
		}
	}
	require(["dojo/on", "esri/map", "esri/dijit/LocateButton", "esri/dijit/Geocoder", "esri/dijit/Popup", "esri/dijit/PopupMobile", "esri/layers/ArcGISDynamicMapServiceLayer"], function(on, Map, LocateButton, Geocoder, Popup, PopupMobile, ArcGISDynamicMapServiceLayer)
	{
		var geoLocate,
			geocoder,
			map,
			layers = new ArcGISDynamicMapServiceLayer("http://arcgis5.njmeadowlands.gov/webmaps/rest/services/Utility/20140430_DPW_Assets/MapServer",
				{
					id: "layer",
					visible: true
				}),
			popup;			
		if(!ismobile)
		{
			popup = new Popup({
				highlight: false,
				titleInBody: true
			}, document.getElementById("popup"));
		}
		else
		{
			popup = new PopupMobile(null, document.getElementById("popup"));
		}
		map = new Map("map", {
			basemap: "satellite",
			center: [-74.08456781356876, 40.78364440736023],			
			logo: false,
			infoWindow: popup,
			sliderStyle: "small",
			zoom: 12
		});
        map.infoWindow.resize(350,350);
		map.addLayer(layers);
		on.once(map, "load", function() {
			var list = document.getElementById('list');
			document.getElementById("layers").addEventListener("click", function() {
				list.classList.toggle("display-list");
			});
		});
		geoLocate = new LocateButton({
			map: map,
		}, "LocateButton");
		geocoder = new Geocoder({
			arcgisGeocoder: {
				placeholder: "Type Street Address",
				sourceCountry: "USA"
			},
			map: map,
        }, "search");
        geocoder.startup();
		geoLocate.startup();
		document.getElementById('Logoff').addEventListener('click', function() {
			document.cookie = "NJMC_MERI_ERIS" + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=.njmeadowlands.gov';
			document.cookie = "NJMC_MERI_ERIS" + '=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=localhost';
			document.location.reload(true);
		});
		document.getElementById('extent').addEventListener('click', function() {
			map.centerAndZoom([-74.08456781356876, 40.78364440736023], 12);
			geoLocate.clear();
		});
		buildLayerList(map);
		on(popup, "maximize", function() {
			this.setContent("maximize");
		});
		on(map, "click", function(evt) {
			queryLayer(this, evt);
		});
	});
}());

