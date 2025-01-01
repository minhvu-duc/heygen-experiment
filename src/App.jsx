// src/App.jsx
import { useState, useEffect } from 'react';
import {
  uploadImage,
  createAvatarGroup,
  checkAvatarStatus,
  generateVideo,
  checkVideoStatus,
} from './api/heygenApi';
import ProcessStatus from './components/ProcessStatus';
import './App.css';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');

  const pollStatus = async (checkFn, id, successStatus) => {
    while (true) {
      const status = await checkFn(id, apiKey);
      console.log('status---', status.status)
      if (status.status === successStatus) return status;
      if (status.status !== 'pending' && status.status !== 'completed' && status.status !== 'waiting' && status.status !== 'processing') throw new Error('Process failed');
      await new Promise(resolve => setTimeout(resolve, 15000));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile || !apiKey || !inputText) {
      setError('Please fill in all fields');
      return;
    }

    setIsProcessing(true);
    setError('');
    setVideoUrl('');

    try {
      // Upload image
      setCurrentStep('Uploading image...');
      const uploadedImage = await uploadImage(selectedFile, apiKey);

      // Create avatar group
      setCurrentStep('Creating avatar...');
      const avatarGroup = await createAvatarGroup(uploadedImage.image_key, apiKey);

      // Poll avatar status
      setCurrentStep('Processing avatar...');
      await pollStatus(checkAvatarStatus, avatarGroup.id, 'completed');

      // Generate video
      setCurrentStep('Generating video...');
      const videoData = await generateVideo(avatarGroup.id, inputText, apiKey);

      // Poll video status
      setCurrentStep('Processing video...');
      const finalVideo = await pollStatus(checkVideoStatus, videoData.video_id, 'completed');

      setVideoUrl(finalVideo.video_url);
      setCurrentStep('');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="App">
      <h1>HeyGen Video Generator</h1>
      
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>API Key:</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
            />
          </div>

          <div className="form-group">
            <label>Upload Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
            />
          </div>

          <div className="form-group">
            <label>Input Text:</label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter the text to be spoken"
            />
          </div>

          <button type="submit" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Generate Video'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}
        
        {currentStep && <ProcessStatus status={currentStep} />}
        
        {videoUrl && (
          <div className="video-container">
            <h2>Generated Video:</h2>
            <video controls src={videoUrl} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;