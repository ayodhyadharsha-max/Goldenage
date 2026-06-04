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
   Form Validation & Live Lead Submission to Email
------------------------------------------------------- */
function initLeadFormHandler() {
  const form = document.getElementById('qualifying-lead-form');
  const feedback = document.getElementById('form-feedback-message');
  const submitBtn = document.getElementById('submit-form-button');

  if (!form || !feedback) return;

  const budgetMap = {
    '3-5-cr': '₹3.0 Crore – ₹5.0 Crore',
    '5-10-cr': '₹5.0 Crore – ₹10.0 Crore',
    '10-cr-plus': '₹10.0 Crore +'
  };
  const configMap = {
    '3-bhk': '3 BHK Luxury Flat',
    '4-bhk': '4 BHK Premium Residence',
    'penthouse': 'Penthouse / Duplex'
  };
  const locationMap = {
    'dwarka-expressway': 'Dwarka Expressway Corridor',
    'new-gurgaon': 'New Gurgaon Sectors',
    'golf-course-ext': 'Golf Course Extension Rd'
  };

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
    submitBtn.innerHTML = `<span>Securing Invitation...</span>`;

    // Send data securely via Web3Forms API
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: "c83ee11e-e347-45da-9b50-14b70883c398",
        subject: `New VIP Lead: ${name} (${budgetMap[budget] || budget})`,
        from_name: "Gurgaon Luxury LP",
        "Full Name": name,
        "Phone Number": phone,
        "Email Address": email,
        "Budget Range": budgetMap[budget] || budget,
        "Desired Configuration": configMap[config] || config,
        "Preferred Location": locationMap[location] || location,
        "Selected Project/Context": document.getElementById('selected-project').value
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;

      // Success Response
      feedback.classList.add('success');
      feedback.textContent = `VIP Invitation Secured! Inquiry sent successfully.`;

      setTimeout(() => {
        form.reset();

        // Reset form title to default
        const formTitle = document.querySelector('.form-card-title');
        if (formTitle) {
          formTitle.textContent = 'Free Consultation — No Charges';
        }
      }, 1500);
    })
    .catch(error => {
      console.error('Submission Error:', error);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      
      feedback.classList.add('error');
      feedback.textContent = 'Something went wrong. Please check your network connection and try again.';
    });
  });
}
