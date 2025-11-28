// --- Helpers: tracking safe wrappers ---
function track(event, params = {}) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', event, params);
  } else {
    console.debug('[track]', event, params);
  }
}
function trackConversion(sendTo) {
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', { send_to: sendTo });
  } else {
    console.debug('[conversion]', sendTo);
  }
}

// Mobile menu toggle + UI
document.addEventListener('DOMContentLoaded', function() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      navLinks.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
      track('menu_toggle', { state: navLinks.classList.contains('active') ? 'open' : 'close' });
    });
  }

  // Smooth scrolling for nav
  document.querySelectorAll('.nav-links a[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        track('nav_click', { target: targetId });
      }
    });
  });

  // CTA buttons -> open modal
  const buttons = document.querySelectorAll('.cta-trigger');
  buttons.forEach(button => {
    button.addEventListener('click', function() {
      const label = this.textContent.trim();
      track('cta_click', { label });
      if (label.toLowerCase().includes('sample') || label.toLowerCase().includes('quote')) {
        showContactModal(label);
      }
    });
  });

  // Observe sections for scroll animation
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });

  // Navbar background on scroll
  window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
      navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
      navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
      navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
      navbar.style.boxShadow = 'none';
    }
  });

  // Counter animation
  function animateCounters() {
    const counters = document.querySelectorAll('.stat-number, .reach-number');
    counters.forEach(counter => {
      const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        const suffix = counter.textContent.replace(/[\d]/g, '');
        counter.textContent = Math.floor(current) + suffix;
      }, 16);
    });
  }
  const statsSection = document.querySelector('.hero-stats');
  if (statsSection) {
    const statsObserver = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }

  // Sticky CTA button
  const stickyBtn = document.createElement('button');
  stickyBtn.textContent = 'Get Quote';
  stickyBtn.className = 'btn-primary sticky-cta cta-trigger';
  stickyBtn.setAttribute('aria-label', 'Get Quote');
  document.body.appendChild(stickyBtn);
  stickyBtn.addEventListener('click', () => {
    track('sticky_cta_click');
    showContactModal('Get Quote');
  });

  // Resource links tracking
  document.querySelectorAll('.resources-section a[data-track="resource"]').forEach(a => {
    a.addEventListener('click', () => track('resource_click', { href: a.href }));
  });

  // Inline lead form submission
  const leadForm = document.getElementById('lead-form');
  const leadSubmitButton = document.getElementById('lead-submit');
  if (leadForm && leadSubmitButton) {
    leadForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      const btn = leadSubmitButton;
      btn.disabled = true;
      const original = btn.textContent;
      btn.textContent = 'Sending...';

      // Build payload
      const payload = {
        company: document.getElementById('lf-company').value.trim(),
        email: document.getElementById('lf-email').value.trim(),
        message: document.getElementById('lf-message').value.trim(),
        source: 'inline_form'
      };

      try {
        // TODO: replace with real endpoint (Formspree/HubSpot/your backend)
        // Example: await fetch('https://formspree.io/f/XXXXXXX', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
        await new Promise(r => setTimeout(r, 800)); // simulate

        track('lead_submit', { origin: 'inline' });
        // Replace with your conversion ID
        trackConversion('AW-XXXXXXX/quote_submit');
        btn.textContent = 'Submitted';
        setTimeout(() => { btn.textContent = original; btn.disabled = false; leadForm.reset(); }, 1500);
      } catch (err) {
        console.error(err);
        btn.textContent = 'Try Again';
        btn.disabled = false;
      }
    });
  }
});

