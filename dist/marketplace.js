/**
 * Karigar Marketplace Logic
 * Handles rendering the artisan gallery and the detailed Skill Passport modal.
 */

const KARIGARS = [
  {
    id: "k1",
    name: "Arjun Sharma",
    trade: "Carpenter",
    skills: ["Wood carving", "Furniture", "Traditional"],
    experience: "18+ years experience",
    rating: 4.9,
    ctScore: 98,
    summary: "Specialist in traditional Indian wood carvings and bespoke heritage furniture.",
    passportDetails: {
      location: "Jaipur, Rajasthan",
      certifications: ["State Craftsmanship Award 2018", "Master Artisan Certification"],
      notableProjects: ["City Palace Restoration", "Heritage Hotel Lobby"],
      contact: "arjun.carpenter@example.com"
    }
  },
  {
    id: "k2",
    name: "Anjali Rao",
    trade: "Embroidery",
    skills: ["Embroidery", "Textiles", "Handcrafted"],
    experience: "12+ years experience",
    rating: 4.9,
    ctScore: 98,
    summary: "Preserving the rich heritage of Indian embroidery through intricate hand-work.",
    passportDetails: {
      location: "Lucknow, Uttar Pradesh",
      certifications: ["Textile Arts Certification"],
      notableProjects: ["Cultural Fashion Week 2022"],
      contact: "anjali.thread@example.com"
    }
  },
  {
    id: "k3",
    name: "Suresh Iyer",
    trade: "Brass Smith",
    skills: ["Brassware", "Ornaments", "Traditional"],
    experience: "25+ years experience",
    rating: 4.8,
    ctScore: 96,
    summary: "Creating sacred brassware and intricate ornaments for two decades.",
    passportDetails: {
      location: "Kumbakonam, Tamil Nadu",
      certifications: ["Heritage Craft Guild Gold Member"],
      notableProjects: ["Brihadeeswara Temple Art Restoration"],
      contact: "suresh.brass@example.com"
    }
  },
  {
    id: "k4",
    name: "Meera Bai",
    trade: "Weaver",
    skills: ["Banarasi silk", "Handloom", "Natural dyes"],
    experience: "20+ years experience",
    rating: 4.7,
    ctScore: 94,
    summary: "Expert in traditional Banarasi silk weaving with a focus on sustainable dyes.",
    passportDetails: {
      location: "Varanasi, Uttar Pradesh",
      certifications: ["Handloom Export Board Certified"],
      notableProjects: ["National Textile Exhibition 2021"],
      contact: "meera.weaver@example.com"
    }
  },
  {
    id: "k5",
    name: "Priya Das",
    trade: "Pottery",
    skills: ["Terracotta", "Ceramics", "Contemporary"],
    experience: "10+ years experience",
    rating: 4.6,
    ctScore: 92,
    summary: "Contemporary terracotta artist blending modern forms with ancient techniques.",
    passportDetails: {
      location: "Kolkata, West Bengal",
      certifications: ["Fine Arts Diploma"],
      notableProjects: ["Urban Clay Installation 2023"],
      contact: "priya.clay@example.com"
    }
  },
  {
    id: "k6",
    name: "Vikram Singh",
    trade: "Leather",
    skills: ["Leather goods", "Handcrafted", "Sustainable"],
    experience: "15+ years experience",
    rating: 4.5,
    ctScore: 90,
    summary: "Crafting durable, high-end leather goods using sustainable tanning processes.",
    passportDetails: {
      location: "Agra, Uttar Pradesh",
      certifications: ["Leather Export Quality Cert"],
      notableProjects: ["Luxury Boutique Partnership"],
      contact: "vikram.leather@example.com"
    }
  }
];

function initMarketplace() {
  const grid = document.getElementById('karigar-grid');
  if (!grid) return;

  updateGallery();

  const closeBtn = document.getElementById('close-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  window.addEventListener('click', (e) => {
    const modal = document.getElementById('passport-modal');
    if (e.target === modal) {
      closeModal();
    }
  });
}

function updateGallery() {
  const grid = document.getElementById('karigar-grid');
  renderGallery(grid, KARIGARS);
}

