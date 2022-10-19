require('dotenv').config();
const cmd = require.main.require('./cmd.js');
cmd('cls');
const express = require('express');
const app = express();
const configureApp = require.main.require('./configureApp.js');
const configureRoutes = require.main.require('./configureRoutes.js');

app.listen(process.env.PORT, async () => {
	await configureApp(app);
	await configureRoutes(app);
	console.log(`listening on port ${process.env.PORT}`);
});