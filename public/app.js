/* -------------------------------------------------
   Karigar – minimal landing‑page script
   ------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const elements = document.querySelectorAll('h1, h2, .label, .step-list li, .purpose-title, .purpose-text, .example h2');

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