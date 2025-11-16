import React, { useEffect, useRef, useState } from "react";
import Header from "../header/Header";
import "../../styles/home.css";

const StudentDashboard = () => {
  // ====== Your list of course videos ======
  const videos = [
    {
      id: "video-1",
      title: "HTML/CSS/JavaScript",
      url: "videos/199827-911378618_tiny.mp4",
    },
    {
      id: "video-2",
      title: "React Full Course",
      url: "videos/32767-394004551_tiny.mp4",
    },
    {
      id: "video-3",
      title: "Artificial Intelligence Full Course",
      url: "videos/2025-11-13T14-44-17.820Z-173104-848555587_tiny.mp4",
    },
  ];

  const [activeVideo, setActiveVideo] = useState(videos[0]); // default first video
  const videoRef = useRef(null);

  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedVideos, setCompletedVideos] = useState([]);

  // ===== LOAD PROGRESS WHEN VIDEO CHANGES =====
  useEffect(() => {
    const videoId = activeVideo.id;

    const savedProgress = localStorage.getItem(`video-progress-${videoId}`);
    const savedCompletion = localStorage.getItem(`video-completed-${videoId}`);

    const savedCompletedList = JSON.parse(
      localStorage.getItem("completed-video-list") || "[]"
    );

    setCompletedVideos(savedCompletedList);
    setIsCompleted(savedCompletion === "true");

    if (savedProgress && videoRef.current && savedCompletion !== "true") {
      videoRef.current.currentTime = parseFloat(savedProgress);
      setProgress(parseFloat(savedProgress));
    } else {
      setProgress(0);
      if (videoRef.current) videoRef.current.currentTime = 0;
    }
  }, [activeVideo]);

  // ===== VIDEO TIME UPDATE =====
  const handleTimeUpdate = () => {
    if (isCompleted) return;

    const currentTime = videoRef.current.currentTime;
    setProgress(currentTime);

    localStorage.setItem(
      `video-progress-${activeVideo.id}`,
      currentTime.toString()
    );
  };

  // ===== VIDEO END =====
  const handleEnd = () => {
    const videoId = activeVideo.id;

    setIsCompleted(true);

    localStorage.setItem(`video-completed-${videoId}`, "true");
    localStorage.removeItem(`video-progress-${videoId}`);

    const completedItem = {
      id: videoId,
      title: activeVideo.title,
      url: activeVideo.url,
      completedAt: new Date().toLocaleString(),
    };

    const updatedList = [...completedVideos, completedItem];

    setCompletedVideos(updatedList);

    localStorage.setItem("completed-video-list", JSON.stringify(updatedList));
  };

  return (
    <div>
      <Header />

      <div className="container mt-5 py-5">
        <h1 className="mt-5 py-5">Student Dashboard</h1>

        {/* ===== VIDEO SELECT BUTTONS ===== */}
        <div className="mt-4 mb-4 d-flex gap-3 flex-wrap">
          {videos.map((v) => (
            <button
              key={v.id}
              className={`btn ${
                activeVideo.id === v.id ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setActiveVideo(v)}
            >
              {v.title}
            </button>
          ))}
        </div>

        <h1 className="mt-5">{activeVideo.title}</h1>
        {isCompleted && (
          <span className="badge bg-success fs-6 ms-2 my-5">
            ✔ Completed
          </span>
        )}

        {/* ===== VIDEO PLAYER ===== */}
        <video
          ref={videoRef}
        width="100%"
        height="50%"
          controls
          src={activeVideo.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnd}
        />

        {!isCompleted && (
          <p className="mt-3">
            Progress: <strong>{Math.floor(progress)} sec</strong>
          </p>
        )}

        {/* ===== COMPLETED COURSES ===== */}
        <div className="mt-5">
          <h3>Completed Videos</h3>

          {completedVideos.length === 0 ? (
            <p>No videos completed yet.</p>
          ) : (
            <div className="row mt-3">
              {completedVideos.map((course, index) => (
                <div key={index} className="col-md-4">
                  <div className="card shadow-sm mb-3">
                    <div className="card-body">
                      <h5 className="card-title">🎓 {course.title}</h5>
                      <p className="card-text text-muted">
                        Completed on: {course.completedAt}
                      </p>

                      <a
                        href={course.url}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary btn-sm"
                      >
                        Watch Again
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;
