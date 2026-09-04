/**
 * Karigar Marketplace Logic
 * Handles rendering the artisan gallery and the detailed Skill Passport modal.
 */

const KARIGARS = [
  {
    id: "k1",
    name: "Arjun Sharma",
    trade: "Master Carpenter",
    skills: ["Teak Woodworking", "Intricate Carving", "Furniture Restoration"],
    experience: "15 years",
    rating: 4.9,
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
    name: "Meera Bai",
    trade: "Handloom Weaver",
    skills: ["Banarasi Silk", "Zari Work", "Natural Dyeing"],
    experience: "10 years",
    rating: 4.7,
    summary: "Expert in traditional Banarasi silk weaving with a focus on sustainable dyes.",
    passportDetails: {
      location: "Varanasi, UP",
      "certifications": ["Handloom Export Board Certified"],
      notableProjects: ["National Textile Exhibition 2021"],
      contact: "meera.weaver@example.com"
    }
  },
  {
    id: "k3",
    name: "Suresh Iyer",
    trade: "Brass Smith",
    skills: ["Traditional Casting", "Fine Engraving", "Temple Art"],
    experience: "20 years",
    rating: 4.8,
    summary: "Creating sacred brassware and intricate ornaments for two decades.",
    passportDetails: {
      location: "Thanjavur, Tamil Nadu",
      certifications: ["Heritage Craft Guild Gold Member"],
      notableProjects: ["Brihadeeswara Temple Art Restoration"],
      contact: "suresh.brass@example.com"
    }
  },
  {
    id: "k4",
    name: "Priya Das",
    trade: "Pottery Artist",
    skills: ["Terracotta Sculpting", "Glazing", "Wheel Throwing"],
    experience: "7 years",
    rating: 4.6,
    summary: "Contemporary terracotta artist blending modern forms with ancient techniques.",
    passportDetails: {
      location: "Kolkata, West Bengal",
      certifications: ["Fine Arts Diploma"],
      notableProjects: ["Urban Clay Installation 2023"],
      contact: "priya.clay@example.com"
    }
  },
  {
    id: "k5",
    name: "Vikram Singh",
    trade: "Leather Artisan",
    skills: ["Hand-Stitching", "Vegetable Tanning", "Custom Footwear"],
    experience: "12 years",
    rating: 4.5,
    summary: "Crafting durable, high-end leather goods using sustainable tanning processes.",
    passportDetails: {
      location: "Kanpur, UP",
      certifications: ["Leather Export Quality Cert"],
      notableProjects: ["Luxury Boutique Partnership"],
      contact: "vikram.leather@example.com"
    }
  },
  {
    id: "k6",
    name: "Anjali Rao",
    trade: "Embroidery Expert",
    skills: ["Zardosi", "Kantha Work", "Mirror Work"],
    experience: "8 years",
    rating: 4.9,
    summary: "Preserving the rich heritage of Indian embroidery through intricate hand-work.",
    passportDetails: {
      location: "Lucknow, UP",
      certifications: ["Textile Arts Certification"],
      notableProjects: ["Cultural Fashion Week 2022"],
      contact: "anjali.thread@example.com"
    }
  }
];

function initMarketplace() {
  const grid = document.getElementById('karigar-grid');
  if (!grid) return;

  renderGallery(grid);

  const closeBtn = document.getElementById('close-modal');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  // Close modal when clicking outside the content
  window.addEventListener('click', (e) => {
    const modal = document.getElementById('passport-modal');
    if (e.target === modal) {
      closeModal();
    }
  });
}

function renderGallery(grid) {
  grid.innerHTML = '';

  KARIGARS.forEach(karigar => {
    const card = document.createElement('div');
    card.className = 'summary-card';
    card.innerHTML = `
      <div class="trade-label">${karigar.trade}</div>
      <h3>${karigar.name}</h3>
      <div class="rating">⭐ ${karigar.rating}</div>
      <p class="summary-text">${karigar.summary}</p>
    `;
    card.addEventListener('click', () => openPassport(karigar.id));
    grid.appendChild(card);
  });
}

function openPassport(id) {
  const karigar = KARIGARS.find(k => k.id === id);
  if (!karigar) return;

  const container = document.getElementById('passport-container');
  const modal = document.getElementById('passport-modal');

  container.innerHTML = `
    <div class="passport-card">
      <div class="passport-header">
        <h2>${karigar.name}</h2>
        <span class="trade-badge">${karigar.trade}</span>
      </div>

      <div class="passport-details">
        <div class="detail-item">
          <span class="detail-label">Experience</span>
          <span class="detail-value">${karigar.experience}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Location</span>
          <span class="detail-value">${karigar.passportDetails.location}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Rating</span>
          <span class="detail-value">⭐ ${karigar.rating} / 5.0</span>
        </div>
        <div class="detail-item full">
          <span class="detail-label">Core Skills</span>
          <ul class="specs-list">
            ${karigar.skills.map(s => `<li>${s}</li>`).join('')}
          </ul>
        </div>
        <div class="detail-item full">
          <span class="detail-label">Certifications</span>
          <p class="detail-value">${karigar.passportDetails.certifications.join(', ')}</p>
        </div>
        <div class="detail-item full">
          <span class="detail-label">Notable Projects</span>
          <p class="detail-value">${karigar.passportDetails.notableProjects.join(', ')}</p>
        </div>
        <div class="detail-item full">
          <span class="detail-label">About</span>
          <p class="summary-text">${karigar.summary}</p>
        </div>
      </div>

      <div class="hire-button">
        <button class="cta-primary" onclick="handleHire('${karigar.name}')">Hire ${karigar.name}</button>
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
