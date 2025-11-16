const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const checkAuth = require("../middleware/check-auth");
const checkRole = require("../middleware/check-role");
const CourseController = require("../controllers/courses");


// ✅ Ensure uploads folder exists
const uploadPath = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// ✅ Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Separate folder for videos and images if you want
    const isVideo = file.mimetype.startsWith("video/");
    const folder = isVideo ? "uploads/videos" : "uploads/images";

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueName =
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 200 * 1024 * 1024, // 200MB max file size
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/", "video/"];
    if (allowedTypes.some((type) => file.mimetype.startsWith(type))) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images and videos are allowed."));
    }
  },
});

// ✅ ROUTES

// Get all courses
router.get("/", checkAuth, CourseController.courses_get_all);

// ✅ Add course (image + video)
router.post(
  "/",
  checkAuth,
  upload.fields([
    { name: "courseImage", maxCount: 1 },
    { name: "courseVideo", maxCount: 1 },
  ]),
  CourseController.courses_create_course
);

// ✅ Instructor/Admin course creation
router.post(
  "/addcourse",
  checkAuth,
  checkRole(["admin", "instructor"]),
  upload.fields([
    { name: "courseImage", maxCount: 1 },
    { name: "courseVideo", maxCount: 1 },
  ]),
  CourseController.courses_create_course
);

// ✅ Get single course
router.get("/:courseId", checkAuth, CourseController.courses_get_course);

// ✅ Update course
router.patch("/:courseId", checkAuth, CourseController.course_updates_course);

// ✅ Delete course (admin only)
router.delete(
  "/:courseId",
  checkAuth,
  checkRole(["admin","instructor"]),
  CourseController.courses_delete_course
);



module.exports = router;
