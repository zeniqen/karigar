/* -------------------------------------------------
   Karigar – Lending Circles Logic
   ------------------------------------------------- */

// --- Mock Data ---
const MOCK_DATA = {
  currentUser: {
    id: 'u-me',
    name: 'You',
    trade: 'Carpenter'
  },
  circles: [
    {
      id: 'c1',
      name: "Carpenter's Circle",
      amount: 1000,
      frequency: 'Monthly',
      memberCount: 8,
      recipient: 'Ramesh Kumar',
      status: 'Active',
      members: [
        { id: 'u1', name: 'Ramesh Kumar', paid: true },
        { id: 'u2', name: 'Suresh Kumar', paid: true },
        { id: 'u3', name: 'Amit Sharma', paid: true },
        { id: 'u4', name: 'Meena Devi', paid: true },
        { id: 'u5', name: 'Rajesh', paid: true },
        { id: 'u6', name: 'Sunil', paid: false },
        { id: 'u7', name: 'Neha', paid: true },
        { id: 'u-me', name: 'You', paid: true },
      ],
      rotation: [
        { name: 'Ramesh Kumar', status: 'received' },
        { name: 'Suresh Kumar', status: 'received' },
        { name: 'Amit Sharma', status: 'received' },
        { name: 'Meena Devi', status: 'current' },
        { name: 'Rajesh', status: 'pending' },
        { name: 'Sunil', status: 'pending' },
        { name: 'Neha', status: 'pending' },
        { name: 'You', status: 'pending' },
      ],
      activity: [
        { text: 'Ramesh received this month\'s payout', time: '2 days ago' },
        { text: 'Meena contributed ₹1,000', time: '3 days ago' },
        { text: 'You contributed ₹1,000', time: '4 days ago' },
      ]
    },
    {
      id: 'c2',
      name: "Local Artisans Circle",
      amount: 2000,
      frequency: 'Monthly',
      memberCount: 6,
      recipient: 'Meena Devi',
      status: 'Active',
      members: [
        { id: 'u8', name: 'Meena Devi', paid: true },
        { id: 'u9', name: 'Suresh', paid: true },
        { id: 'u10', name: 'Anita', paid: false },
        { id: 'u11', name: 'Rahul', paid: true },
        { id: 'u12', name: 'Priya', paid: false },
        { id: 'u-me', name: 'You', paid: false },
      ],
      rotation: [
        { name: 'Meena Devi', status: 'current' },
        { name: 'Suresh', status: 'pending' },
        { name: 'Anita', status: 'pending' },
        { name: 'Rahul', status: 'pending' },
        { name: 'Priya', status: 'pending' },
        { name: 'You', status: 'pending' },
      ],
      activity: [
        { text: 'Meena started the new cycle', time: '1 day ago' },
        { text: 'Suresh contributed ₹2,000', time: '2 days ago' },
      ]
    }
  ],
  availableCircles: [
    {
      id: 'ac1',
      name: 'Woodworkers Circle',
      location: 'Delhi',
      amount: 1000,
      frequency: 'Monthly',
      membersJoined: 7,
      totalMembers: 8,
      spots: 1
    },
    {
      id: 'ac2',
      name: 'Tailors Community Circle',
      location: 'Delhi NCR',
      amount: 1500,
      frequency: 'Monthly',
      membersJoined: 5,
      totalMembers: 6,
      spots: 1
    },
    {
      id: 'ac3',
      name: 'Handcraft Circle',
      location: 'Noida',
      amount: 2000,
      frequency: 'Monthly',
      membersJoined: 6,
      totalMembers: 8,
      spots: 2
    }
  ]
};

