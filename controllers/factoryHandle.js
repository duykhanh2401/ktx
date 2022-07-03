const AppError = require(`${__dirname}/../utils/appError`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const APIFeatures = require(`${__dirname}/../utils/apiFeatures`);
const getSlug = require('speakingurl');

exports.deleteOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const tour = await Model.findByIdAndDelete(req.params.id);

		if (!tour) {
			return new AppError('Not found document in Database', 400);
		}
		res.status(204).json({
			status: 'success',
		});
	});

exports.createOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const data = await Model.create(req.body);
		res.status(200).json({
			status: 'success',
			data,
		});
	});

exports.updateOne = (Model) =>
	catchAsync(async (req, res, next) => {
		const data = await Model.findById(req.params.id);
		if (data) {
			if (data.slug) {
				req.body.slug = getSlug(req.body.name);
				console.log(req.body);
			}

			const result = await Model.findByIdAndUpdate(req.params.id, req.body, {
				new: true,
				runValidators: true,
			});
			res.status(200).json({
				status: 'success',
				data: result,
			});
		}

		if (!data) {
			return next(AppError('Not found document in Database', 404));
		}
	});

exports.getOne = (Model, popOptions) =>
	catchAsync(async (req, res, next) => {
		let query = Model.findById(req.params.id);
		if (popOptions) query = query.populate(popOptions);
		const data = await query;
		if (!data) {
			return next(new AppError('Not found document in Database', 404));
		}

		res.status(200).json({
			status: 200,
			data,
		});
	});

exports.getAll = (Model, select) =>
	catchAsync(async (req, res, next) => {
		const features = new APIFeatures(Model.find(), req.query)
			.filter()
			.sort()
			.limitFields()
			.paginate();
		const data = await features.query.select(select);
		// 		console.log(features.query);

		// RESPONSE
		res.status(200).json({
			status: 200,
			result: data.length,
			data,
		});
	});
