import { VideoProcessor } from './videoProcessor.js';
import { AIService } from './aiService.js';
import path from 'path';

async function processVideo(inputVideoPath) {
  try {
    const videoProcessor = new VideoProcessor();
    const aiService = new AIService();

    // Initialize directories
    await videoProcessor.init();

    // Step 1: Extract frames and audio
    console.log('Extracting frames...');
    const framesDir = await videoProcessor.extractFrames(inputVideoPath);
    
    console.log('Extracting audio...');
    const audioPath = await videoProcessor.extractAudio(inputVideoPath);

    // Step 2: Analyze frames with AI
    console.log('Analyzing frames with AI...');
    const frameFiles = await fs.readdir(framesDir);
    const frameAnalyses = await Promise.all(
      frameFiles.map(frame => 
        aiService.analyzeImage(path.join(framesDir, frame))
      )
    );

    // Step 3: Generate video segments
    console.log('Generating video segments...');
    const generatedVideos = await Promise.all(
      frameAnalyses.map(analysis => 
        aiService.generateVideo(analysis)
      )
    );

    // Step 4: Concatenate videos with audio
    console.log('Creating final video...');
    const finalVideo = await videoProcessor.concatenateVideos(
      generatedVideos,
      audioPath
    );

    console.log(`Processing complete! Final video saved to: ${finalVideo}`);
    return finalVideo;
  } catch (error) {
    console.error('Error processing video:', error);
    throw error;
  }
}

// Example usage
const videoPath = process.argv[2];
if (!videoPath) {
  console.error('Please provide a video path as an argument');
  process.exit(1);
}

processVideo(videoPath).catch(console.error);