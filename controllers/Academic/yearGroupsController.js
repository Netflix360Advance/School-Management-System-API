const asyncHandler = require("../../utils/asyncHandler");
const YearGroup = require("../../models/Academic/YearGroup");
const AppError = require("../../utils/appErrors");

exports.createYearGroup = asyncHandler(async (req, res, next) => {
  const { name, description, academicYear } = req.body;
  // Check if exists
  const yearGroupFound = await YearGroup.findOne({ name });
  if (yearGroupFound) {
    return next(new AppError("YearGroup already exists"));
  }
  // Create
  const yearGroupCreated = await YearGroup.create({
    name,
    description,
    academicYear
  });

  res.status(201).json({
    status: "success",
    yearGroupCreated,
  });
});

exports.getAllYearGroups = asyncHandler(async (req, res, next) => {
  const yearGroups = await YearGroup.find();
  res.status(200).json({
    status: "success",
    yearGroups,
  });
});

exports.getYearGroup = asyncHandler(async (req, res, next) => {
  const yearGroup = await YearGroup.findById(req.params.id);

  if (!yearGroup) {
    return next(new AppError('No YearGroup with that id', 404));
  }

  res.status(200).json({
    status: "success",
    yearGroup,
  });
});

exports.updateYearGroup = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  // Check name exists
  const yearGroupFound = await YearGroup.findOne({ name });
  if (yearGroupFound) {
    return next(new AppError("YearGroup already exists"));
  }
  const yearGroup = await YearGroup.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!yearGroup) {
    return next(new AppError('No YearGroup with that id', 404));
  }

  res.status(200).json({
    status: "success",
    yearGroup,
  });
});

exports.deleteYearGroup = asyncHandler(async (req, res, next) => {
  const yearGroup = await YearGroup.findByIdAndDelete(req.params.id);

  if (!yearGroup) {
    return next(new AppError('No YearGroup with that id', 404));
  }

  res.status(204).json({
    status: "success",
    data: null
  });
});