function renderGallery(grid, artisans) {
  grid.innerHTML = '';

  if (artisans.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1; text-align: center; padding: 4rem 0; opacity: 0.6;">
        <p style="font-family: 'Yatra One'; font-size: 2rem; color: var(--brown);">No Artisans Found</p>
        <p>Try adjusting your search or filters to find the perfect craftsperson.</p>
      </div>
    `;
    return;
  }

  artisans.forEach(karigar => {
    const card = document.createElement('div');
    card.className = 'editorial-card';

    const photoUrl = `https://images.unsplash.com/photo-${getPhotoId(karigar.trade)}?auto=format&fit=crop&w=400&q=80`;

    card.innerHTML = `
      <div class="card-image-wrapper">
        <img src="${photoUrl}" alt="${karigar.name}" loading="lazy">
      </div>
      <div class="card-info">
        <span class="card-category">${karigar.trade}</span>
        <h3 class="card-name">${karigar.name}</h3>
        <div class="card-meta">
          <span>📍 ${karigar.passportDetails.location}</span>
          <span>▣ ${karigar.experience}</span>
        </div>
        <p class="card-description">${karigar.summary}</p>
        <div class="card-tags">
          ${karigar.skills.map(s => `<span class="card-tag">${s}</span>`).join('')}
        </div>
        <div class="card-footer">
          <div class="footer-metrics">
            <div class="footer-metric">
              <span class="metric-value">★ ${karigar.rating}</span>
              <span class="metric-label">Customer rating</span>
            </div>
            <div class="footer-metric">
              <span class="metric-value">CT ${karigar.ctScore}</span>
              <span class="metric-label">Craft Trust Score</span>
            </div>
          </div>
        </div>
      </div>
    `;
    card.addEventListener('click', () => openPassport(karigar.id));
    grid.appendChild(card);
  });
}

function getPhotoId(trade) {
  const map = {
    'Carpenter': '1582517611147-7473760f3069',
    'Embroidery': '1528605248642-79a973307ed5',
    'Brass Smith': '1590648773810-64a29c0663d4',
    'Weaver': '1584992357737-39926c0c1e4b',
    'Pottery': '1565191979795-739665c4e0a6',
    'Leather': '159067483760f3069'
  };
  return map[trade] || '1500648765548-90e62cba7987';
}

function openPassport(id) {
  const karigar = KARIGARS.find(k => k.id === id);
  if (!karigar) return;

  const container = document.getElementById('passport-container');
  const modal = document.getElementById('passport-modal');

  container.innerHTML = `
    <div class="guild-passport">
      <div class="passport-header">
        <div class="passport-seal">
          <span style="font-family: 'Yatra One'; font-size: 1.5rem; color: #fff;">${karigar.name[0]}</span>
        </div>
        <span class="passport-trade">${karigar.trade}</span>
        <h2>${karigar.name}</h2>
      </div>

      <div class="passport-body">
        <div class="passport-section">
          <h4>Experience</h4>
          <p class="passport-value">${karigar.experience}</p>
        </div>
        <div class="passport-section">
          <h4>Location</h4>
          <p class="passport-value">${karigar.passportDetails.location}</p>
        </div>
        <div class="passport-section">
          <h4>Community Trust</h4>
          <p class="passport-value">⭐ ${karigar.rating} / 5.0 (CT Score: ${karigar.ctScore})</p>
        </div>
        <div class="passport-section">
          <h4>Verified Contact</h4>
          <p class="passport-value">${karigar.passportDetails.contact}</p>
        </div>
        <div class="passport-section passport-full-width">
          <h4>Core Expertise</h4>
          <div class="specs-list" style="display: flex; gap: 8px; flex-wrap: wrap; list-style: none; padding: 0;">
            ${karigar.skills.map(s => `<li style="background: rgba(47, 107, 79, 0.1); color: var(--green); padding: 4px 12px; border-radius: var(--radius); font-size: 0.85rem; font-weight: 600;">${s}</li>`).join('')}
          </div>
        </div>
        <div class="passport-section passport-full-width">
          <h4>Certifications & Accreditations</h4>
          <p class="passport-value">${karigar.passportDetails.certifications.join(', ')}</p>
        </div>
        <div class="passport-section passport-full-width">
          <h4>Notable Works</h4>
          <p class="passport-value">${karigar.passportDetails.notableProjects.join(', ')}</p>
        </div>
        <div class="passport-section passport-full-width">
          <h4>Guild Summary</h4>
          <p class="passport-value" style="font-style: italic; opacity: 0.8;">${karigar.summary}</p>
        </div>
      </div>

      <div class="passport-footer">
        <button class="hire-artisan-btn" onclick="handleHire('${karigar.name}')">Hire ${karigar.name}</button>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function closeModal() {
  const modal = document.getElementById('passport-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function handleHire(name) {
  alert(`Hiring request sent to ${name}! They will be notified via their Karigar profile.`);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initMarketplace);
