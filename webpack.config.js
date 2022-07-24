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

// const configView = {
// 	entry: './public/js/view/index.js', // File đầu vào
// 	output: {
// 		// File đầu ra
// 		filename: 'bundle.js', // Tên file đầu ra
// 		path: path.resolve(__dirname, 'public/js/view'), // Nơi chưa file đầu ra
// 	},
// 	devtool: 'cheap-module-source-map',
// };
module.exports = [configAdmin];
