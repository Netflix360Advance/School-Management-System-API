const express = require("express");
const {
  getAllYearGroups,
  getYearGroup,
  createYearGroup,
  updateYearGroup,
  deleteYearGroup
} = require("../../controllers/Academic/yearGroupsController");

const validationFunction = require('../../middleware/validationFunction');
const { yearGroupValidationSchema, yearGroupUpdateSchema } = require('../../validation/academics/yearGroupValidation');

const router = express.Router();

// REMOVE or COMMENT OUT this line:
// router.use(protect); // Middleware for authentication

router.route("/")
  .post(validationFunction(yearGroupValidationSchema), createYearGroup)
  .get(getAllYearGroups);

router.route("/:id")
  .get(getYearGroup)
  .patch(validationFunction(yearGroupUpdateSchema), updateYearGroup)
  .delete(deleteYearGroup);

module.exports = router;
