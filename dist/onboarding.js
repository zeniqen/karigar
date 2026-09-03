/* -------------------------------------------------
   Karigar – Adaptive Voice Onboarding Logic
   ------------------------------------------------- */

// --- Voice Service ---
// Wraps Web Speech API for STT and TTS
const voiceService = {
  recognition: null,
  synth: window.speechSynthesis,

  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  },

  async speak(text) {
    return new Promise((resolve) => {
      if (!this.synth) return resolve();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.onend = () => resolve();
      this.synth.speak(utterance);
    });
  },

  async listen(onResult, onError) {
    if (!this.recognition) {
      onError("Speech recognition not supported in this browser.");
      return;
    }

    return new Promise((resolve) => {
      this.recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        onResult(text);
        resolve(text);
      };
      this.recognition.onerror = (event) => {
        onError(event.error);
        resolve(null);
      };
      this.recognition.start();
    });
  }
};

// --- Conversation Service ---
// Mock AI engine for adaptive conversations
const conversationService = {
  state: {
    occupation: null,
    experience: null,
    specializations: [],
    uniqueValue: null,
    capturedTurns: 0,
    maxTurns: 8
  },

  async getNextTurn(userInput) {
    this.state.capturedTurns++;
    const response = this.analyzeInput(userInput);

    let nextQuestion = "";

    if (!this.state.occupation) {
      nextQuestion = "Tell me a little about the work you do.";
    } else if (!this.state.experience) {
      nextQuestion = `That's interesting. How long have you been working as a ${this.state.occupation}?`;
    } else if (this.state.specializations.length === 0) {
      nextQuestion = `Got it. And what specific parts of ${this.state.occupation} are you most experienced in?`;
    } else if (!this.state.uniqueValue) {
      nextQuestion = "That's useful to know. Is there anything about your work that makes it different from others in your field?";
    } else {
      return {
        type: 'complete',
        text: "Thanks! I think I've got a good picture of your work now."
      };
    }

    return {
      type: 'question',
      acknowledgment: response.ack,
      text: nextQuestion
    };
  },

  analyzeInput(input) {
    const text = input.toLowerCase();
    let ack = "Got it.";

    if (!this.state.occupation) {
      const trades = ['carpenter', 'tailor', 'weaver', 'mason', 'electrician', 'plumber', 'artist'];
      const found = trades.find(t => text.includes(t));
      if (found) {
        this.state.occupation = found.charAt(0).toUpperCase() + found.slice(1);
        ack = `Oh, a ${this.state.occupation}! That's wonderful.`;
      }
    }

    if (!this.state.experience) {
      const yearMatch = text.match(/(\d+)\s*(year|yr)/);
      if (yearMatch) {
        this.state.experience = `${yearMatch[1]} years`;
        ack = "That's a good amount of experience.";
      }
    }

    if (this.state.specializations.length === 0 || this.state.specializations.length < 2) {
      if (text.includes('beds') || text.includes('furniture')) this.state.specializations.push('Furniture making');
      if (text.includes('joints') || text.includes('wood')) this.state.specializations.push('Wood joinery');
      if (text.includes('custom')) this.state.specializations.push('Custom designs');
      if (this.state.specializations.length > 0) ack = "Those are great skills to have.";
    }

    if (!this.state.uniqueValue && text.length > 20) {
      this.state.uniqueValue = input;
      ack = "I appreciate you sharing that.";
    }

    return { ack };
  },

  generatePassport() {
    return {
      name: 'Ramesh Kumar',
      trade: this.state.occupation || 'Artisan',
      experience: this.state.experience || 'Experience not specified',
      specializations: this.state.specializations.length > 0
        ? this.state.specializations
        : ['General Craftsmanship'],
      summary: this.createSummary()
    };
  },

  createSummary() {
    const trade = this.state.occupation || 'Artisan';
    const exp = this.state.experience || 'various';
    const specs = this.state.specializations.join(', ') || 'general skills';
    return `${exp} of experience in ${trade}, specializing in ${specs}.`;
  }
};

