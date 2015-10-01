var events = require( 'events' ).EventEmitter;
events.prototype._maxListeners = 100;

var fs = require( 'fs' );
var path = require( 'path' );
var upload = require( './upload' );
var stream = require( './stream' );
var config = require( './config' );

module.exports = [ config.multerError, config.multerMiddleware, uptoload ];

function uptoload( req, res, next ){

	var dest = path.join( __dirname, config.configs.main.dest );
	var temp = path.join( dest, 'temp' );

	if( ! req.file ) throw new Error( 'Need file to procceed!' );

	return upload( req, config.configs )
	.then(function ( promise ){
		return stream( req, promise );
	})
	.then(function (){
		fs.unlinkSync( path.join( req.file.dest.temp, req.file.filename ) );
	})
	.nodeify( next );
}