var path = require( 'path' );
var Promise = require( 'bluebird' );
var mkdirp = Promise.promisify( require( 'mkdirp' ) );
var configs = module.exports.configs = require( './configs' );

var multer = require( './multer' );
var multerMiddleware = module.exports.multerMiddleware = multer.single( 'imageToUpload' );

var dest = path.join( configs.main.dest );
var temp = path.join( dest, 'temp' );

module.exports.multerError = function ( req, res, next ){
	multerMiddleware( req, res, function ( err ) {
		if( err ) return console.log( 'MULTER: ', err.stack );
		next();
	});
};

return mkdirp( dest )
.then(function (){

	console.log( 'Creating directories at:', dest );

	console.log([
		'Directory',
		configs.main.dest
		.replace( '/', '' )
		.replace( '.', '' )
		.replace( '..', '' ),
		'created...'
	].join( '' ) );

	return mkdirp( temp );
})
.then(function(){
	console.log( 'Directory temp created...' );

	for( var i in configs.options ){
		console.log( 'Directory', configs.options[i].type, 'created...' );
		mkdirp( path.join( dest, configs.options[i].type ) );
	}

	console.log( 'Directories created!' );
})
.catch(function ( err ){
	console.log( err.stack );
});