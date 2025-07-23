const AcademicYear = require('../../models/Academic/AcademicYear')
const asyncHandler = require('../../utils/asyncHandler')
const AppError = require('../../utils/appErrors')

// CREATE Academic Year (no admin logic)
exports.CreateAcademicYear = asyncHandler(async (req, res, next) => {
  const { name, fromYear, toYear } = req.body

  const academicYearFound = await AcademicYear.findOne({ name })
  if (academicYearFound) {
    return next(new AppError("Academic year already exist!", 400))
  }

  const newAcademicYear = await AcademicYear.create({ name, fromYear, toYear })

  res.status(201).json({
    status: "success",
    newAcademicYear
  })
})

exports.getAllAcademicYears = asyncHandler(async (req, res, next) => {
  const academicYears = await AcademicYear.find()
  res.status(200).json({
    status: "success",
    academicYears
  })
})

exports.getAcademicYear = asyncHandler(async (req, res, next) => {
  const academicYear = await AcademicYear.findById(req.params.id)
  if (!academicYear) {
    return next(new AppError("No Academic year with that id !", 404))
  }
  res.status(200).json({
    status: "success",
    academicYear
  })
})

exports.updateAcademicYear = asyncHandler(async (req, res, next) => {
  const { name, fromYear, toYear } = req.body

  // Avoid changing name to existing academic year
  const academicYearFound = await AcademicYear.findOne({ name })
  if (academicYearFound) {
    return next(new AppError("Academic year already exist!", 400))
  }

  const updatedAcademicYear = await AcademicYear.findByIdAndUpdate(
    req.params.id,
    { name, fromYear, toYear },
    { new: true, runValidators: true }
  )

  if (!updatedAcademicYear) {
    return next(new AppError("No academic year with that id !", 404))
  }

  res.status(201).json({
    status: "success",
    updatedAcademicYear
  })
})

exports.deleteAcademicYear = asyncHandler(async (req, res, next) => {
  const academicYear = await AcademicYear.findByIdAndDelete(req.params.id)
  if (!academicYear) {
    return next(new AppError("No academic year with that id !", 404))
  }
  res.status(204).json({
    status: "success",
    data: null
  })
})