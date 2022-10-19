const PageController = require.main.require('./PageController.js');
const testdata = require.main.require('./testdata.js');

async function configureRoutes(app) {
	
	app.get('/', async (req, res) => {
		console.log('/')
		let locals = {};
		res.render('index', locals);
	});

	app.post('/page', async (req, res) => {
		console.log({
			destination : parseInt(req.body.destination),
			current : parseInt(req.session.pagecontroller?.current)
		});
		new PageController(req, { array : testdata });
		console.log({ controller : req.session.pagecontroller.current });
		let locals = { title : 'Data' };
		locals = { ...locals, ...req.session.pagecontroller };
		res.render('table', locals);
	});

}

module.exports = configureRoutes;