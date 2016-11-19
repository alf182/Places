import Request from "request";
import express from "express";
import hbs from "express-handlebars";

//define gloabl app, server and port
const app = express();
const key = "AIzaSyAZpVtBj2VZZgkCkQGjCkPvkkXQkYuBAQM";
// var googlePlacesUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?key="+key+"&types=cafe";
const radius_const = 220; //distancia en metros, radio maximo 50 000 metros
const position = "-16.495437,-68.1371807";

//define templates
app.engine('.hbs', hbs({extname:'.hbs', layoutsDir: __dirname+'/view/'}));
app.set('views', 'view/');
app.set('view engine','.hbs');

//middleware
app.use('/static',express.static('public'));

app.get('/', (req, res) => {

    var data = {
        project: "BNB 360 Experience",
        title: "hello 360 Experience"
    };
    res.render('index', data);
});

//****************************************************************************************
//NOTA IMPORTANTE
//****************************************************************************************
//Google Places API Web Service se debe usar en aplicaciones de servidor, en este ejemplo
//usaremos nodejs como servidor para representar la inforamción de Google Places de con
//diseño custom e información extra
//****************************************************************************************

app.get('/search/', (req, res) => {
	var googlePlacesUrl = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?";
	var location;
	var name;
	var radius;
	if(req.query.location === undefined){
		location = position;
	}
	else{
		location = req.query.location;
	}

	googlePlacesUrl = googlePlacesUrl+"&location="+location;

	if(req.query.radius === undefined)
		radius = radius_const;
	else
		radius = req.query.radius;

	googlePlacesUrl = googlePlacesUrl+"&radius="+radius;

	googlePlacesUrl = googlePlacesUrl+"&types=cafe|restaurant|grocery_or_supermarket|bar|night_club";

	if(req.query.name !== undefined){
		name = req.query.name;
		googlePlacesUrl = googlePlacesUrl+"&name="+name;
	}

	googlePlacesUrl = googlePlacesUrl+"&key="+key;

	// console.log(googlePlacesUrl);
	
	/*Google Places API Call*/
	Request.get({url: googlePlacesUrl, json: true}, function(err, resp, respBody) {
		if(err)
			res.sendStatus(500).json(err);

		res.json(respBody);
	});
	/*End*/
});

app.listen(3000,() => console.log("Places iniciado en el puerto 3000") );