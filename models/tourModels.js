const mongoose = require('mongoose');

const TourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'tour must have a name'],
      unique: true,
    },
    difficulty: {
      type: String,
      required: [true, 'a tour must have a difficulty'],
    },
    maxGroup: Number,
    price: {
      type: Number,
      required: [true, 'a tour must have a price'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    priceDiscount: Number,
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: [true, ' a tour must have a description'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    duration: Number,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

TourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

const Tour = mongoose.model('Tour', TourSchema);

module.exports = Tour;
