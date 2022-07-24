const Contract = require(`../models/contractModels`);
const catchAsync = require(`../utils/catchAsync`);
const AppError = require(`../utils/appError`);
const factory = require(`./factoryHandle`);

// console.log(User);

exports.getAllContracts = factory.getAll(Contract);
exports.getContract = factory.getOne(Contract);
exports.createContract = factory.createOne(Contract);
exports.updateContract = factory.updateOne(Contract);
exports.deleteContract = factory.deleteOne(Contract);
