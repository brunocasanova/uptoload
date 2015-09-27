var multer = require( 'multer' );
var path = require( 'path' );

var storage = multer.diskStorage({

	destination: function ( req, file, cb ){
		cb( null, file.dest.temp );
	},

	filename: function ( req, file, cb ){
		cb( null, file.filename );
	},

});

var mimetypes = [
	'image/png',
	'image/jpg',
	'image/jpeg',
];

module.exports = multer({

	storage: storage,

	limits: {
		files: 1,
		fieldNameSize: 50,
		fields: 5,
		fileSize: 1024 * 1024,
    },

	fileFilter: function ( req, file, cb ){
		if(	! file || mimetypes.indexOf( file.mimetype ) === -1 ) return cb( null, false );
		
		var dir = path.join( __dirname, 'uploads' ),
			type = file.mimetype.replace( 'image', '' ).replace( '/', '' );

		// File extension
		type = type == 'jpeg' && 'jpg' || '' + type;
		file.extension = '.' + type;

		// File name
		file.filename = file.originalname.replace( /\W+/g, '_' ).toLowerCase() + '_' + Date.now();
		file.name = file.filename + file.extension;

		// File destinations
		file.dest = {
			base: dir,
			temp: path.join( dir, 'temp' ),
			high: path.join( dir, 'high' ),
			low: path.join( dir, 'low' ),
			c64: path.join( dir, 'c64' ),
			c256: path.join( dir, 'c256' ),
		};

		cb( null, true );
	},

});