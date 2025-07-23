const Student = require('../../models/Academic/Student')
const asyncHandler = require('../../utils/asyncHandler')
const AppError = require('../../utils/appErrors')
const ExamResult = require('../../models/Academic/ExamResults')
const Exam = require('../../models/Academic/Exam')

// Register a new student (admin action)
exports.adminRegisterStudent = asyncHandler(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;
  // Check if student already exists
  const studentFound = await Student.findOne({ email });
  if (studentFound) {
    return next(new AppError("student already exist"))
  }
  // Create student
  const newStudent = await Student.create({
    name,
    email,
    password,
    passwordConfirm
  });

  newStudent.password = undefined
  // Send student data
  res.status(201).json({
    status: "success",
    student: newStudent
  });
});

// LOGIN Student 
exports.loginStudent = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new AppError('Please provide valid email and password.', 400));
  }

  const student = await Student.findOne({ email }).select('+password');

  if (!student) {
    return next(new AppError('Invalid email or password', 401));
  }

  // Check if the provided password matches the stored hashed password
  const isPasswordCorrect = await student.passwordMatching(password, student.password);

  if (!isPasswordCorrect) {
    return next(new AppError('Invalid email or password', 401));
  }

  student.password = undefined;

  res.status(200).json({
    status: "success",
    student
  });
});

exports.getAllStudents = asyncHandler(async (req, res, next) => {
  const students = await Student.find();
  res.status(200).json({
    status: "success",
    students
  });
});

exports.getStudent = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;
  // Find the student
  const student = await Student.findById(studentId);
  if (!student) {
    return next(new AppError("Student not found"))
  }

  res.status(200).json({
    status: "success",
    student,
  });
});

// Now expects :studentId param instead of req.user.id
exports.getStudentProfile = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;
  const student = await Student.findById(studentId)
  if (!student) {
    return next(new AppError("student not found"))
  }
  res.status(200).json({
    status: "success",
    student,
  });
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

// Update student data except for password (now expects :studentId param)
exports.updateStudentData = asyncHandler(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  const { studentId } = req.params;
  const filteredBody = filterObj(req.body, 'name', 'email');

  const updatedStudent = await Student.findByIdAndUpdate(studentId, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    updatedStudent
  });
});

// UPDATE PASSWORD (now expects :studentId param)
exports.updateStudentPassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return next(new AppError('Please provide both values', 400))
  }

  const { studentId } = req.params;
  const student = await Student.findById(studentId).select("+password");
  const isPasswordCorrect = await student.passwordMatching(
    oldPassword,
    student.password
  );

  if (!isPasswordCorrect) {
    return next(new AppError("Your current password is incorrect", 401));
  }

  student.password = req.body.newPassword;
  student.passwordConfirm = req.body.passwordConfirm;
  await student.save();

  student.password = undefined;

  res.status(200).json({
    status: "success",
    student
  });
});

exports.adminUpdateStudent = asyncHandler(async (req, res, next) => {
  const {
    classLevels,
    academicYear,
    program,
    name,
    email,
    prefectName,
    isSuspended,
    isWithdrawn,
  } = req.body;

  // Find the student by id
  const studentFound = await Student.findById(req.params.studentId);
  if (!studentFound) {
    return next(new AppError("Student not found"))
  }

  // Update
  const studentUpdated = await Student.findByIdAndUpdate(
    req.params.studentId,
    {
      $set: {
        name,
        email,
        academicYear,
        program,
        prefectName,
        isSuspended,
        isWithdrawn,
      },
      $addToSet: {
        classLevels,
      },
    },
    {
      new: true,
    }
  );
  // Send response
  res.status(200).json({
    status: "success",
    studentUpdated,
  });
});

