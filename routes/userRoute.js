const express = require('express');

const tourroutes = require('../controllers/userController');

const router = express.Router();
router.route('/').get(tourroutes.getallusers).post(tourroutes.createuser);
router
  .route('/:id')
  .get(tourroutes.getuser)
  .patch(tourroutes.updateuser)
  .delete(tourroutes.deleteuser);

module.exports = router;
