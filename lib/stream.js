var fs = require( 'fs' );
var path = require( 'path' );

var Promise = require( 'bluebird' );

module.exports = function ( req, promise ){

	return Promise.all( promise )
	.then(function ( streamFns ){
		
		var cS, type,

			total = req.headers[ 'content-length' ],
			perc,
			out = 0,
			progress = 0;

		for( var i in streamFns ){
			type = streamFns[i][1].type;

			streamFns[i][0].stream(function ( err, stdout, stderr ){

				// console load bar in high only ...
				if( type == 'high' ){

					stdout.on( 'data', function ( chunk ){
						console.log( 'percent complete: ' + out + '%' );

						progress += chunk.length;
						perc = parseInt( ( progress / total ) * 100 );

						out = perc > 100 && 99 || perc;

					});

					stdout.on( 'end', function (){
						console.log( 'percent complete: 100%' );
					});

				}

				cS = fs.createWriteStream( path.join( req.file.dest[ type ], type + '_' + req.file.name ) );

				stdout.pipe( cS );
			});
		}

	});

}