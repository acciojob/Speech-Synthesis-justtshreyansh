const msg = new SpeechSynthesisUtterance();
let voices = [];

const voicesDropdown = document.querySelector('[name="voice"]');
const rateSlider = document.querySelector('[name="rate"]');
const pitchSlider = document.querySelector('[name="pitch"]');
const textArea = document.querySelector('[name="text"]');
const speakButton = document.querySelector('#speak');
const stopButton = document.querySelector('#stop');

function populateVoices() {
  voices = window.speechSynthesis.getVoices();
  if (!voices.length) {
    // Voices not loaded yet, retry after some time
    setTimeout(populateVoices, 100);
    return;
  }
  voicesDropdown.innerHTML = '<option value="">Select A Voice</option>';
  voices.forEach((voice, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${voice.name} (${voice.lang})${voice.default ? ' — DEFAULT' : ''}`;
    voicesDropdown.appendChild(option);
  });
}

function setMessageOptions() {
  msg.text = textArea.value;
  msg.rate = rateSlider.value;
  msg.pitch = pitchSlider.value;

  const selectedVoiceIndex = voicesDropdown.value;
  if (selectedVoiceIndex !== '') {
    msg.voice = voices[selectedVoiceIndex];
  } else {
    msg.voice = null; // default voice
  }
}

function speak() {
  if (!textArea.value.trim()) {
    alert('Please enter some text to speak.');
    return;
  }
  window.speechSynthesis.cancel();
  setMessageOptions();
  window.speechSynthesis.speak(msg);
}

function stop() {
  window.speechSynthesis.cancel();
}

voicesDropdown.addEventListener('change', () => {
  if (window.speechSynthesis.speaking) {
    speak();
  }
});

rateSlider.addEventListener('input', () => {
  if (window.speechSynthesis.speaking) {
    speak();
  }
});

pitchSlider.addEventListener('input', () => {
  if (window.speechSynthesis.speaking) {
    speak();
  }
});

speakButton.addEventListener('click', speak);
stopButton.addEventListener('click', stop);

// Try to populate voices initially
populateVoices();

// Also try to populate voices when they change (some browsers)
window.speechSynthesis.onvoiceschanged = populateVoices;
