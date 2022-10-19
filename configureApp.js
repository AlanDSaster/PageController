const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const fs = require('fs');
const handlebars = require('express-handlebars');
const path = require('path');
const session = require('express-session');

async function configureApp(app) {
	let directory;
	app.use(cors());
	app.use(express.json());
	app.use(cookieParser());
	app.use(express.urlencoded({ extended : true }));
	app.use(bodyParser.urlencoded({ extended: false }));
	directory = path.join(require.main.path, './public');
	app.use(express.static(directory));
	app.set('trust proxy', (ip) => {
		const trustedIPs = require('./trusted_ip_addresses.js');
		if( trustedIPs.includes(ip) ) return true;
		return false;
	});
	app.use(
		session({
			secret 				: process.env.SESSION_SECRET,
			saveUninitialized	: true,
			/* 24 hours = 1000 ms * 60 secs * 60 mins * 24 hrs */
			cookie				: { maxAge : 1000 * 60 * 60 * 24 },
			resave				: true
		})
	);
	app.set('views', path.join(path.join(require.main.path, './views')));
	app.set('view engine', 'hbs');
	app.engine('hbs', handlebars.engine({
		extname: 'hbs',
		defaultLayout: 'layout',
		layoutsDir: path.join(require.main.path, './views/layouts/'),
		helpers : {
			json : function(context) {
				return JSON.stringify(context, null, '\t').replaceAll('  ', ' ');
			},
			jsonOneLine : function(context) {
				return JSON.stringify(context);
			}
		}
	}));
}

module.exports = configureApp;