var gm = require( 'gm' );
var Promise = require( 'bluebird' );

var util = require( 'findhit-util' );

module.exports = function ( confs ){
	var promise = [],
		read = confs.set.read,
		configs = confs.options;

	return new Promise(function ( fullfil, reject ){
		// logic to directories
		fullfil();
	})
	.then(function (){
		var cO, oV, fK, sK, fV, sV;

		for( var i in configs ){
			cO = configs[i].options;

			for( var ii in cO ){
				oV = cO[ii];

				// options -> resize [ x, x ]
				if( util.is.Array( oV ) ){
					promise.push([ gm( read )[ii]( oV[0], oV[1] ), configs[i] ]);
				}

				else if( util.is.String( oV ) || util.is.Number( + oV ) ){

					// simple options -> enhance() ex..
					if( Object.keys( cO ).length == 1 ){
						promise.push([ gm( read )[ii](), configs[i] ]);
					}

					// chained options -> quality( 20 ).compress( 'JPEG' ) ex..
					else if( Object.keys( cO ).length == 2 ){
						fK = Object.keys( cO )[0];
						sK = Object.keys( cO )[1];

						fV = cO[ fK ];
						sV = cO[ sK ];

						promise.push([ gm( read )[ fK ]( fV )[ sK ]( sV ), configs[i] ]);
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

