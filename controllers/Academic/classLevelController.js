const asyncHandler = require("../../utils/asyncHandler");
const ClassLevel = require("../../models/Academic/ClassLevel");
const AppError = require("../../utils/appErrors");

exports.createClassLevel = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  // Check if exists
  const classFound = await ClassLevel.findOne({ name });
  if (classFound) {
    return next(new AppError("Class already exists"))
  }
  // Create
  const classCreated = await ClassLevel.create({
    name,
    description
  });

  res.status(201).json({
    status: "success",
    classCreated,
  });
});

exports.getAllClassLevel = asyncHandler(async (req, res, next) => {
  const classes = await ClassLevel.find();
  res.status(200).json({
    status: "success",
    classes,
  });
});

exports.getClassLevel = asyncHandler(async (req, res, next) => {
  const classLevel = await ClassLevel.findById(req.params.id);

  if (!classLevel) {
    return next(new AppError('No class level with that id !'))
  }

  res.status(200).json({
    status: "success",
    classLevel,
  });
});

exports.updateClassLevel = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  // Check name exists
  const classFound = await ClassLevel.findOne({ name });
  if (classFound) {
    return next(new AppError("Class already exists"))
  }
  const classLevel = await ClassLevel.findByIdAndUpdate(
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

  if (!classLevel) {
    return next(new AppError('No class level with that id !'))
  }

  res.status(200).json({
    status: "success",
    classLevel,
  });
});

exports.deleteClassLevel = asyncHandler(async (req, res, next) => {
  const classLevel = await ClassLevel.findByIdAndDelete(req.params.id);

  if (!classLevel) {
    return next(new AppError('No class level with that id !'))
  }

  res.status(204).json({
    status: "success",
    data: null
  });
});