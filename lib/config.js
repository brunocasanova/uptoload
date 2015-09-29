var fs = require( 'fs' );
var path = require( 'path' );
var mkdirp = require( 'mkdirp' );
var multer = require( './multer' );

module.exports = function ( req, res, next ){
	var tempDir = path.join( req.file.dest.temp, req.file.filename );

	console.log( tempDir );

	mkdirp( configs.set.dest.base + '/temp', function ( err, files ){
		if( err ) console.log( 'err:', err );
		
		console.log( 'files:', files );

	});

	mkdirp( configs.set.dest.base + '/high', function ( err, files ){
		if( err ) console.log( 'err:', err );
		
		console.log( 'files:', files );

	});

	mkdirp( configs.set.dest.base + '/low', function ( err, files ){
		if( err ) console.log( 'err:', err );
		
		console.log( 'files:', files );

	});

	mkdirp( configs.set.dest.base + '/c256', function ( err, files ){
		if( err ) console.log( 'err:', err );
		
		console.log( 'files:', files );

	});

	mkdirp( configs.set.dest.base + '/c64', function ( err, files ){
		if( err ) console.log( 'err:', err );
		
		console.log( 'files:', files );

	});

	next();

};

module.exports.multer = multer;

module.exports.configs = {
		
	high: {
		type: 'high',
		options: {
			enhance: 'yes',
		},
	},

	low: {
		type: 'low',
		options: {
			quality: 20,
			compress: 'JPEG',
		},
	},

	c256: {
		type: 'c256',
		options: {
			resize: [ '256', '256' ]
		},
	},

	c64: {
		type: 'c64',
		options: {
			resize: [ '64', '64' ]
		},
	},

};