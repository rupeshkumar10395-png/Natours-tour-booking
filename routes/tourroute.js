const express = require('express');
const tourroutes = require('../controllers/tourController');

const Router = express.Router();

Router.route('/top-5-tours').get(tourroutes.aliasfns, tourroutes.getallTours);
Router.route('/').get(tourroutes.getallTours).post(tourroutes.createtour);
Router.route('/get-stats').get(tourroutes.getTourStats);
Router.route('/monthly-data/:year').get(tourroutes.getMonthlyData);
Router.route('/:id')
  .get(tourroutes.gettour)
  .patch(tourroutes.updatetour)
  .delete(tourroutes.deletetour);

module.exports = Router;
