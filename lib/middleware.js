var events = require( 'events' ).EventEmitter;
events.prototype._maxListeners = 100;

var fs = require( 'fs' );
var path = require( 'path' );
var upload = require( './upload' );
var stream = require( './stream' );
var configs = require( './config' ).configs;

var multer = require( './multer' );

var itu = multer.single( 'imageToUpload' );

module.exports = function ( req, res, next ){
	var tempDir = path.join( req.file.dest.temp, req.file.filename ),
		configs = require( './config' )( req, tempDir );

	itu( req, res, function ( err ) {
		if( err ){
			console.log( err.stack );
			return;
		}

		next();
	});

	itu.call( this, req, res, next );

	return upload( req, configs )
	.then(function ( promise ){
		return stream( req, promise );
	})
	.then(function (){
		fs.unlinkSync( req.files.dest.temp );
	})
	.nodeify( next )
	
	.catch(function ( err ){
		console.log( err.stack );
	});

};

module.exports.config = require( './config' );

