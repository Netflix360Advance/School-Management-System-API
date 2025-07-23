const ExamResults = require("../../models/Academic/ExamResults");
const Student = require("../../models/Academic/Student");
const asyncHandler = require("../../utils/asyncHandler");
const AppError = require("../../utils/appErrors");

// Check a student's exam result (expects :studentId and :id in params)
exports.checkExamResults = asyncHandler(async (req, res, next) => {
  const examResultId = req.params.id;
  const studentId = req.params.studentId;

  const studentFound = await Student.findById(studentId);
  if (!studentFound) {
    return next(new AppError("No Student Found"));
  }

  // Find the exam results
  const examResult = await ExamResults.findOne({
    student: studentFound.id,
    _id: examResultId,
  })
    .populate({
      path: "exam",
      populate: {
        path: "questions",
      },
    })
    .populate("classLevel")
    .populate("academicTerm")
    .populate("academicYear");

  if (!examResult) {
    return next(new AppError("Exam result not found"));
  }

  // Check if exam is published
  if (examResult.isPublished === false) {
    return next(new AppError("Exam result is not available, check out later"));
  }

  res.json({
    status: "success",
    data: examResult,
    student: studentFound,
  });
});

// Get all exam results
exports.getAllExamResults = asyncHandler(async (req, res, next) => {
  const results = await ExamResults.find().select("exam").populate("exam");
  res.status(200).json({
    status: "success",
    data: results,
  });
});

// Toggle exam result publish status (no admin logic)
exports.toggleExamResult = asyncHandler(async (req, res, next) => {
  const examResult = await ExamResults.findById(req.params.id);
  if (!examResult) {
    return next(new AppError("Exam result not found"));
  }
  const publishResult = await ExamResults.findByIdAndUpdate(
    req.params.id,
    {
      isPublished: req.body.publish,
    },
    {
      new: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: publishResult,
  });
});