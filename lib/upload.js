var path = require( 'path' );
var fs = require( 'fs' );

var gm = require( 'gm' );
var Promise = require( 'bluebird' );

var util = require( 'findhit-util' );

var stream = require( './stream' );

module.exports = function ( req, res, next ){	
	var file = req.file
		dest = file.dest;

	var tempDir = path.join( dest.temp, file.filename );

	var object = {

		set: {
			temp: tempDir,
			read: fs.createReadStream( tempDir ),
		},

		configs: {
		
			high: {
				type: 'high',
				options: {
					enhance: 'yes',
				},
			},

			low: {
				type: 'low',
				options: {
					quality: 25,
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

		},

	}

	var promise = [],
		configOpts,
		optsValue;

	return Promise.cast( object.configs )
	.then(function ( configs ){

		for( var i in configs ){
			configOpts = configs[i].options;

			for( var ii in configOpts ){

				optsValue = configOpts[ii];

				if( util.is.Array( optsValue ) ){

					console.log( 'configOpts )[0]', Object.keys( configOpts )[0] );
					console.log( 'optsValue[0]', optsValue[0] );
					console.log( 'optsValue', optsValue );

					promise.push( gm( object.set.read )[ Object.keys( configOpts )[0] ]( optsValue[0], optsValue[1] ) );
				}

				else if( ! util.is.Array( optsValue ) && util.is.String( optsValue ) || util.is.Number( optsValue ) ){

					if( Object.keys( configOpts ).length > 1 ){
						
						promise.push(
							gm( object.set.read )
							[ Object.keys( configOpts )[0] ]( optsValue )
							[ Object.keys( configOpts )[1] ]( optsValue )
						);

					}

					else{
						promise.push(
							gm( object.set.read )
							[ Object.keys( configOpts )[0] ]( optsValue == 'yes' && null || optsValue ) );
					}

				}

			}
		}

		//console.log( 'PROMISE:', promise );

	})
	.then(function (){
		return stream( promise, object, dest, file );
	})
	.nodeify( next )
	
	.catch(function ( err ){
		console.log( err.stack );
	});





	/*
	promise = [
		gm( readStream ).enhance(),
		gm( readStream ).quality( 25 ).compress( 'JPEG' ),
		gm( readStream ).resize( '256', '256' ),
		gm( readStream ).resize( '64', '64' ),
	];
	*/



	/*


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
	
	*/
	
	// delete file from temp folder
	//fs.unlinkSync( tempDir );

	//next();
};

