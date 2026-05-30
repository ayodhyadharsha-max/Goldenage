/* ----------------------------------------------------
   Gurgaon Luxury Real Estate - Client-side Logic
------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFaqAccordions();
  initRoiCalculator();
  initCardSelection();
  initLeadFormHandler();
});

/* ----------------------------------------------------
   Mobile Navigation Menu Toggle
------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navOverlay = document.getElementById('mobile-nav');
  const navLinks = document.querySelectorAll('.mobile-nav-item');

  if (!menuBtn || !navOverlay) return;

  function toggleMenu() {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', !isExpanded);
    navOverlay.classList.toggle('active');
    navOverlay.setAttribute('aria-hidden', isExpanded);
    
    // Toggle menu button animation states
    const spans = menuBtn.querySelectorAll('span');
    if (!isExpanded) {
      spans[0].style.transform = 'translateY(8px) rotate(45deg)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
    } else {
      spans[0].style.transform = 'none';
      spans[1].style.opacity = '1';
      spans[2].style.transform = 'none';
    }
  }

  menuBtn.addEventListener('click', toggleMenu);

  // Close overlay when clicking any of the links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navOverlay.classList.contains('active')) {
        toggleMenu();
      }
    });
  });
}

/* ----------------------------------------------------
   FAQ Accordions Logic (a11y compliant)
------------------------------------------------------- */
function initFaqAccordions() {
  const triggers = document.querySelectorAll('.faq-trigger');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
      const targetId = trigger.getAttribute('aria-controls');
      const panel = document.getElementById(targetId);

      if (!panel) return;

      // Close all other panels for clean accordions look
      triggers.forEach(otherTrigger => {
        if (otherTrigger !== trigger && otherTrigger.getAttribute('aria-expanded') === 'true') {
          otherTrigger.setAttribute('aria-expanded', 'false');
          const otherPanelId = otherTrigger.getAttribute('aria-controls');
          const otherPanel = document.getElementById(otherPanelId);
          if (otherPanel) {
            otherPanel.style.maxHeight = '0';
            otherPanel.setAttribute('aria-hidden', 'true');
          }
        }
      });

      // Toggle current panel
      trigger.setAttribute('aria-expanded', !isExpanded);
      panel.setAttribute('aria-hidden', isExpanded);
      
      if (!isExpanded) {
        panel.style.maxHeight = panel.scrollHeight + 'px';
      } else {
        panel.style.maxHeight = '0';
      }
    });
  });
}

/* ----------------------------------------------------
   Interactive ROI Calculator
------------------------------------------------------- */
function initRoiCalculator() {
  const capitalSlider = document.getElementById('roi-capital');
  const yearsSlider = document.getElementById('roi-years');
  const capitalDisplay = document.getElementById('roi-capital-display');
  const yearsDisplay = document.getElementById('roi-years-display');

  const resCapital = document.getElementById('res-capital');
  const resAppreciation = document.getElementById('res-appreciation');
  const resRental = document.getElementById('res-rental');
  const resGrowth = document.getElementById('res-growth');

  if (!capitalSlider || !yearsSlider) return;

  const cagr = 0.125; // 12.5% projected capital growth
  const rentalYield = 0.04; // 4% net rental yield

  function formatCr(value) {
    const cr = value / 10000000;
    return `₹${cr.toFixed(2)} Cr`;
  }

  function formatLakhs(value) {
    const lakhs = value / 100000;
    return `₹${lakhs.toFixed(2)} L`;
  }

  function calculateReturns() {
    const capital = parseFloat(capitalSlider.value);
    const years = parseInt(yearsSlider.value);

    // Update displays
    capitalDisplay.textContent = formatCr(capital);
    yearsDisplay.textContent = `${years} Year${years > 1 ? 's' : ''}`;

    // Appreciation Projection: Future Value = P * (1 + r)^n
    const futureVal = capital * Math.pow(1 + cagr, years);
    const totalGrowthPct = ((futureVal - capital) / capital) * 100;
    const estRentalYr = capital * rentalYield;

    // Output formatting to results tiles
    resCapital.textContent = formatCr(capital);
    resAppreciation.textContent = formatCr(futureVal);
    resRental.textContent = `${formatLakhs(estRentalYr)} / Year`;
    resGrowth.textContent = `${totalGrowthPct.toFixed(1)}% Growth`;
  }

  capitalSlider.addEventListener('input', calculateReturns);
  yearsSlider.addEventListener('input', calculateReturns);

  // Run initial calculation
  calculateReturns();
}

