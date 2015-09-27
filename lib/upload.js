var fs = require( 'fs' );
var path = require( 'path' );

var gm = require( 'gm' );
var Promise = require( 'bluebird' );

var config = {




};

module.exports = function ( req, res, next ){	
	var file = req.file
		dest = file.dest;

	var tempDir = path.join( dest.temp, file.filename );

	//var readStream = fs.createReadStream( tempDir );


	var promise = Promise.all();

	promise.push([
		fs.createReadStream( tempDir ),
		gm( readStream ).enhance(),
		gm( readStream ).quality( 25 ).compress( 'JPEG' ),
		gm( readStream ).resize( '256', '256' )
		gm( readStream ).resize( '64', '64' )
	]);





	// High resolution image
	gm( readStream )
	.enhance()
	.stream(function ( err, stdout, stderr ){
		if( err ) console.log( 'high: ', err );

		var perc, out = 0;
		var total = req.headers[ 'content-length' ];
		var progress = 0;

		stdout.on( 'data', function ( chunk ){
			console.log( 'percent complete: ' + out + '%' );

			progress += chunk.length;
			perc = parseInt( ( progress / total ) * 100 );

			out = perc > 100 && 99 || perc;
		});

		stdout.on( 'end', function (){
			console.log( 'percent complete: 100%' );
		});

		var writeStream = fs.createWriteStream( path.join( dest.high, 'high_' + file.name ) );

		stdout.pipe( writeStream );
	});

	// Low resolution image
	gm( readStream )
	.quality( 25 )
	.compress( 'JPEG' )
	.stream(function ( err, stdout, stderr ){
		if( err ) console.log( 'low: ', err );

		var writeStream = fs.createWriteStream( path.join( dest.low, 'low_' + file.name ) );

		stdout.pipe( writeStream );
	});

	// C256 image
	gm( readStream )
	.resize( '256', '256' )
	.stream(function ( err, stdout, stderr ){
		if( err ) console.log( '256: ', err );

		var writeStream = fs.createWriteStream( path.join( dest.c256, 'c256_' + file.name ) );

		stdout.pipe( writeStream );

	});

	// C64 image
	gm( readStream )
	.resize( '64', '64' )
	.stream(function ( err, stdout, stderr ){
		if( err ) console.log( '64: ', err );

		var writeStream = fs.createWriteStream( path.join( dest.c64, 'c64_' + file.name ) );

		stdout.pipe( writeStream );

	});

	// delete file from temp folder
	fs.unlinkSync( tempDir );

	next();
};

