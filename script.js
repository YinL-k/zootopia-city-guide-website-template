document.addEventListener('DOMContentLoaded', function () {
  // --- Mobile navigation toggle (hamburger) ---
  var mobileToggle = document.querySelector('.mobile-menu-toggle');
  var navLinks = document.querySelector('.nav-links');
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', function () {
      navLinks.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });
  }

  // --- Smooth scroll for in-page links (navbar etc.) ---
  function smoothScrollTo(targetId) {
    var target = document.getElementById(targetId);
    if (!target) return;
    var offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || href === '#') return;
      var id = href.substring(1);
      if (!id) return;
      if (document.getElementById(id)) {
        e.preventDefault();
        smoothScrollTo(id);
      }
    });
  });

  // --- Hero CTA button: scroll down to contact section ---
  var contactSection = document.getElementById('contact');
  document.querySelectorAll('.cta-trigger').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      if (contactSection) {
        e.preventDefault();
        smoothScrollTo('contact');
      }
    });
  });

  // --- Inline lead form submit -> submit.php + MariaDB ---
  var leadForm = document.getElementById('lead-form');
  var leadSubmitButton = document.getElementById('lead-submit');

  if (leadForm && leadSubmitButton) {
    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // 先用浏览器自带的校验检查所有 required 和 type="email"
      if (!leadForm.checkValidity()) {
        // 这一句会弹出浏览器原生的错误提示，比如 “Please include an '@' in the email address”
        leadForm.reportValidity();
        return;
      }

      var teamInput = document.getElementById('lf-team');
      var emailInput = document.getElementById('lf-email');
      var messageInput = document.getElementById('lf-message');

      var team = teamInput ? teamInput.value.trim() : '';
      var email = emailInput ? emailInput.value.trim() : '';
      var message = messageInput ? messageInput.value.trim() : '';

      var btn = leadSubmitButton;
      var originalText = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Sending...';

      var payload = {
        team: team,
        email: email,
        message: message,
        source: 'inline_form'
      };

      fetch('submit.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data && data.status === 'success') {
            btn.textContent = 'Submitted';
            leadForm.reset();
          } else {
            console.error('Submit error:', data);
            btn.textContent = 'Try again';
          }
        })
        .catch(function (err) {
          console.error('Network error:', err);
          btn.textContent = 'Try again';
        })
        .finally(function () {
          setTimeout(function () {
            btn.disabled = false;
            btn.textContent = originalText;
          }, 1500);
        });
    });
  }
});
