#! /usr/bin/env node

process.stdin.setEncoding('utf8');
process.stdin.resume();

//utility modules
var got    = require('got');
var striptags = require('striptags');
var chalk = require('chalk');

//google maps api
var URL = 'https://maps.googleapis.com/maps/api/directions/json';

//initialized to empty to prevent getting directions on empty parameters 
var origin = "";
var destination = "";


var setStartMsg = "-Set your origin with `set origin _your location_`";
var setEndMsg = "-Set your destination with `set destination _your location_`";
var getDirMsg = "-Get directions with `get directions`";
var quitMsg = "-Get directions with `get directions`";

process.stdin.on("data", function(text){

	arguments = text.trim().split(/\s+/);
	if(arguments.length === 0){
		console.log("Invalid number of parameters given");
		return;
	}
	//handle single quit command
	if(arguments.length === 1){
		if(arguments[0] === "quit"){
			process.exit();
		}else{
			console.log("Invalid command. Did you mean quit?");
			console.log(quitMsg);
			return;
		}
	}
	//handle get directions command
	if(arguments.length === 2){
		if(arguments[0] === "get" && arguments[1] === "directions"){
			if(origin === ""){
				console.log("Origin is not set");
				return;
			}
			if(destination === ""){
				console.log("Destination is not set");
				return;
			}
			getDirections(origin, destination);
			return;

		}else{
			console.log("Invalid command. Did you mean get directions?");
			console.log(getDirMsg);
			return;
		}
	}

	//handle set directions command
	if(arguments.length >= 3){
		if(arguments[0] === "set"){
			if(arguments[1] === "origin"){
				arguments = arguments.slice(2);
				origin = arguments.join(" ");
				console.log("Origin is set to: " + origin);
				return;
			}else if(arguments[1] === "destination"){
				arguments = arguments.slice(2);
				destination = arguments.join(" ");
				console.log("Destination is set to: " + destination);
				return;
			}else{
				console.log("Invalid set operation.")
				return;
			}
			//;
			
		}else{
			console.log("Invalid command. Where you trying to set a location?");
			console.log(setStartMsg);
			console.log(setEndMsg);
			return;
		}
	}
	
})
console.log("Welcome to MapPath!");




function getDirections(a, b){

	console.log("Getting directions...");

	var locations = {
		origin: a,
		destination: b
	}

	//make call to google maps api with specified locations
	got(URL, {
		query: locations,
		json: true
	}).then(function(response){

		//handle response

		var result = response.body;

		var response = {};

		var route = result.routes.shift();
		var legs = route.legs.shift();

		

		var steps = legs.steps.map(function(step) {
	    var route = striptags(step.html_instructions) + ' (' + step.distance.text + ')';
	    return route;
	  });

		response.start = legs.start_address;
		response.end = legs.end_address;
		response.duration = legs.duration.text;
		response.routes = steps;
		
		
		console.log(chalk.underline.bold('Route'));
    console.log(chalk.green.bold(response.start) + ' → ' + chalk.green.bold(response.end));
    console.log(chalk.underline.bold('Duration'));
    console.log(chalk.green(response.duration));
    console.log(chalk.underline.bold('Routes'));
    response.routes.forEach(function(route) {
    	console.log(chalk.yellow(route));
    });



	});
}


 

  





