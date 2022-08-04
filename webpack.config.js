const path = require('path');

const configAdmin = {
	entry: './public/js/admin/index.js', // File đầu vào
	output: {
		// File đầu ra
		filename: 'bundle.js', // Tên file đầu ra
		path: path.resolve(__dirname, 'public/js/admin'), // Nơi chưa file đầu ra
	},
	devtool: 'cheap-module-source-map',
};

const configStudent = {
	entry: './public/js/student/index.js', // File đầu vào
	output: {
		// File đầu ra
		filename: 'bundle.js', // Tên file đầu ra
		path: path.resolve(__dirname, 'public/js/student'), // Nơi chưa file đầu ra
	},
	devtool: 'cheap-module-source-map',
};
module.exports = [configAdmin, configStudent];
