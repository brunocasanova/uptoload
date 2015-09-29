var path = require( 'path' );
var multer = require( 'multer' );

var configs = require( './configs' );

var storage = multer.diskStorage({

	destination: function ( req, file, cb ){
		cb( null, file.dest.temp );
	},

	filename: function ( req, file, cb ){
		cb( null, file.filename );
	},

});

module.exports = multer({

	storage: storage,

	limits: {
		files: 1,
		fieldNameSize: 50,
		fields: 5,
		fileSize: 1024 * 1024,
    },

	fileFilter: function ( req, file, cb ){
		if(	! file || [ 'image/png', 'image/jpg', 'image/jpeg' ].indexOf( file.mimetype ) === -1 ){
			return cb( null, false );
		}
		
		var type = file.mimetype.replace( 'image', '' ).replace( '/', '' );

		// File extension
		type = type == 'jpeg' && 'jpg' || '' + type;
		file.extension = '.' + type;

		// File name
		file.filename = file.originalname.replace( /\W+/g, '_' ).toLowerCase() + '_' + Date.now();
		file.name = file.filename + file.extension;

		// File destinations
		var dir = configs.main.absolute &&
			path.join( __dirname, configs.main.dest ) ||
			path.join( configs.main.dest );

		file.dest = {};
		file.dest.base = dir;
		file.dest.temp = path.join( dir, configs.main.temp || 'temp' );
		file.streamPath = path.join( file.dest.temp, file.filename );

		for( var i in configs.options ){
			file.dest[ i ] = path.join( dir, i );
		}

		cb( null, true );
	},

});
