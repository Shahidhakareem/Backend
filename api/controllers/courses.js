const mongoose = require("mongoose");
const Course = require("../models/course");

exports.courses_get_all = async (req, res, next) => {
  try {
    const docs = await Course.find()
      .select("name price _id description courseImage courseVideo")
      .exec();

    const response = {
      count: docs.length,
      courses: docs.map((doc) => {
        let imageUrl = "";
        if (doc.courseImage) {
          const cleanedPath = doc.courseImage.replace(
            /^.*uploads[\\/]/,
            "uploads/"
          );
          imageUrl = `http://localhost:3001/${cleanedPath.replace(/\\/g, "/")}`;
        }
        let videoUrl = "";
        if (doc.courseVideo) {
          const cleaned = doc.courseVideo.replace(
            /^.*uploads[\\/]/,
            "uploads/"
          );
          videoUrl = `http://localhost:3001/${cleaned.replace(/\\/g, "/")}`;
        }

        return {
          name: doc.name,
          price: doc.price,
          _id: doc._id,
          description: doc.description,
          courseImage: imageUrl,
          courseVideo: videoUrl,
          request: {
            type: "GET",
            url: `http://localhost:3001/courses/${doc._id}`,
          },
        };
      }),
    };

    res.status(200).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

exports.courses_create_course = async (req, res, next) => {
  try {
    const imageFile = req.files?.courseImage?.[0];
    const videoFile = req.files?.courseVideo?.[0];

    const course = new Course({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      courseImage: imageFile ? imageFile.path.replace(/\\/g, "/") : "",
      courseVideo: videoFile ? videoFile.path.replace(/\\/g, "/") : "",
    });

    const result = await course.save();

    res.status(201).json({
      message: "Created course successfully",
      createdCourse: {
        name: result.name,
        description: req.body.description,
        price: result.price,
        _id: result._id,
        courseImage: `http://localhost:3001/${result.courseImage}`,
        courseVideo: result.courseVideo
          ? `http://localhost:3001/${result.courseVideo}`
          : null,
      },
    });
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.courses_get_course = (req, res, next) => {
  const id = req.params.courseId;
  Course.findById(id)
    .select("name price _id description courseImage courseVideo")

    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          course: doc,
          request: {
            type: "GET",
            url: "http://localhost:3001/courses",
          },
        });
      } else {
        res
          .status(404)
          .json({ message: " No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};
exports.course_updates_course = async (req, res) => {
  try {
    const id = req.params.courseId;

    const updated = await Course.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      message: "Course updated",
      updatedCourse: updated
    });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.courses_delete_course = (req, res, next) => {
  const id = req.params.courseId;
  try {
    const deleted = Course.findByIdAndDelete(id).exec();
    if (!deleted) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json({
      message: "Course deleted successfully",
      deletedProduct: deleted,
      request: {
        type: "POST",
        url: "http://localhost:3001/courses/",
        body: { name: "String", price: "Number" },
      },
    });
  } catch (err) {
    console.error("DELETE /courses/:id error:", err);
    res.status(500).json({ error: err });
  }
};
