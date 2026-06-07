import { useState, useRef, useCallback } from 'react';

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);

  const startRecording = useCallback(() => {
    setError(null);
    setTranscript('');
    setSeconds(0);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Your browser does not support voice recording. Try Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN'; // works for Indian English + Hindi words

    let finalText = '';

    recognition.onresult = (e) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setTranscript(finalText + interim);
    };

    recognition.onerror = (e) => {
      setError(`Mic error: ${e.error}. Make sure you allowed mic access.`);
      stopRecording();
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsRecording(true);

    // start timer
    timerRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    clearInterval(timerRef.current);
    setIsRecording(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setSeconds(0);
  }, []);

  return {
    isRecording,
    transcript,
    seconds,
    error,
    startRecording,
    stopRecording,
    clearTranscript,
    setTranscript // so user can also manually edit
  };
}