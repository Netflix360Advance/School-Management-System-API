const express = require("express");
const {
  getAllSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject
} = require("../../controllers/Academic/subjectsController");

const validationFunction = require('../../middleware/validationFunction');
const { subjectValidationSchema, subjectUpdateSchema } = require('../../validation/academics/subjectValidation');

const router = express.Router();

// REMOVE or COMMENT OUT this line:
// router.use(protect); // Middleware for authentication

router.post("/:programId", validationFunction(subjectValidationSchema), createSubject);
router.get('/', getAllSubjects);

router.route("/:id")
  .get(getSubject)
  .patch(validationFunction(subjectUpdateSchema), updateSubject)
  .delete(deleteSubject);

module.exports = router;