// Contact modal
function showContactModal(buttonType) {
  const modal = document.createElement('div');
  modal.className = 'contact-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3>${buttonType.toLowerCase().includes('sample') ? 'Request Sample Kit' : 'Get Instant Quote'}</h3>
        <button class="modal-close" aria-label="Close">&times;</button>
      </div>
      <div class="modal-body">
        <form class="contact-form">
          <div class="form-group">
            <label for="company">Company Name *</label>
            <input type="text" id="company" name="company" required>
          </div>
          <div class="form-group">
            <label for="name">Contact Name *</label>
            <input type="text" id="name" name="name" required>
          </div>
          <div class="form-group">
            <label for="email">Email Address *</label>
            <input type="email" id="email" name="email" required>
          </div>
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone">
          </div>
          <div class="form-group">
            <label for="product">Product Interest</label>
            <select id="product" name="product">
              <option value="">Select Product Line</option>
              <option value="non-slip-grabbers">BlueFront Non-Slip Grabbers — 6 Studs Ice Cleats Whole Cover</option>
              <option value="flexclaw">BlueFront FlexClaw — Convertible Front Cover Ice Cleats with Strap System</option>
              <option value="icewalker-pro">BlueFront IceWalker Pro — Tungsten-Toe Ice Cleats for Everyday Traction</option>
              <option value="griprunner">BlueFront GripRunner — 11-Spike Full Traction for Extreme Winter Grip</option>
              <option value="motoshield">BlueFront MotoShield — Rubber Motorcycle Rain Shoe Covers</option>
              <option value="steelgrip-pro">BlueFront SteelGrip Pro — 21-Tooth Stainless Steel Ice Cleats for Hiking &amp; Mountaineering</option>
            </select>
          </div>
          <div class="form-group">
            <label for="quantity">Expected Quantity</label>
            <select id="quantity" name="quantity">
              <option value="">Select Quantity Range</option>
              <option value="1000-3000">1000~3000 pairs</option>
              <option value="3000-10000">3000~10,000 pairs</option>
              <option value="10000-20000">10,000~20,000 pairs</option>
              <option value="20000+">20,000 pairs+</option>
            </select>
          </div>
          <div class="form-group">
            <label for="samples">Sample Quantity</label>
            <select id="samples" name="samples">
              <option value="">Select Sample Quantity</option>
              <option value="1-2">1~2 pairs / model</option>
              <option value="3-5">3~5 pairs / model</option>
            </select>
          </div>
          <div class="form-group">
            <label for="message">Additional Requirements</label>
            <textarea id="message" name="message" rows="4" placeholder="Tell us your requirements, timeline, or questions..."></textarea>
          </div>
          <button type="submit" class="btn-primary large">
            ${buttonType.toLowerCase().includes('sample') ? 'Request Sample Kit' : 'Get Quote'}
          </button>
        </form>
      </div>
    </div>
  `;

  // Modal styles
  const modalStyles = `
    <style>
      .contact-modal{position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.8);display:flex;justify-content:center;align-items:center;z-index:10000;opacity:0;transition:opacity .3s ease}
      .contact-modal.show{opacity:1}
      .modal-content{background:#fff;border-radius:16px;width:90%;max-width:600px;max-height:90vh;overflow-y:auto;transform:translateY(30px);transition:transform .3s ease}
      .contact-modal.show .modal-content{transform:translateY(0)}
      .modal-header{padding:2rem 2rem 1rem;border-bottom:1px solid #e2e8f0;display:flex;justify-content:space-between;align-items:center}
      .modal-header h3{margin:0;color:#1a202c}
      .modal-close{background:none;border:none;font-size:2rem;cursor:pointer;color:#718096;padding:0;width:30px;height:30px;display:flex;align-items:center;justify-content:center}
      .modal-close:hover{color:#2d3748}
      .modal-body{padding:2rem}
      .contact-form{display:flex;flex-direction:column;gap:1.5rem}
      .form-group{display:flex;flex-direction:column}
      .form-group label{margin-bottom:.5rem;font-weight:600;color:#2d3748}
      .form-group input,.form-group select,.form-group textarea{padding:12px;border:2px solid #e2e8f0;border-radius:8px;font-size:1rem;transition:border-color .3s ease}
      .form-group input:focus,.form-group select:focus,.form-group textarea:focus{outline:none;border-color:#f56500}
      .form-group textarea{resize:vertical;min-height:100px}
    </style>
  `;
  document.head.insertAdjacentHTML('beforeend', modalStyles);
  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add('show'), 10);

  const closeBtn = modal.querySelector('.modal-close');
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(); });

  const form = modal.querySelector('.contact-form');
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(form);
    formData.append('source', 'modal');

    try {
      // TODO: replace with real endpoint
      // await fetch('https://formspree.io/f/XXXXXXX', { method:'POST', body: formData });
      await new Promise(r => setTimeout(r, 800)); // simulate

      track('lead_submit', { origin: 'modal' });
      trackConversion('AW-XXXXXXX/quote_submit'); // replace with real send_to
      alert('Thank you! We will contact you within 24 hours with your sample kit and pricing information.');
      closeModal();
    } catch (err) {
      console.error(err);
      submitBtn.textContent = 'Try Again';
      submitBtn.disabled = false;
    } finally {
      submitBtn.textContent = originalText;
    }
  });

  function closeModal() {
    modal.classList.remove('show');
    setTimeout(() => { document.body.removeChild(modal); }, 300);
  }
}

// Parallax + hover effects
document.addEventListener('DOMContentLoaded', function() {
  window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image img');
    if (heroImage) {
      const speed = scrolled * 0.5;
      heroImage.style.transform = `translateY(${speed}px)`;
    }
  });

  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-12px) scale(1.02)';
    });
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
});
