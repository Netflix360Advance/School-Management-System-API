const express = require("express");
const {
  createExam,
  getAllExams,
  getExam,
  updateExam,
} = require("../../controllers/Academic/examsController");

const { examValidationSchema, examUpdateSchema } = require("../../validation/academics/examValidation");
const validationFunction = require("../../middleware/validationFunction");

const router = express.Router();

// REMOVE or COMMENT OUT this line:
// router.use(protect);

router.route("/")
  .post(validationFunction(examValidationSchema), createExam)
  .get(getAllExams);

router.route("/:id")
  .get(getExam)
  .patch(validationFunction(examUpdateSchema), updateExam);

module.exports = router;
