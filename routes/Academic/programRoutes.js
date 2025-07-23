const express = require("express");
const {
  getAllPrograms,
  getProgram,
  createProgram,
  updateProgram,
  deleteProgram
} = require("../../controllers/Academic/ProgramsController");

const { programValidationSchema, programUpdateSchema } = require("../../validation/academics/programValidation");

const validation = require("../../middleware/validationFunction");

const router = express.Router();

// REMOVE or COMMENT OUT this line:
// router.use(protect);

router.route("/")
  .post(validation(programValidationSchema), createProgram)
  .get(getAllPrograms);

router.route("/:id")
  .get(getProgram)
  .patch(validation(programUpdateSchema), updateProgram)
  .delete(deleteProgram);

module.exports = router;
