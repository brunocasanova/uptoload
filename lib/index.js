var express = require( 'express' );
var app = module.exports = express();

var bodyParser = require( 'body-parser' );
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );


// Middleware
var uptoloadConfig = require( './middleware' ).config;
app.use( uptoloadConfig );

var uptoload = require( './middleware' );


app.post( '/upload', uptoload );


function uploadCatch( req, res, next ){
	itu( req, res, function ( err ) {
		if( err ){
			console.log( err.stack );
			return;
		}

		next();
	});
}


app.get( '/debug', function ( req, res, next ){
	res.redirect( req.protocol + '://' + req.hostname + ':' + 8080 + '/debug?port=5858' );
});

app.get( [ '/', 'home ', 'upload' ], function ( req, res, next ){
	var body = [], bodyParse;

	if( req.uploaded ) body.push( '<h3>File uploaded! Select another file please!</h3>' );
	else body.push( '<a href="/debug" target="_blank">DEBUG</a> </p>' );

	body.push( '<form enctype="multipart/form-data" action="/upload" method="post">' );
	body.push( '<input type="file" name="imageToUpload"  accept="image/*" />' );
	body.push( '<input type="submit" value="upload" name="submit">' );
	body.push( '</form>' );

	bodyJoin = body.join( '' );

	res.send( bodyJoin ).end();
});

app.use(function ( req, res, next ){
	res.status( 400 );
	res.send( /*'<a href="/">Home</a> 404 Page not found!'*/ ).end();
});

app.use(function ( err, req, res, next ){
	res.status( 500 );
	res.send( /*'<a href="/">Home</a> 500 Internal server error:<br /><p>' +*/ err.stack /*+ '</p>'*/ ).end();
});

app.listen( 3000, function (){
	console.log( 'Server running at http://localhost:3000' );
});