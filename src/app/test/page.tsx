"use client";

import { useState, useRef } from 'react';

const Test = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [ageLevel, setAgeLevel] = useState<number>(9); // Default age level set to 9
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state
  const [word, setWord] = useState<string | null>(null); // State to hold the word
  const [isMatch, setIsMatch] = useState<boolean | null>(null); // State to hold the comparison result
  const audioChunks = useRef<Blob[]>([]);

  const handleRecordClick = async () => {
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
          setIsLoading(true); // Set loading state to true
          const response = await fetch('/api/process-audio', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to process audio');
          }

          const result = await response.json();
          const transcription = result.text;
          console.log('Transcription result:', result);
          setTranscription(transcription); // Set the transcription in state

          // Send the transcription result and the word to the new endpoint
          const compareResponse = await fetch('/api/judge', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transcription, word }),
          });

          if (!compareResponse.ok) {
            throw new Error('Failed to compare transcription');
          }

          const compareResult = await compareResponse.json();
          setIsMatch(compareResult.isMatch);
        } catch (error) {
          console.error('Error processing audio:', error);
        } finally {
          setIsLoading(false); // Set loading state to false
        }

        audioChunks.current = [];
      };

      recorder.start();
      setIsRecording(true);
    }
  };

  const handleSayWordClick = async () => {
    try {
      setIsLoading(true); // Set loading state to true

      // Fetch the word
      const wordResponse = await fetch(`/api/generate-word?ageLevel=${ageLevel}`);
      if (!wordResponse.ok) {
        throw new Error('Failed to generate word');
      }
      const { word } = await wordResponse.json();
      setWord(word); // Set the word in state

      // Fetch the audio
      const audioResponse = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word }),
      });
      if (!audioResponse.ok) {
        throw new Error('Failed to generate audio');
      }
      const audioBlob = await audioResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('Error generating word audio:', error);
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  return (
    <div className="container">
      <h1>Test Page</h1>
      <p>This is the test page.</p>
      <div className="button-group">
        <button onClick={handleSayWordClick} name="sayWordButton" disabled={isLoading}>
          Say Word
        </button>
        <button onClick={handleRecordClick} name="recordButton" disabled={isLoading}>
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
          disabled={isLoading}
        />
      </div>
      {isLoading && <p>Loading...</p>}
      {word && <p>Generated Word: {word}</p>}
      {transcription && <p>Transcription: {transcription}</p>}
      {isMatch !== null && <p>Match: {isMatch ? 'Yes' : 'No'}</p>}
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