module.exports = (function(){
	

	var fs = require("fs");


	var openStreams = [];

	// Catches ctrl+c event to exit properly
	process
	.on('SIGINT', process.exit)

	// Cleanup before exit
	.on('exit', function(){
		openStreams.forEach(function(stream){
			stream.end();
		});
	});


	function getDate(){
		var date = new Date();
		return	date.getFullYear() +
				"/" + (date.getMonth() + 1) +
				"/" + date.getDate() +
				" " + date.getHours() +
				":" + date.getMinutes() +
				":" + date.getSeconds();
	}

	function parseArg(arg){

		if( arg === null || arg === undefined ){ return arg; }
		if( typeof arg === "string" || typeof arg === "number" || typeof arg === "boolean" ){ return arg; }
		if( typeof arg === "object" ){

			// Null object or Object or Array
			if(
				!("constructor" in arg) ||
				arg.constructor === Object ||
				arg.constructor === Array
			){ return JSON.stringify(arg); }

			if( typeof arg.toString === "function" ){ return arg.toString(); }


			console.log("Unknown object case", arg);
			return arg;
		}

		console.log("Unknown case", arg);
		return arg;
	}

	function logToStream(stream, type, args){

		var message = getDate() + "\t[" + type + "]";

		for( var i = 0; i < args.length; i++ ){
			message += "\t" + parseArg(args[i]);
		}

		stream.write(message + "\n");
	}

	function Logger(fileName){

		if( typeof fileName !== "string" ){
			throw new Error("Log file path must be a string");
		}

		// Open stream
		openStreams.push(this.stream = fs.createWriteStream(fileName, { flags: 'a' }));
	}


	Logger.prototype.createType = function(){
		var self = this;
		for( var i = 0; i < arguments.length; i++ ){
			var arg = arguments[i];
			if( typeof arg === "string" ){
				(function(arg){
					self[arg] = function(){
						logToStream(self.stream, arg.toUpperCase(), arguments);
					};
				})(arg);
			}
		}
	};

	Logger.prototype.log = function(){
		logToStream(this.stream, "LOG", arguments);
	};

	Logger.prototype.info = function(){
		logToStream(this.stream, "INFO", arguments);
	};

	Logger.prototype.error = function(){
		logToStream(this.stream, "ERROR", arguments);
	};


	return Logger;
})();