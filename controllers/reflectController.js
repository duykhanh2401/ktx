const Reflect = require(`../models/reflectModels`);
const catchAsync = require(`../utils/catchAsync`);
const AppError = require(`../utils/appError`);
const factory = require(`./factoryHandle`);

// console.log(User);

exports.getAllReflects = factory.getAll(Reflect);
exports.getReflect = factory.getOne(Reflect);
exports.createReflect = factory.createOne(Reflect);
exports.updateReflect = factory.updateOne(Reflect);
exports.deleteReflect = factory.deleteOne(Reflect);
