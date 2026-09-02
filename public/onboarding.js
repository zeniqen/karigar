/* -------------------------------------------------
   Karigar – Skill Passport Onboarding Logic
   ------------------------------------------------- */

const state = {
  currentScreen: 'welcome',
  currentQuestionIdx: 0,
  interactionState: 'idle', // 'idle', 'listening', 'processing', 'captured'
  userData: {
    name: 'Ramesh Kumar',
    trade: 'Carpenter',
    experience: '8 years',
    specializations: ['Furniture making', 'Wood joinery', 'Cabinet installation'],
    summary: 'Demonstrates experience in furniture construction, wood joinery, and cabinet installation.'
  },
  samples: []
};

const questions = [
  "What kind of work do you do?",
  "How many years have you been doing this work?",
  "What kind of jobs are you most experienced in?",
  "Is there anything special about the work you do?"
];

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const screens = {
    welcome: document.getElementById('screen-welcome'),
    conversation: document.getElementById('screen-conversation'),
    passport: document.getElementById('screen-passport'),
    samples: document.getElementById('screen-samples')
  };

  const btnStartTalking = document.getElementById('btn-start-talking');
  const btnMic = document.getElementById('btn-mic');
  const voiceStatus = document.getElementById('voice-status');
  const currentQuestionEl = document.getElementById('current-question');
  const questionNumberEl = document.getElementById('question-number');

  const passportProcessing = document.getElementById('passport-processing');
  const passportResult = document.getElementById('passport-result');
  const btnPassportConfirm = document.getElementById('btn-passport-confirm');
  const btnPassportEdit = document.getElementById('btn-passport-edit');

  const btnAddSample = document.getElementById('btn-add-sample');
  const fileUpload = document.getElementById('file-upload');
  const samplesGrid = document.getElementById('samples-grid');
  const btnFinish = document.getElementById('btn-finish');

  // --- Screen Transitions ---
  function showScreen(screenId) {
    Object.values(screens).forEach(screen => screen.classList.remove('active'));
    screens[screenId].classList.add('active');
    state.currentScreen = screenId;
  }

  // --- Conversation Logic ---
  function updateConversationUI() {
    currentQuestionEl.textContent = questions[state.currentQuestionIdx];
    questionNumberEl.textContent = state.currentQuestionIdx + 1;
  }

  async function handleVoiceInteraction() {
    if (state.interactionState !== 'idle') return;

    // 1. Listening State
    state.interactionState = 'listening';
    btnMic.classList.add('listening');
    voiceStatus.textContent = 'Listening...';

    await new Promise(resolve => setTimeout(resolve, 2500));

    // 2. Processing State
    state.interactionState = 'processing';
    btnMic.classList.remove('listening');
    voiceStatus.textContent = 'Processing your voice...';

    await new Promise(resolve => setTimeout(resolve, 2000));

    // 3. Captured State
    state.interactionState = 'captured';
    voiceStatus.textContent = 'Got it!';

    await new Promise(resolve => setTimeout(resolve, 1500));

    // Advance to next question or finish
    state.currentQuestionIdx++;
    if (state.currentQuestionIdx < questions.length) {
      state.interactionState = 'idle';
      updateConversationUI();
      voiceStatus.textContent = 'Tap the mic to start speaking';
    } else {
      showPassport();
    }
  }

  // --- Passport Generation ---
  function showPassport() {
    showScreen('passport');
    passportProcessing.classList.remove('hidden');
    passportResult.classList.add('hidden');

    setTimeout(() => {
      passportProcessing.classList.add('hidden');
      passportResult.classList.remove('hidden');
      populatePassport();
    }, 3000);
  }

  function populatePassport() {
    document.getElementById('passport-name').textContent = state.userData.name;
    document.getElementById('passport-trade').textContent = state.userData.trade;
    document.getElementById('passport-exp').textContent = state.userData.experience;

    const specsList = document.getElementById('passport-specs');
    specsList.innerHTML = '';
    state.userData.specializations.forEach(spec => {
      const li = document.createElement('li');
      li.textContent = spec;
      specsList.appendChild(li);
    });

    document.getElementById('passport-summary').textContent = `"${state.userData.summary}"`;
  }

  // --- Work Samples Logic ---
  function handleFileUpload(e) {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target.result;
        addSamplePreview(imageUrl);
      };
      reader.readAsDataURL(file);
    });
  }

  function addSamplePreview(url) {
    const card = document.createElement('div');
    card.className = 'sample-card';
    card.innerHTML = `
      <img src="${url}" alt="Work sample">
      <button class="remove-sample" title="Remove">&times;</button>
    `;

    card.querySelector('.remove-sample').onclick = () => {
      card.remove();
    };

    samplesGrid.appendChild(card);
  }

  // --- Event Listeners ---
  btnStartTalking.onclick = () => {
    showScreen('conversation');
    updateConversationUI();
  };

  btnMic.onclick = handleVoiceInteraction;

  btnPassportConfirm.onclick = () => {
    showScreen('samples');
  };

  btnPassportEdit.onclick = () => {
    alert('Editing is coming soon in the full version!');
  };

  btnAddSample.onclick = () => fileUpload.click();
  fileUpload.onchange = handleFileUpload;

  btnFinish.onclick = () => {
    alert('Congratulations! Your Skill Passport is complete.');
    window.location.href = 'index.html';
  };
});