// Now expects :studentId param instead of req.user.id
exports.writeExam = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;
  // Get student
  const studentFound = await Student.findById(studentId);
  if (!studentFound) {
    return next(new AppError("Student not found"))
  }
  // Get exam
  const examFound = await Exam.findById(req.params.examId)
    .populate("questions")
    .populate("academicTerm");

  if (!examFound) {
    return (new AppError("Exam not found"))
  }
  // Get questions
  const { questions } = examFound;
  // Get students questions
  const studentAnswers = req.body.answers;

  // Check if student answered all questions
  if (studentAnswers.length !== questions.length) {
    return next(new AppError("You have not answered all the questions"))
  }

  // Check if student has already taken the exams
  const studentFoundInResults = await ExamResult.findOne({
    student: studentFound.id,
  });
  if (studentFoundInResults) {
    return next(new AppError("You have already written this exam"))
  }

  // Check if student is suspended/withdrawn
  if (studentFound.isWithdrawn || studentFound.isSuspended) {
    return next(new AppError("You are suspended/withdrawn, you can't take this exam"))
  }

  // Build report object
  let correctanswers = 0;
  let status = ""; //failed/passed
  let grade = 0;
  let remarks = "";
  let score = 0;
  let answeredQuestions = [];

  // Check for answers
  for (let i = 0; i < questions.length; i += 1) {
    const question = questions[i];
    if (question.correctAnswer === studentAnswers[i]) {
      correctanswers += 1;
      score += 1;
      question.isCorrect = true;
    }
  }
  // Calculate reports
  grade = (correctanswers / questions.length) * 100;
  answeredQuestions = questions.map(({ question, correctAnswer, isCorrect }) => ({
    question,
    correctAnswer,
    isCorrect,
  }));

  // Calculate status
  if (grade >= 50) {
    status = "Pass";
  } else {
    status = "Fail";
  }

  // Remarks
  if (grade >= 80) {
    remarks = "Excellent";
  } else if (grade >= 70) {
    remarks = "Very Good";
  } else if (grade >= 60) {
    remarks = "Good";
  } else if (grade >= 50) {
    remarks = "Fair";
  } else {
    remarks = "Poor";
  }

  // Generate Exam results
  const examResults = await ExamResult.create({
    student: studentFound.id,
    exam: examFound.id,
    grade,
    score,
    status,
    remarks,
    classLevel: examFound.classLevel,
    academicTerm: examFound.academicTerm,
    academicYear: examFound.academicYear,
    answeredQuestions: answeredQuestions,
  });
  // Push the results into
  studentFound.examResults.push(examResults.id);
  // Save
  await studentFound.save({ validateBeforeSave: false });

  // Promoting
  // Promote student to level 200
  if (
    examFound.academicTerm.name === "3th Term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 100"
  ) {
    studentFound.classLevels.push("Level 200");
    studentFound.currentClassLevel = "Level 200";
    studentFound.isPromotedToLevel200 = true;
    await studentFound.save({ validateBeforeSave: false });
    return
  }

  // Promote student to level 300
  if (
    examFound.academicTerm.name === "3th Term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 200"
  ) {
    studentFound.classLevels.push("Level 300");
    studentFound.currentClassLevel = "Level 300";
    studentFound.isPromotedToLevel300 = true
    await studentFound.save({ validateBeforeSave: false });
    return
  }

  // Promote student to level 400
  if (
    examFound.academicTerm.name === "3th Term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 300"
  ) {
    studentFound.classLevels.push("Level 400");
    studentFound.currentClassLevel = "Level 400";
    studentFound.isPromotedToLevel400 = true
    await studentFound.save({ validateBeforeSave: false });
    return
  }

  // Promote student to graduate
  if (
    examFound.academicTerm.name === "3th Term" &&
    status === "Pass" &&
    studentFound?.currentClassLevel === "Level 400"
  ) {
    studentFound.isGraduated = true;
    studentFound.yearGraduated = new Date();
    await studentFound.save({ validateBeforeSave: false });
    return
  }

  res.status(200).json({
    status: "success",
  });
});