/* ----------------------------------------------------
   Card Quick Action Linkage
------------------------------------------------------- */
function initCardSelection() {
  const cardCTAs = document.querySelectorAll('.btn-card-action');
  const projectInput = document.getElementById('selected-project');
  const leadSection = document.getElementById('lead-section');

  cardCTAs.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Allow scroll first, don't interrupt browser default jump
      const projectName = btn.getAttribute('data-project');
      if (projectInput && projectName) {
        projectInput.value = `Schedule Tour: ${projectName}`;
        
        // Visual indicator in form of the selected project
        const formTitle = document.querySelector('.form-card-title');
        if (formTitle) {
          formTitle.innerHTML = `Tour Booking: <span style="color: var(--accent-gold); font-size: 1.25rem; display: block; margin-top: 4px;">${projectName}</span>`;
        }
      }
    });
  });
}

/* ----------------------------------------------------
   Form Validation & Mock Lead Submission
------------------------------------------------------- */
function initLeadFormHandler() {
  const form = document.getElementById('qualifying-lead-form');
  const feedback = document.getElementById('form-feedback-message');
  const submitBtn = document.getElementById('submit-form-button');

  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Reset styles and text
    feedback.className = 'form-feedback';
    feedback.textContent = '';

    const name = document.getElementById('lead-name').value.trim();
    const phone = document.getElementById('lead-phone').value.trim();
    const email = document.getElementById('lead-email').value.trim();
    const budget = document.getElementById('lead-budget').value;
    const config = document.getElementById('lead-config').value;
    const location = document.getElementById('lead-location').value;
    const agreement = document.getElementById('lead-agreement').checked;

    // Basic Validations
    if (!name || !phone || !email || !budget || !config || !location) {
      feedback.classList.add('error');
      feedback.textContent = 'Please fill out all mandatory qualifying fields.';
      return;
    }

    if (!agreement) {
      feedback.classList.add('error');
      feedback.textContent = 'You must authorize contact terms to proceed.';
      return;
    }

    // High ticket check warning (should always pass since select has only high values, but serves as client side lock)
    if (budget !== '3-5-cr' && budget !== '5-10-cr' && budget !== '10-cr-plus') {
      feedback.classList.add('error');
      feedback.textContent = 'Investment criteria starting threshold is ₹3.0 Crore.';
      return;
    }

    // Submit state loading indicator
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span>Validating Criteria...</span>`;

    // Simulate luxury lead dispatch server call
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      
      // Success Response
      feedback.classList.add('success');
      feedback.textContent = `Invitation Secured! Our Private Wealth Executive will contact you shortly at ${phone}.`;
      
      // Redirect to WhatsApp chat after successful signup (optional UX delight)
      const encodedMsg = encodeURIComponent(
        `Hello GoldenAge Landbase, I have registered my interest for luxury residences in Gurgaon. Name: ${name}, Configuration: ${config}, Budget: ${budget}. Please share the portfolio.`
      );
      
      setTimeout(() => {
        window.open(`https://wa.me/919311996911?text=${encodedMsg}`, '_blank');
        form.reset();
        
        // Reset form title to default
        const formTitle = document.querySelector('.form-card-title');
        if (formTitle) {
          formTitle.textContent = 'Secure VIP Invitation';
        }
      }, 1500);

    }, 1800);
  });
}
