const express = require("express");
const {
  adminRegisterStudent,
  loginStudent,
  getAllStudents,
  getStudent,
  getStudentProfile,
  updateStudentData,
  updateStudentPassword,
  adminUpdateStudent,
  writeExam
} = require("../../controllers/students/studentController");

// const { protect, restrictTo } = require("../../controllers/staff/adminController");

// Import Student Validation Schemas
const {
  studentRegisterSchema,
  updateStudentProfileSchema,
  studentPasswordSchema,
} = require("../../validation/academics/studentValidation");

const validationFunction = require("../../middleware/validationFunction");

const router = express.Router();

// Public routes
router.post("/login", loginStudent);

// REMOVE or COMMENT OUT this line:
// router.use(protect); // Middleware for authentication

// Student-specific routes
router.patch("/updateMyPassword", validationFunction(studentPasswordSchema), updateStudentPassword);
router.get("/profile", getStudentProfile);
router.patch("/:studentId/update", validationFunction(updateStudentProfileSchema), updateStudentData);
router.post("/exam/:examId/write", writeExam);

// Admin routes
router.post("/signup-student", validationFunction(studentRegisterSchema), adminRegisterStudent);
router.get("/", getAllStudents);
router.get("/:studentId", getStudent);
router.patch("/:studentId/update/admin", adminUpdateStudent);

module.exports = router;