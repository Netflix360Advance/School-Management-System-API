const express = require("express");
const {
  createQuestion,
  getAllQuestions,
  getQuestion,
  updateQuestion,
} = require("../../controllers/Academic/questionsController");

const { questionValidationSchema, questionUpdateSchema } = require("../../validation/academics/questionsValidation");

const validationFunction = require('../../middleware/validationFunction');

const router = express.Router();

// REMOVE or COMMENT OUT this line:
// router.use(protect);

router.post("/:examId", validationFunction(questionValidationSchema), createQuestion);
router.get("/", getAllQuestions);
router.route('/:id').get(getQuestion).patch(validationFunction(questionUpdateSchema), updateQuestion);

module.exports = router;
