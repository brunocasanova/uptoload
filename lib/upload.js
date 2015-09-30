var fs = require( 'fs' );
var path = require( 'path' );
var gm = require( 'gm' );
var Promise = require( 'bluebird' );
var util = require( 'findhit-util' );

module.exports = function ( req, configs ){
	var promise = [],
		readPath = path.join( req.file.dest.temp, req.file.filename ),
		read = fs.createReadStream( readPath );

	return Promise.cast( configs.options )
	.then(function ( configOps ){
		var cO, oV, fK, sK, fV, sV;

		for( var i in configOps ){
			cO = configOps[i].options || false;			

			// Simple upload without options
			if( ! cO || Object.keys( cO ).length < 1 ){
				promise.push([ gm( read ), configOps[i] ]);
			}

			else{

				for( var ii in cO ){
					oV = cO[ii];

					// Options with 2 args
					// ex -> resize [ x, x ]
					if( util.is.Array( oV ) ){
						promise.push([ gm( read )[ii]( oV[0], oV[1] ), configOps[i] ]);
					}

					else if( util.is.String( oV ) || util.is.Number( + oV ) ){

						//  Options without args 
						//  ex -> enhance() ex...
						if( Object.keys( cO ).length == 1 ){
							promise.push([ gm( read )[ii](), configOps[i] ]);
						}

						// Options chained with args
						// ex -> quality( 20 ).compress( 'JPEG' )
						else if( Object.keys( cO ).length == 2 ){
							fK = Object.keys( cO )[0];
							sK = Object.keys( cO )[1];

							fV = cO[ fK ];
							sV = cO[ sK ];

							promise.push([ gm( read )[ fK ]( fV )[ sK ]( sV ), configOps[i] ]);
						}

						else{
							throw new Error( 'Wrong function type!' );
						}

					}

					else{
						throw new Error( 'Wrong option type!' );
					}

				}
			}

		}

		return promise;

	});

};





