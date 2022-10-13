/* global window.SpeechRecognition */
/* global window.webkitSpeechRecognition */
/* global window.SpeechRecognitionEvent */
/* global window.webkitSpeechRecognitionEvent */
import React, { useState, useEffect, useRef } from "react";

const useMicrophone = (language, continuous) => {
  const [micResult, setMicResult] = useState("");
  const microphone = useRef(null);

  function configMic(language, continuous) {
    const speechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechRecognitionEvent =
      window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;
    if (speechRecognition === undefined) {
      return new Object();
    }
    microphone.current = new speechRecognition();
    microphone.current.continuous = continuous;
    microphone.current.lang = language; //default en-US;
    microphone.current.interimResults = false;
    microphone.current.maxAlternatives = 1;

    microphone.current.addEventListener("result", (event) => {
      console.log("Im  in result event!");
      const result = continuous
        ? event.results[event.results.length - 1][0].transcript
        : event.results[0][0].transcript;
      dispatchSpeach(result);
    });

    microphone.current.addEventListener("end", (event) => {
      microphone.current.stop();
      console.log("End event fired!");
    });

    microphone.current.addEventListener("error", (event) => {
      microphone.current.stop();
      console.log("I didn't recognise that word!");
    });
  }

  function dispatchSpeach(data) {
    console.log("Im in dispatcher..." + data);
    switch (data) {
      case "start":
        microphone.current.start();
        break;

      case "stop":
        microphone.current.stop();
        break;

      default:
        setMicResult(data);
    }
  }

  useEffect(() => {
    configMic(language, continuous);
  }, [language, continuous]);

  return [micResult, dispatchSpeach];
};

export default useMicrophone;
