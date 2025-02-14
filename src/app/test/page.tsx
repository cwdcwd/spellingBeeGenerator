"use client";

import { useState, useRef } from 'react';

const Test = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [ageLevel, setAgeLevel] = useState<number>(9); // Default age level set to 9
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
          setTranscription(result.text);
        } catch (error) {
          console.error('Error processing audio:', error);
        }

        audioChunks.current = [];
      };

      recorder.start();
      setIsRecording(true);
    }
  };

  const handleSayWordClick = async () => {
    try {
      const response = await fetch(`/api/generate-word?ageLevel=${ageLevel}`);
      if (!response.ok) {
        throw new Error('Failed to generate word');
      }
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('Error generating word audio:', error);
    }
  };

  return (
    <div className="container">
      <h1>Test Page</h1>
      <p>This is the test page.</p>
      <div className="button-group">
        <button onClick={handleSayWordClick} name="sayWordButton">
          Say Word
        </button>
        <button onClick={handleButtonClick} name="recordButton">
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
      <div className="age-level">
        <label htmlFor="ageLevel">Select Age Level:</label>
        <input
          type="number"
          id="ageLevel"
          value={ageLevel}
          onChange={(e) => setAgeLevel(Number(e.target.value))}
          min="1"
          max="100"
        />
      </div>
      {transcription && <p>Transcription: {transcription}</p>}
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
        .button-group {
          display: flex;
          gap: 10px;
        }
        button {
          padding: 10px 20px;
          font-size: 16px;
          margin-top: 20px;
          cursor: pointer;
        }
        .age-level {
          margin-top: 20px;
        }
        input {
          padding: 10px;
          font-size: 16px;
          width: 60px;
          text-align: center;
        }
        textarea {
          margin-top: 20px;
          padding: 10px;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};

export default Test;