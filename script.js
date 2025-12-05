document.addEventListener('DOMContentLoaded', function () {

  var leadForm = document.getElementById('lead-form');
  var submitBtn = document.getElementById('lead-submit');

  leadForm.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!leadForm.checkValidity()) {
      leadForm.reportValidity();
      return;
    }

    var team = document.getElementById('lf-team').value.trim();
    var email = document.getElementById('lf-email').value.trim();
    var message = document.getElementById('lf-message').value.trim();

    var payload = {
      team: team,
      email: email,
      message: message,
      source: 'inline_form'
    };

    var originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    fetch('submit.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'success') {
          submitBtn.textContent = 'Submitted';
          leadForm.reset();
        } else {
          submitBtn.textContent = 'Try again';
        }
      })
      .catch(() => {
        submitBtn.textContent = 'Try again';
      })
      .finally(() => {
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }, 1500);
      });
  });

});
