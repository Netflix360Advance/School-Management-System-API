const asyncHandler = require("../../utils/asyncHandler");
const AcademicTerm = require("../../models/Academic/AcademicTerm");
const AppError = require("../../utils/appErrors");

// CREATE Academic Term (no admin logic)
exports.createAcademicTerm = asyncHandler(async (req, res, next) => {
  const { name, description, duration } = req.body;
  // Check if exists
  const academicTermFound = await AcademicTerm.findOne({ name });
  if (academicTermFound) {
    return next(new AppError("Academic term already exists"));
  }
  // Create
  const newAcademicTerm = await AcademicTerm.create({
    name,
    description,
    duration
  });
  res.status(201).json({
    status: "success",
    newAcademicTerm,
  });
});

exports.getAcademicTerms = asyncHandler(async (req, res, next) => {
  const academicTerms = await AcademicTerm.find();
  res.status(200).json({
    status: "success",
    academicTerms,
  });
});

exports.getAcademicTerm = asyncHandler(async (req, res, next) => {
  const academicTerm = await AcademicTerm.findById(req.params.id);
  if (!academicTerm) {
    return next(new AppError("No Academic term with that id !", 404))
  }
  res.status(200).json({
    status: "success",
    academicTerm
  });
});

exports.updateAcademicTerm = asyncHandler(async (req, res, next) => {
  const { name, description, duration } = req.body;
  // Check name exists
  const academicTermFound = await AcademicTerm.findOne({ name });
  if (academicTermFound) {
    return next(new AppError("Academic term already exists"));
  }
  const academicTerm = await AcademicTerm.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      duration
    },
    {
      new: true,
      runValidators: true
    }
  );
  if (!academicTerm) {
    return next(new AppError("No Academic term with that id !", 404))
  }
  res.status(200).json({
    status: "success",
    academicTerm
  });
});

exports.deleteAcademicTerm = asyncHandler(async (req, res, next) => {
  const academicTerm = await AcademicTerm.findByIdAndDelete(req.params.id);
  if (!academicTerm) {
    return next(new AppError("No Academic term with that id !", 404))
  }
  res.status(204).json({
    status: "success",
    data: null
  });
});