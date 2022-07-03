const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const morgan = require('morgan');

const path = require('path');
const glob = require('glob');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const app = express();
const server = http.createServer(app);
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.set('view engine', 'pug');
const globalErrorHandler = require(`${__dirname}/controllers/errorController`);

app.use(express.json());
app.use(cookieParser());
// Data sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());
// Prevent parameter pollution
app.use(
	hpp({
		whitelist: [
			'duration',
			'rate',
			'price',
			'ratingsQuantity',
			'ratingsAverage',
			'difficulty',
		],
	}),
);
const filesApi = glob.sync(
	path.join(__dirname, '/routes/*.js').replace(/\\/g, '/'),
	{
		cwd: __dirname,
	},
);

console.log(filesApi);
for (var i = 0; i < filesApi.length; i++) {
	var fileName = path.basename(filesApi[i], '.js');
	console.log(fileName);
	app.use('/api/' + fileName, require(filesApi[i]));
}
app.use(globalErrorHandler);

module.exports = app;
