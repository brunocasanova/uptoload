var events = require( 'events' ).EventEmitter;
events.prototype._maxListeners = 100;

var fs = require( 'fs' );
var path = require( 'path' );
var upload = require( './upload' );
var stream = require( './stream' );
var config = require( './config' );

var uptoload = function ( req, res, next ){
	var dest = path.join( __dirname, config.configs.main.dest );
	var temp = path.join( dest, 'temp' );

	return upload( req, config.configs )
	.then(function ( promise ){
		return stream( req, promise );
	})
	.then(function (){
		fs.unlinkSync( req.file.streamPath );
	})
	.nodeify( next )
	
	.catch(function ( err ){
		console.log( err.stack );
	});
};

module.exports = [ config.multerMiddleware, config.multerError, uptoload ];