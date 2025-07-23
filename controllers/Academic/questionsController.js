const Exam = require("../../models/Academic/Exam");
const Question = require("../../models/Academic/Questions");
const asyncHandler = require("../../utils/asyncHandler");
const AppError = require("../../utils/appErrors");

exports.createQuestion = asyncHandler(async (req, res, next) => {
  const { question, optionA, optionB, optionC, optionD, correctAnswer } = req.body;
  // Find the exam
  const examFound = await Exam.findById(req.params.examId);
  if (!examFound) {
    return next(new AppError("Exam not found"));
  }
  // Check if question exists
  const questionExists = await Question.findOne({ question });
  if (questionExists) {
    return next(new AppError("Question already exists"));
  }
  // Create question
  const questionCreated = await Question.create({
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    correctAnswer
  });
  // Add the question into exam
  examFound.questions.push(questionCreated.id);
  // Save
  await examFound.save({ validateBeforeSave: false });

  res.status(201).json({
    status: "success",
    questionCreated,
  });
});

exports.getAllQuestions = asyncHandler(async (req, res, next) => {
  const questions = await Question.find();
  res.status(200).json({
    status: "success",
    questions,
  });
});

exports.getQuestion = asyncHandler(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next(new AppError('No Question with that id !', 404));
  }

  res.status(200).json({
    status: "success",
    question,
  });
});

exports.updateQuestion = asyncHandler(async (req, res, next) => {
  const { question, optionA, optionB, optionC, optionD, correctAnswer } = req.body;
  // Check if question exists
  const questionFound = await Question.findOne({ question });
  if (questionFound) {
    return next(new AppError("Question already exists"));
  }
  const updatedQuestion = await Question.findByIdAndUpdate(
    req.params.id,
    {
      question,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!updatedQuestion) {
    return next(new AppError('No Question with that id !', 404));
  }

  res.status(201).json({
    status: "success",
    updatedQuestion,
  });
});