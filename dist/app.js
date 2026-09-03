/* -------------------------------------------------
   Karigar – Scroll Animations
   ------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  // Elements we want to animate in as we scroll
  const revealElements = [
    '.hero-text',
    '.hero-visual',
    '.intro-box',
    '.feature-card',
    '.step',
    '.differentiator',
    '.final-cta h2',
    '.final-cta-text',
    '.footer-content'
  ];

  const targets = document.querySelectorAll(revealElements.join(', '));

  targets.forEach(el => {
    el.classList.add('reveal');
  });

  // Add staggered delay for groups
  const groupSelectors = ['.features-grid', '.process', '.differentiators'];
  groupSelectors.forEach(selector => {
    const group = document.querySelector(selector);
    if (group) {
      const children = group.querySelectorAll('.reveal');
      children.forEach((child, index) => {
        child.style.transitionDelay = `${index * 0.15}s`;
      });
    }
  });

  const observerOptions = {
    root: null,
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  targets.forEach(el => {
    observer.observe(el);
  });
});