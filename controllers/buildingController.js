const Building = require(`../models/buildingModels`);
const catchAsync = require(`../utils/catchAsync`);
const AppError = require(`../utils/appError`);
const factory = require(`./factoryHandle`);

// console.log(User);

exports.getAllBuildings = factory.getAll(Building);
exports.getBuilding = factory.getOne(Building);
exports.createBuilding = factory.createOne(Building);
exports.updateBuilding = factory.updateOne(Building);
exports.deleteBuilding = factory.deleteOne(Building);
