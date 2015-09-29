var fs = require( 'fs' );
var path = require( 'path' );

var events = require( 'events' ).EventEmitter;
events.prototype._maxListeners = 100;

var upload = require( './upload' );
var stream = require( './stream' );

module.exports = function ( req, res, next ){	
	var tempDir = path.join( req.file.dest.temp, req.file.filename ),
		configs = require( './configs' )( req, tempDir );

	return upload( configs )

	.then(function ( promise ){

		return stream( promise, configs );
	})

	.then(function (){
		fs.unlinkSync( configs.set.temp );
	})

	.nodeify( next )
	
	.catch(function ( err ){
		console.log( err.stack );
	});

};

