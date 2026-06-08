import { useState, useRef, useCallback } from 'react';

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const finalTextRef = useRef('');
  const restartingRef = useRef(false);

  const startRecording = useCallback(() => {
    setError(null);
    setTranscript('');
    setSeconds(0);
    finalTextRef.current = '';
    restartingRef.current = false;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Your browser does not support voice recording. Try Chrome.');
      return;
    }

    function createRecognition() {
      const recognition = new SpeechRecognition();
      recognition.continuous = false; // false works better on Android
      recognition.interimResults = true;
      recognition.lang = 'en-IN';
      recognition.maxAlternatives = 1;

      recognition.onresult = (e) => {
        let interim = '';
        let newFinal = '';

        for (let i = e.resultIndex; i < e.results.length; i++) {
          const text = e.results[i][0].transcript;
          if (e.results[i].isFinal) {
            newFinal += text + ' ';
          } else {
            interim += text;
          }
        }

        if (newFinal) {
          finalTextRef.current += newFinal;
        }

        setTranscript((finalTextRef.current + interim).trim());
      };

      recognition.onerror = (e) => {
        if (e.error === 'no-speech') return; // ignore no-speech, just restart
        if (e.error === 'aborted') return;
        setError(`Mic error: ${e.error}`);
        stopRecording();
      };

      recognition.onend = () => {
        // auto-restart on Android since continuous=false stops after silence
        if (restartingRef.current) {
          try {
            const newRec = createRecognition();
            recognitionRef.current = newRec;
            newRec.start();
          } catch (e) {
            // ignore
          }
        }
      };

      return recognition;
    }

    const recognition = createRecognition();
    recognitionRef.current = recognition;
    restartingRef.current = true;

    try {
      recognition.start();
    } catch (e) {
      setError('Could not start microphone. Please try again.');
      return;
    }

    setIsRecording(true);

    timerRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  }, []);

  const stopRecording = useCallback(() => {
    restartingRef.current = false;

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      recognitionRef.current = null;
    }

    clearInterval(timerRef.current);
    setIsRecording(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setSeconds(0);
    finalTextRef.current = '';
  }, []);

  return {
    isRecording,
    transcript,
    seconds,
    error,
    startRecording,
    stopRecording,
    clearTranscript,
    setTranscript
  };
}
