var fs = require( 'fs' );

module.exports = function ( req, tempDir ){	
	
	return {

		set: {
			headers: req.headers[ 'content-length' ],
			file: req.file,
			dest: req.file.dest,
			temp: tempDir,
			read: fs.createReadStream( tempDir ),
		},

		options: {
			
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

		},

	};
};