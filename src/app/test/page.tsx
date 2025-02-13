"use client";

import { useState, useRef } from 'react';

const Test = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const handleButtonClick = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorder?.stop();
      setIsRecording(false);
    } else {
      // Start recording
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      recorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('file', audioBlob, 'audio.wav');

        try {
          const response = await fetch('/api/process-audio', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to process audio');
          }

          const result = await response.json();
          console.log('Transcription result:', result);
        } catch (error) {
          console.error('Error processing audio:', error);
        }

        audioChunks.current = [];
      };

      recorder.start();
      setIsRecording(true);
    }
  };

  return (
    <div className="container">
      <h1>Test Page</h1>
      <p>This is the test page.</p>
      <button onClick={handleButtonClick}>
        {isRecording ? 'Stop' : 'Start'}
      </button>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          min-height: 100vh;
          text-align: center;
          padding-top: 20px;
        }
        button {
          padding: 10px 20px;
          font-size: 16px;
          margin-top: 20px;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default Test;