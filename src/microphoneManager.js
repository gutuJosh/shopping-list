/* global window.SpeechRecognition */
/* global window.webkitSpeechRecognition */
/* global window.SpeechRecognitionEvent */
/* global window.webkitSpeechRecognitionEvent */
export default class microphoneManager {
  constructor(language) {
    this.speechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    this.speechRecognitionEvent =
      window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;

    this.recognition = new this.speechRecognition();
    this.recognition.continuous = false;
    this.recognition.lang = language; //'en-US';
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;
  }

  handleEvent(evtName, fn) {
    this.recognition.addEventListener(evtName, (event) => fn(event), false);
  }

  startMicrophone() {
    this.recognition.start();
  }

  stoptMicrophone() {
    this.recognition.stop();
  }
}
