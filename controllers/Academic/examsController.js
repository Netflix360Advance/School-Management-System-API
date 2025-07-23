const Exam = require("../../models/Academic/Exam");
const asyncHandler = require("../../utils/asyncHandler");
const AppError = require("../../utils/appErrors");

// Create a new exam (public)
exports.createExam = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    subject,
    program,
    academicTerm,
    duration,
    examDate,
    examTime,
    examType,
    academicYear,
    classLevel,
  } = req.body;

  // Check if exam already exists
  const examExists = await Exam.findOne({ name });
  if (examExists) {
    return next(new AppError("Exam already exists", 400));
  }

  // Create the exam
  const newExam = await Exam.create({
    name,
    description,
    academicTerm,
    academicYear,
    classLevel,
    duration,
    examDate,
    examTime,
    examType,
    subject,
    program
  });

  res.status(201).json({
    status: "success",
    newExam,
  });
});

// Get all exams
exports.getAllExams = asyncHandler(async (req, res, next) => {
  const exams = await Exam.find();
  res.status(200).json({
    status: "success",
    exams,
  });
});

// Get a specific exam
exports.getExam = asyncHandler(async (req, res, next) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    return next(new AppError('No exams with that id!', 404));
  }

  res.status(200).json({
    status: "success",
    exam,
  });
});

// Update an exam (public)
exports.updateExam = asyncHandler(async (req, res, next) => {
  const {
    name,
    description,
    subject,
    program,
    academicTerm,
    duration,
    examDate,
    examTime,
    examType,
    academicYear,
    classLevel,
  } = req.body;

  // Check if exam name already exists
  const examFound = await Exam.findOne({ name });
  if (examFound) {
    return next(new AppError("Exam already exists", 400));
  }

  // Update the exam
  const updatedExam = await Exam.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      subject,
      program,
      academicTerm,
      duration,
      examDate,
      examTime,
      examType,
      academicYear,
      classLevel
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    updatedExam,
  });
});