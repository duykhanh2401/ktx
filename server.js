const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/config.env` });
const app = require('./app');

const DB = process.env.DATABASE;
process.on('uncaughtException', (err) => {
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
mongoose
	.connect(DB, {
		// .connect(process.env.DATABASE_LOCAL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		console.log('DB connections successful!!!');
	});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
	console.log(`App running on port http://localhost:${port}`);
	console.log(`Admin Dashboard running on port http://localhost:${port}/admin`);
});

process.on('unhandledRejection', (err) => {
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
