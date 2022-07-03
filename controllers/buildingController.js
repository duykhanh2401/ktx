const Building = require(`${__dirname}/../models/buildingModels`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);
const factory = require(`${__dirname}/factoryHandle`);

// console.log(User);

exports.getAllCategories = factory.getAll(Building);
exports.getBuilding = factory.getOne(Building);
exports.createBuilding = factory.createOne(Building);
exports.updateBuilding = factory.updateOne(Building);
exports.deleteBuilding = factory.deleteOne(Building);
