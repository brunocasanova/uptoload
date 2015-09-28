var fs = require( 'fs' );
var path = require( 'path' );

var Promise = require( 'bluebird' );

module.exports = function ( promise, object, dest, file ){
	var configs = object.configs;

	return Promise.all( promise )
	.then(function ( args ){
		
		for( var i in args ){

			for( var ii in configs ){

				args[i].stream(function ( err, stdout, stderr ){

					stdout.pipe( fs.createWriteStream( path.join( dest[ configs[ii].type ], configs[ii].type + '_' + file.name ) ) );
				});
			}

		}

	})
	.then(function ( args ){
		console.log( args );

		fs.unlinkSync( object.set.temp );

	})

}