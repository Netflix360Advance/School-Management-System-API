const asyncHandler = require("../../utils/asyncHandler");
const Program = require("../../models/Academic/Program");
const AppError = require("../../utils/appErrors");

exports.createProgram = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  // Check if exists
  const programFound = await Program.findOne({ name });
  if (programFound) {
    return next(new AppError("Program already exists"));
  }
  // Create
  const programCreated = await Program.create({
    name,
    description
  });

  res.status(201).json({
    status: "success",
    programCreated,
  });
});

exports.getAllPrograms = asyncHandler(async (req, res, next) => {
  const programs = await Program.find();
  res.status(200).json({
    status: "success",
    programs,
  });
});

exports.getProgram = asyncHandler(async (req, res, next) => {
  const program = await Program.findById(req.params.id);

  if (!program) {
    return next(new AppError('No program with that id', 404));
  }

  res.status(200).json({
    status: "success",
    program,
  });
});

exports.updateProgram = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  // Check name exists
  const programFound = await Program.findOne({ name });
  if (programFound) {
    return next(new AppError("Program already exists"));
  }
  const program = await Program.findByIdAndUpdate(
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

  if (!program) {
    return next(new AppError('No program with that id', 404));
  }

  res.status(200).json({
    status: "success",
    program,
  });
});

exports.deleteProgram = asyncHandler(async (req, res, next) => {
  const program = await Program.findByIdAndDelete(req.params.id);

  if (!program) {
    return next(new AppError('No program with that id', 404));
  }

  res.status(204).json({
    status: "success",
    data: null
  });
});