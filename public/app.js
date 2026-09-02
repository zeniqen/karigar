/* -------------------------------------------------
   Karigar – minimal landing‑page script
   ------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('h1, h2, h3, .label, .logo-text, .footer-tagline, .cta-primary, .cta-secondary, .feature-icon, .step-icon, .differentiator h3, .final-cta h2, .final-cta-text');

  const fadeIn = (el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'none';
    }, 30);
  };

  elements.forEach(fadeIn);
});