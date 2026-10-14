const navToggle = document.querySelector('.nav-toggle');
const mainNav = document.querySelector('.main-nav');
const navLinks = document.querySelectorAll('.main-nav a');
const form = document.querySelector('.contact-form');
const statusMessage = document.querySelector('.form-status');
const yearSpan = document.getElementById('year');

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (form && statusMessage) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('.form-btn');
    const name = document.getElementById('name')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const message = document.getElementById('message')?.value.trim() || '';
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validation
    if (!name || name.length < 2) {
      statusMessage.textContent = 'Please enter your name.';
      statusMessage.style.color = '#ffd4d4';
      return;
    }
    if (!email || !emailPattern.test(email)) {
      statusMessage.textContent = 'Please enter a valid email address.';
      statusMessage.style.color = '#ffd4d4';
      return;
    }
    if (!message || message.length < 10) {
      statusMessage.textContent = 'Your message should be at least 10 characters long.';
      statusMessage.style.color = '#ffd4d4';
      return;
    }

    // Loading state
    submitButton.disabled = true;
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    statusMessage.textContent = '';

    try {
      // EmailJS integration – values from environment variables
      const serviceID = process.env.EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID';
      const templateID = process.env.EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID';
      const publicKey = process.env.EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY';
      const personalEmail = process.env.PERSONAL_EMAIL || 'YOUR_PERSONAL_EMAIL';

      // Initialise EmailJS (if not already)
      if (typeof emailjs !== 'undefined' && emailjs.init) {
        emailjs.init(publicKey);
      }

      const templateParams = {
        from_name: name,
        reply_to: email,
        message: message,
        to_email: personalEmail,
      };

      await emailjs.send(serviceID, templateID, templateParams);

      statusMessage.textContent = 'Thanks! Your message has been sent successfully.';
      statusMessage.style.color = '#b8f5d2';
      form.reset();
    } catch (error) {
      console.error('Email sending error:', error);
      statusMessage.textContent = 'Oops! Something went wrong. Please try again later.';
      statusMessage.style.color = '#ff6b6b';
    } finally {
      // Reset button
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
}
