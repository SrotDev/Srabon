import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loadHandDetector } from "./HandDetection";
import HandDetection from "./HandDetection";

const CameraWithGestures = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const previousXRef = useRef(null);
  const swipeCooldownRef = useRef(false); // 🟩 Cooldown to prevent repeated triggers

  useEffect(() => {
    const init = async () => {
      // Start camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Load hand detector
      await loadHandDetector();

      // Start detection loop when video metadata is ready
      videoRef.current.addEventListener("loadedmetadata", () => {
        console.log("Video is ready, starting detection...");
        detectLoop();
      });

      // Fallback: start after short delay
      setTimeout(() => {
        console.log("Fallback: Starting detection loop after delay...");
        detectLoop();
      }, 1000);
    };

    const detectLoop = async () => {
      if (
        videoRef.current &&
        videoRef.current.videoWidth !== 0 &&
        videoRef.current.videoHeight !== 0
      ) {
        const hands = await HandDetection(videoRef.current);

        if (hands.length > 0) {
          const hand = hands[0];
          console.log("Detected hand landmarks:", hand.keypoints);

          // Visualize landmarks
          drawLandmarks(hand.keypoints);

          // Handle gestures (pinch, swipe)
          handleGesture(hand);
        } else {
          // Clear canvas if no hands
          const ctx = canvasRef.current.getContext("2d");
          ctx.clearRect(0, 0, 640, 480);
          previousXRef.current = null;
        }
      }

      requestAnimationFrame(detectLoop);
    };

    const drawLandmarks = (keypoints) => {
      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, 640, 480);

      keypoints.forEach((point) => {
        ctx.beginPath();
        ctx.arc(
          point.x,
          point.y,
          point.name === "index_finger_tip" ? 10 : 5,
          0,
          2 * Math.PI
        );
        ctx.fillStyle = point.name === "index_finger_tip" ? "blue" : "red";
        ctx.fill();
      });
    };

    const handleGesture = (hand) => {
  const landmarks = hand.keypoints;

  const thumbTip = landmarks.find((pt) => pt.name === "thumb_tip");
  const wrist = landmarks.find((pt) => pt.name === "wrist");

  if (thumbTip && wrist) {
    console.log("Thumb Tip Y:", thumbTip.y, "Wrist Y:", wrist.y);

    if (!swipeCooldownRef.current && thumbTip.y < wrist.y - 0.05) {
      console.log("Thumbs Up detected → Navigating!");
      navigate("/auth");
      swipeCooldownRef.current = true;
      setTimeout(() => (swipeCooldownRef.current = false), 1000);
    } else if (!swipeCooldownRef.current && thumbTip.y > wrist.y + 0.05) {
      console.log("Thumbs Down detected → Navigating!");
      navigate("/");
      swipeCooldownRef.current = true;
      setTimeout(() => (swipeCooldownRef.current = false), 1000);
    }
  }

  // Pinch detection still there if you want it
  const indexTip = landmarks.find((pt) => pt.name === "index_finger_tip");
  if (thumbTip && indexTip) {
    const pinchDistance = Math.sqrt(
      (thumbTip.x - indexTip.x) ** 2 + (thumbTip.y - indexTip.y) ** 2
    );

    if (pinchDistance < 30) {
      console.log("Pinch detected! Trigger button click...");
      document.querySelector("#myButton")?.click();
    }
  }
};


    init();
  }, [navigate]);

  return (
    <div style={{ position: "relative", width: "640px", height: "480px" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        width="640"
        height="480"
        style={{ display: "block" }}
      />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
};

export default CameraWithGestures;
