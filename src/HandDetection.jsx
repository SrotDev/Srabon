import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

let detector;

export const loadHandDetector = async () => {
  await tf.setBackend('webgl'); // Force using WebGL backend
  await tf.ready();

  const model = handPoseDetection.SupportedModels.MediaPipeHands;

  // Force using the tfjs runtime to avoid MediaPipe WASM issues
  detector = await handPoseDetection.createDetector(model, {
    runtime: 'tfjs'
  });

  console.log('Hand detector loaded using TFJS runtime!');
};

const HandDetection = async (video) => {
  if (!detector) return [];
  const hands = await detector.estimateHands(video);
  return hands;
};

export default HandDetection;