// --- App Controller ---
document.addEventListener('DOMContentLoaded', () => {
  const screens = {
    home: document.getElementById('screen-home'),
    create: document.getElementById('screen-create'),
    find: document.getElementById('screen-find'),
    details: document.getElementById('screen-details')
  };

  function showScreen(screenId) {
    Object.values(screens).forEach(s => s.classList.add('hidden'));
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[screenId].classList.remove('hidden');
    screens[screenId].classList.add('active');
    window.scrollTo(0, 0);
  }

  // --- Home Screen Logic ---
  function renderHome() {
    const grid = document.getElementById('my-circles-grid');
    grid.innerHTML = '';

    MOCK_DATA.circles.forEach(circle => {
      const paidCount = circle.members.filter(m => m.paid).length;
      const card = document.createElement('div');
      card.className = 'circle-card';
      card.innerHTML = `
        <div class="card-header">
          <h3>${circle.name}</h3>
          <span class="trade-badge">${circle.status}</span>
        </div>
        <div class="card-body">
          <div class="info-row"><span>Amount:</span> <strong>₹${circle.amount} / ${circle.frequency}</strong></div>
          <div class="info-row"><span>Members:</span> <strong>${circle.memberCount}</strong></div>
          <div class="info-row"><span>Cycle:</span> <strong>${circle.frequency}</strong></div>
          <div class="cycle-progress">
            <p>Current cycle: ${paidCount} of ${circle.memberCount} received</p>
            <div class="progress-bar"><div class="progress-fill" style="width: ${(paidCount/circle.memberCount)*100}%"></div></div>
          </div>
          <div class="payout-info">
            <p>Next payout: <strong>₹${circle.amount * circle.memberCount}</strong></p>
            <p>Next recipient: <strong>${circle.recipient}</strong></p>
          </div>
        </div>
        <button class="cta-primary view-circle-btn" data-id="${circle.id}">View Circle</button>
      `;
      grid.appendChild(card);
    });

    // Handle "Your Next Contribution" alert
    const unpaidCircle = MOCK_DATA.circles.find(c => {
      const me = c.members.find(m => m.id === MOCK_DATA.currentUser.id);
      return me && !me.paid;
    });

    const alertBox = document.getElementById('next-contribution-alert');
    if (unpaidCircle) {
      alertBox.classList.remove('hidden');
      document.getElementById('alert-amount').textContent = `₹${unpaidCircle.amount}`;
      document.getElementById('alert-due').textContent = `Due in 4 days`;
      document.getElementById('btn-alert-view').onclick = () => openCircleDetails(unpaidCircle.id);
    } else {
      alertBox.classList.add('hidden');
    }
  }

  // --- Create Circle Logic ---
  function initCreateForm() {
    const amountInput = document.getElementById('create-amount');
    const membersInput = document.getElementById('create-members');
    const freqInput = document.getElementById('create-frequency');

    const updateSummary = () => {
      const amt = parseInt(amountInput.value) || 0;
      const mem = parseInt(membersInput.value) || 0;
      const freq = freqInput.value;

      document.getElementById('sum-members').textContent = mem;
      document.getElementById('sum-amount').textContent = `₹${amt} / ${freq.toLowerCase()}`;
      document.getElementById('sum-pool').textContent = `₹${amt * mem}`;
      document.getElementById('sum-cycle').textContent = `${mem} ${freq.toLowerCase()}s`;
    };

    [amountInput, membersInput, freqInput].forEach(input => {
      input.oninput = updateSummary;
    });

    document.getElementById('btn-confirm-create').onclick = () => {
      const name = document.getElementById('create-name').value || 'New Circle';
      const amount = parseInt(amountInput.value) || 1000;
      const members = parseInt(membersInput.value) || 8;
      const freq = freqInput.value;

      const newCircle = {
        id: 'c' + (MOCK_DATA.circles.length + 1),
        name: name,
        amount: amount,
        frequency: freq,
        memberCount: members,
        recipient: 'You',
        status: 'Active',
        members: [
          { id: 'u-me', name: 'You', paid: false },
          ...Array.from({ length: members - 1 }, (_, i) => ({
            id: 'u-new' + i,
            name: 'Member ' + (i + 2),
            paid: false
          }))
        ],
        rotation: [
          { name: 'You', status: 'current' },
          ...Array.from({ length: members - 1 }, (_, i) => ({
            name: 'Member ' + (i + 2),
            status: 'pending'
          }))
        ],
        activity: [{ text: 'You created this circle', time: 'Just now' }]
      };

      MOCK_DATA.circles.push(newCircle);
      showScreen('home');
      renderHome();
    };
  }

  // --- Find Circle Logic ---
  function renderFind() {
    const grid = document.getElementById('available-circles-grid');
    const search = document.getElementById('find-search').value.toLowerCase();
    const filterAmt = document.getElementById('find-filter-amount').value;

    grid.innerHTML = '';

    const filtered = MOCK_DATA.availableCircles.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(search) || c.location.toLowerCase().includes(search);
      const matchesAmt = !filterAmt || c.amount <= parseInt(filterAmt);
      return matchesSearch && matchesAmt;
    });

    filtered.forEach(circle => {
      const card = document.createElement('div');
      card.className = 'circle-card';
      card.innerHTML = `
        <div class="card-header">
          <h3>${circle.name}</h3>
          <span class="location-tag">${circle.location}</span>
        </div>
        <div class="card-body">
          <div class="info-row"><span>Contribution:</span> <strong>₹${circle.amount} / ${circle.frequency}</strong></div>
          <div class="info-row"><span>Members:</span> <strong>${circle.membersJoined} of ${circle.totalMembers}</strong></div>
          <div class="spots-info"><span>${circle.spots} spot available</span></div>
        </div>
        <button class="cta-primary join-circle-btn" data-id="${circle.id}">Join Circle</button>
      `;
      grid.appendChild(card);
    });
  }

  // --- Details Screen Logic ---
  function openCircleDetails(id) {
    const circle = MOCK_DATA.circles.find(c => c.id === id);
    if (!circle) return;

    showScreen('details');

    document.getElementById('det-name').textContent = circle.name;
    document.getElementById('det-meta').textContent = `₹${circle.amount} / month • ${circle.memberCount} members • ${circle.frequency}`;
    document.getElementById('det-pool-amount').textContent = `₹${circle.amount * circle.memberCount}`;
    document.getElementById('det-recipient').textContent = circle.recipient;

    // Contributions list
    const contList = document.getElementById('det-contributions-list');
    contList.innerHTML = '';
    circle.members.forEach(m => {
      const item = document.createElement('div');
      item.className = 'contribution-item';
      item.innerHTML = `
        <span class="status-icon">${m.paid ? '✓' : '○'}</span>
        <span class="member-name">${m.name}</span>
        <span class="payment-status">${m.paid ? 'Paid' : 'Pending'}</span>
      `;
      contList.appendChild(item);
    });

    // Payout Rotation
    const timeline = document.getElementById('det-rotation-timeline');
    timeline.innerHTML = '';
    circle.rotation.forEach((step, index) => {
      const dot = document.createElement('div');
      dot.className = `rotation-step ${step.status}`;
      dot.innerHTML = `
        <span class="step-num">${index + 1}</span>
        <span class="step-name">${step.name}</span>
        <span class="step-label">${step.status === 'received' ? 'Received' : step.status === 'current' ? 'Current' : ''}</span>
      `;
      timeline.appendChild(dot);
    });

    // Activity
    const feed = document.getElementById('det-activity-feed');
    feed.innerHTML = '';
    circle.activity.forEach(act => {
      const item = document.createElement('div');
      item.className = 'activity-item';
      item.innerHTML = `
        <span class="activity-text">${act.text}</span>
        <span class="activity-time">${act.time}</span>
      `;
      feed.appendChild(item);
    });

    // User Payment Action
    const me = circle.members.find(m => m.id === MOCK_DATA.currentUser.id);
    const paymentArea = document.getElementById('user-payment-area');
    if (me && !me.paid) {
      paymentArea.classList.remove('hidden');
      document.getElementById('btn-mark-paid').onclick = () => {
        me.paid = true;
        circle.activity.unshift({ text: 'You contributed ₹' + circle.amount, time: 'Just now' });
        openCircleDetails(id);
      };
    } else {
      paymentArea.classList.add('hidden');
    }
  }

  // --- Event Listeners ---
  document.getElementById('btn-go-create').onclick = () => showScreen('create');
  document.getElementById('btn-go-find').onclick = () => showScreen('find');
  document.getElementById('btn-back-home').onclick = () => showScreen('home');
  document.getElementById('btn-back-find').onclick = () => showScreen('home');
  document.getElementById('btn-back-details').onclick = () => showScreen('home');

  document.getElementById('find-search').oninput = renderFind;
  document.getElementById('find-filter-amount').onchange = renderFind;

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('view-circle-btn')) {
      openCircleDetails(e.target.dataset.id);
    }
    if (e.target.classList.contains('join-circle-btn')) {
      const availableId = e.target.dataset.id;
      const circleTemplate = MOCK_DATA.availableCircles.find(c => c.id === availableId);

      const newCircle = {
        id: 'joined-' + Date.now(),
        name: circleTemplate.name,
        amount: circleTemplate.amount,
        frequency: circleTemplate.frequency,
        memberCount: circleTemplate.totalMembers,
        recipient: 'Rotating',
        status: 'Active',
        members: [
          { id: 'u-me', name: 'You', paid: false },
          ...Array.from({ length: circleTemplate.totalMembers - 1 }, (_, i) => ({
            id: 'u-join' + i,
            name: 'Member ' + (i + 1),
            paid: true
          }))
        ],
        rotation: [
          { name: 'You', status: 'pending' },
          ...Array.from({ length: circleTemplate.totalMembers - 1 }, (_, i) => ({
            name: 'Member ' + (i + 1),
            status: 'pending'
          }))
        ],
        activity: [{ text: 'You joined the circle', time: 'Just now' }]
      };
      MOCK_DATA.circles.push(newCircle);
      showScreen('home');
      renderHome();
    }
  });

  // Init
  renderHome();
  initCreateForm();
  renderFind();
});
