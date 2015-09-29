var fs = require( 'fs' );
var gm = require( 'gm' );
var Promise = require( 'bluebird' );
var util = require( 'findhit-util' );

module.exports = function ( req, configs ){
	var promise = [],
		read = fs.createReadStream( req.file.dest );

	return Promise.cast( configs )
	.then(function ( configOps ){
		var cO, oV, fK, sK, fV, sV;

		for( var i in configOps ){
			cO = configOps[i].options;

			for( var ii in cO ){
				oV = cO[ii];

				// options -> resize [ x, x ]
				if( util.is.Array( oV ) ){
					promise.push([ gm( read )[ii]( oV[0], oV[1] ), configOps[i] ]);
				}

				else if( util.is.String( oV ) || util.is.Number( + oV ) ){

					// simple options -> enhance() ex..
					if( Object.keys( cO ).length == 1 ){
						promise.push([ gm( read )[ii](), configOps[i] ]);
					}

					// chained options -> quality( 20 ).compress( 'JPEG' ) ex..
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

		return promise;

	});

};