// --- Main App Controller ---
document.addEventListener('DOMContentLoaded', () => {
  voiceService.init();

  const screens = {
    welcome: document.getElementById('screen-welcome'),
    conversation: document.getElementById('screen-conversation'),
    passport: document.getElementById('screen-passport'),
    samples: document.getElementById('screen-samples')
  };

  const orb = document.getElementById('voice-orb');
  const voiceStatus = document.getElementById('voice-status');
  const transcriptText = document.getElementById('transcript-text');
  const btnMic = document.getElementById('btn-mic');
  const btnEndConv = document.getElementById('btn-end-conversation');
  const textFallback = document.getElementById('text-fallback');
  const fallbackInput = document.getElementById('fallback-input');
  const btnSendText = document.getElementById('btn-send-text');

  function showScreen(screenId) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenId].classList.add('active');
  }

  async function updateOrbState(state) {
    orb.className = 'voice-orb ' + state;
    switch(state) {
      case 'idle': voiceStatus.textContent = 'Tap the mic to start speaking'; break;
      case 'listening': voiceStatus.textContent = 'Listening...'; break;
      case 'speaking': voiceStatus.textContent = 'Speaking...'; break;
      case 'thinking': voiceStatus.textContent = 'Thinking...'; break;
    }
  }

  async function processUserInput(userInput) {
    await updateOrbState('thinking');
    const turn = await conversationService.getNextTurn(userInput);

    if (turn.type === 'question') {
      await updateOrbState('speaking');
      const fullResponse = `${turn.acknowledgment} ${turn.text}`;

      const msg = document.createElement('div');
      msg.className = 'message-ai';
      msg.innerHTML = `<strong>Karigar:</strong> ${fullResponse}`;
      transcriptText.appendChild(msg);
      transcriptText.scrollTop = transcriptText.scrollHeight;

      await voiceService.speak(fullResponse);
      await updateOrbState('idle');
    } else {
      await updateOrbState('speaking');
      await voiceService.speak(turn.text);
      setTimeout(() => {
        showPassport();
      }, 1000);
    }
  }

  async function handleVoiceTurn() {
    if (btnMic.classList.contains('active')) return;

    btnMic.classList.add('active');
    textFallback.classList.add('hidden');
    await updateOrbState('listening');

    const userInput = await voiceService.listen(
      (text) => {
        const msg = document.createElement('div');
        msg.className = 'message-user';
        msg.innerHTML = `<strong>You:</strong> ${text}`;
        transcriptText.appendChild(msg);
        transcriptText.scrollTop = transcriptText.scrollHeight;
      },
      (err) => {
        console.error("Speech Error:", err);
        voiceStatus.textContent = "Microphone unavailable. Please type instead.";
        textFallback.classList.remove('hidden');
      }
    );

    if (userInput) {
      await processUserInput(userInput);
    }

    btnMic.classList.remove('active');
    if (!textFallback.classList.contains('hidden')) {
      await updateOrbState('idle');
    }
  }

  function showPassport() {
    showScreen('passport');
    document.getElementById('passport-processing').classList.remove('hidden');
    document.getElementById('passport-result').classList.add('hidden');

    setTimeout(() => {
      document.getElementById('passport-processing').classList.add('hidden');
      document.getElementById('passport-result').classList.remove('hidden');

      const data = conversationService.generatePassport();
      document.getElementById('passport-name').textContent = data.name;
      document.getElementById('passport-trade').textContent = data.trade;
      document.getElementById('passport-exp').textContent = data.experience;

      const specsList = document.getElementById('passport-specs');
      specsList.innerHTML = '';
      data.specializations.forEach(spec => {
        const li = document.createElement('li');
        li.textContent = spec;
        specsList.appendChild(li);
      });
      document.getElementById('passport-summary').textContent = `"${data.summary}"`;
    }, 2500);
  }

  document.getElementById('btn-start-talking').onclick = () => {
    showScreen('conversation');
    setTimeout(async () => {
      await updateOrbState('speaking');
      const firstQuestion = "Hello! I'm Karigar. I'd love to learn about your work. Tell me a little about what you do.";
      transcriptText.innerHTML = `<strong>Karigar:</strong> ${firstQuestion}<br>`;
      await voiceService.speak(firstQuestion);
      await updateOrbState('idle');
    }, 500);
  };

  btnMic.onclick = handleVoiceTurn;

  btnSendText.onclick = async () => {
    const text = fallbackInput.value.trim();
    if (!text) return;

    fallbackInput.value = '';

    const msg = document.createElement('div');
    msg.className = 'message-user';
    msg.innerHTML = `<strong>You:</strong> ${text}`;
    transcriptText.appendChild(msg);
    transcriptText.scrollTop = transcriptText.scrollHeight;

    await processUserInput(text);
  };

  btnEndConv.onclick = () => {
    if (confirm("End conversation and generate passport now?")) {
      showPassport();
    }
  };

  document.getElementById('btn-passport-confirm').onclick = () => showScreen('samples');
  document.getElementById('btn-passport-edit').onclick = () => alert("Editing coming soon!");

  const fileUpload = document.getElementById('file-upload');
  const samplesGrid = document.getElementById('samples-grid');

  document.getElementById('btn-add-sample').onclick = () => fileUpload.click();
  fileUpload.onchange = (e) => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const card = document.createElement('div');
        card.className = 'sample-card';
        card.innerHTML = `<img src="${ev.target.result}" alt="Sample"><button class="remove-sample">&times;</button>`;
        card.querySelector('.remove-sample').onclick = () => card.remove();
        samplesGrid.appendChild(card);
      };
      reader.readAsDataURL(file);
    });
  };

  document.getElementById('btn-finish').onclick = () => {
    alert("Your Skill Passport is complete!");
    window.location.href = 'index.html';
  };
});
