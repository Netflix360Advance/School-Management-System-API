const express = require("express");
// const { protect, restrictTo } = require("../../controllers/staff/adminController");
const {
  checkExamResults,
  getAllExamResults,
} = require("../../controllers/Academic/examResultsController");

const router = express.Router();

// REMOVE or COMMENT OUT this line:
// router.use(protect);

router.get("/", getAllExamResults);

router.get("/:id/checking", checkExamResults);


module.exports = router;