const Tour = require('../models/tourModels');
const API = require('../utils/apifeatures');

exports.aliasfns = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  next();
};

exports.getallTours = async (req, res) => {
  try {
    const features = new API(Tour.find(), req.query)
      .filter()
      .sort()
      .paginate()
      .limitfields();
    const tours = await features.query;
    res.json({
      status: 'success',
      results: tours.length,
      tours: tours,
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      error: err,
    });
  }
};
exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.7 } } },
      {
        $group: {
          _id: '$difficulty',
          numofTours: { $sum: 1 },
          numofRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      {
        $sort: { avgPrice: 1 },
      },
    ]);
    res.status(200).json({
      status: 'success',
      results: stats.length,
      tours: stats,
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
      error: err,
    });
  }
};

exports.gettour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      status: 'error',
    });
  }
};

exports.createtour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(200).json({
      status: 'Done',
      body: req.body,
    });
  } catch (err) {
    res.status(400).json({
      status: ' fail',
      message: err,
    });
  }
};
exports.updatetour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!tour) {
      return res.status(404).json({
        status: 'fail',
        message: 'No tour found with that ID',
      });
    }
    res.status(200).json({
      status: 'success',
      data: {
        tour: tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: ' fail',
      message: err,
    });
  }
};

exports.deletetour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: ' fail',
      message: err,
    });
  }
};
exports.getMonthlyData = async (req, res) => {
  try {
    const year = req.params.year * 1;
    const data = await Tour.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numsTours: { $sum: 1 },
          Tours: { $push: '$name' },
        },
      },
      { $addFields: { month: '$_id' } },
      { $project: { _id: 0 } },
    ]);
    res.status(200).json({
      status: 'success',
      data: data,
    });
  } catch (err) {
    res.status(404).json({
      status: ' fail',
      message: err,
    });
  }
};
