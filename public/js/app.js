/**
 * Brand.B — 360° Marketing Agency
 * Frontend Interactive Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Current Year
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Sticky Header blur & elevation
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  // 3. Mobile Navigation Drawer
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // 4. Reveal Animations via Intersection Observer
  const revealElements = document.querySelectorAll('.fade-up');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => revealObserver.observe(el));

  // 5. Number Counters in Hero Metrics
  const counters = document.querySelectorAll('.counter');
  let counted = false;

  const countUp = () => {
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const duration = 1800; // ms
      const stepTime = 25;
      const totalSteps = duration / stepTime;
      const increment = target / totalSteps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          counter.textContent = target;
          clearInterval(timer);
        } else {
          counter.textContent = Math.floor(current);
        }
      }, stepTime);
    });
  };

  const metricsBar = document.querySelector('.hero-metrics-bar');
  if (metricsBar) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          countUp();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    counterObserver.observe(metricsBar);
  }

  // 6. Interactive 360° Growth & ROI Estimator
  const domainBtns = document.querySelectorAll('#domainSelector .calc-option');
  const goalBtns = document.querySelectorAll('#goalSelector .calc-option');
  const budgetSlider = document.getElementById('budgetSlider');
  const budgetDisplay = document.getElementById('budgetDisplay');
  const planTitle = document.getElementById('outputPlanTitle');
  const planDesc = document.getElementById('outputPlanDesc');
  const deliverables = document.getElementById('outputDeliverables');
  const channels = document.getElementById('outputChannels');
  const expectedGrowth = document.getElementById('outputExpectedGrowth');
  const reporting = document.getElementById('outputReporting');
  const applyPlanBtn = document.getElementById('applyPlanBtn');

  let currentDomain = 'healthcare';
  let currentGoal = 'leads';
  let currentBudgetTier = 2;

  const budgetLabels = {
    1: 'Under ₹50,000 / mo',
    2: '₹50,000 - ₹1,50,000 / mo',
    3: '₹1,50,000 - ₹5,00,000 / mo',
    4: '₹5,00,000+ / mo'
  };

  const plansMatrix = {
    healthcare: {
      leads: {
        title: 'Patient Inquiry & High-Trust Clinic Engine',
        desc: 'Built specifically for medical clinics, ayurvedic centers, and healthcare providers to establish doctor authority and drive consistent consultations.',
        deliv: '12 Doctor Reels + 6 Carousels + Ad Creatives',
        chan: 'Meta Ads (Local Radius) + WhatsApp Automation',
        growth: '+40% to +75% Qualified Consults',
        report: 'Weekly CRM Telemetry & Ad CPL Tracking'
      },
      rebrand: {
        title: 'Healthcare Authority Identity & Rebrand',
        desc: 'Overhauls clinic visual presence, credentials, doctor presentation cards, patient care brochures, and modern responsive website.',
        deliv: 'Full Visual Suite + Clinic Website + Video Guidelines',
        chan: 'Brand Foundation + Google Business Profile Optimization',
        growth: '2.5x Increase in Walk-in Perceived Trust',
        report: 'Fortnightly Review Sprints'
      },
      scale: {
        title: '360° Omnichannel Healthcare Dominance',
        desc: 'Complete end-to-end management: brand, continuous video production, daily patient education, Meta/Google ads, and automated telecalling sync.',
        deliv: '20+ Videos + Daily Stories + Search Ads + CRM',
        chan: 'Meta Ads + Google Search Ads + Cloud CRM API',
        growth: '3x Pipeline Scale in 90 Days',
        report: 'Dedicated Account Strategist & Live Dashboard'
      }
    },
    retail: {
      leads: {
        title: 'D2C Direct Conversion & Retargeting Funnel',
        desc: 'Engineered for retail and e-commerce brands seeking higher average order value (AOV) and optimized customer acquisition costs.',
        deliv: 'Dynamic Catalogue Ads + 14 Lifestyle Reels',
        chan: 'Meta Ads + Google Shopping + Abandoned Cart Drip',
        growth: '3.8x to 5.2x Verified Ad ROAS',
        report: 'Real-time Conversion Pixel Telemetry'
      },
      rebrand: {
        title: 'Modern D2C Brand Identity & Packaging Sprint',
        desc: 'Complete aesthetic repositioning including logo marks, packaging dielines, typography system, and high-conversion Shopify/web store.',
        deliv: 'Logo + Packaging + 3D Product Mockups + Store UI',
        chan: 'E-commerce Platform + Instagram Visual Grid',
        growth: '45% Lift in On-Site Conversion Rate',
        report: 'Sprint Milestones Deliverable Reviews'
      },
      scale: {
        title: 'Full 360° Retail Market Expansion Engine',
        desc: 'High-frequency creative testing, omni-channel paid media, influencer co-creation, SEO optimization, and WhatsApp VIP customer clubs.',
        deliv: '30+ Creatives / mo + Google PPC + Web CRO',
        chan: 'Meta Ads + Google Performance Max + WhatsApp API',
        growth: '4x Scaled Gross Merchandise Value',
        report: 'Daily Ad Telemetry + Weekly Strategy Reviews'
      }
    },
    hospitality: {
      leads: {
        title: 'Footfall Attraction & Reservation Funnel',
        desc: 'Hyper-local geo-targeted food Reels, weekend table booking campaigns, and automated WhatsApp inquiry responses.',
        deliv: '16 Food Reels + Menu Highlights + Local Ads',
        chan: 'Instagram Geotargeting + Google Maps SEO',
        growth: '+50% Weekend Table Bookings',
        report: 'Weekly Reservation Analytics'
      },
      rebrand: {
        title: 'Boutique Culinary Identity & Menu Architecture',
        desc: 'Signature restaurant branding, tactile menu design, space signage guidelines, and immersive culinary photography direction.',
        deliv: 'Visual Identity + Menu Design + Social Templates',
        chan: 'Brand Book + Local Food Critic Media Kit',
        growth: 'Instant Category Buzz & Opening Week Sellouts',
        report: 'Phase-by-Phase Design Handoff'
      },
      scale: {
        title: '360° Multi-Outlet F&B Growth Engine',
        desc: 'Continuous localized promotion across multiple branch outlets, delivery app promotions, and customer loyalty retention loops.',
        deliv: 'Branch-wise Campaigns + Daily Stories + Local PR',
        chan: 'Meta Ads + WhatsApp Table Booking Engine',
        growth: 'Consistent 90%+ Capacity Utilization',
        report: 'Multi-Location Consolidated Dashboard'
      }
    },
    realestate: {
      leads: {
        title: 'High-Net-Worth Investor & Buyer Lead Engine',
        desc: 'Precision targeting for premium property launches, architectural walkthrough videos, and high-touch telecalling CRM workflows.',
        deliv: 'Project Showcase Videos + Lead Forms + Brochures',
        chan: 'Meta Ads + Google Search (High-Intent Keywords)',
        growth: '50+ Verified HNI Inquiries / mo',
        report: 'Real-Time Telecalling CRM Sync (<2min SLA)'
      },
      rebrand: {
        title: 'Luxury Property & Corporate Developer Identity',
        desc: 'Distinguished branding for real estate firms, master brochure design, 3D render styling, and high-impact investor pitch presentations.',
        deliv: 'Corporate Identity + Project Master Decks',
        chan: 'B2B Presentation Suites + Project Landing Web',
        growth: 'Significant Elevation in Per-Sqft Valuation',
        report: 'Milestone Execution Board'
      },
      scale: {
        title: '360° Real Estate Launch & Acquisition Machine',
        desc: 'Complete project rollout engine: drone cinematics, NRI/overseas targeted paid ads, telecalling pipeline, and automated booking portals.',
        deliv: 'End-to-end Media Production + Full PPC + Sales CRM',
        chan: 'Global Paid Ads + WhatsApp Cloud API + Telecall CRM',
        growth: 'Rapid Inventory Clearance Within 60 Days',
        report: 'Dedicated CRM Manager & Executive Briefings'
      }
    }
  };

  const updateCalculator = () => {
    budgetDisplay.textContent = budgetLabels[currentBudgetTier];
    const data = plansMatrix[currentDomain][currentGoal];
    if (data) {
      planTitle.textContent = data.title;
      planDesc.textContent = data.desc;
      deliverables.textContent = data.deliv;
      channels.textContent = data.chan;
      expectedGrowth.textContent = data.growth;
      reporting.textContent = data.report;
    }
  };

  domainBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      domainBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentDomain = btn.getAttribute('data-domain');
      updateCalculator();
    });
  });

  goalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      goalBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGoal = btn.getAttribute('data-goal');
      updateCalculator();
    });
  });

  if (budgetSlider) {
    budgetSlider.addEventListener('input', (e) => {
      currentBudgetTier = parseInt(e.target.value, 10);
      updateCalculator();
    });
  }

  // Pre-fill contact form when clicking "Lock in Sprint"
  if (applyPlanBtn) {
    applyPlanBtn.addEventListener('click', () => {
      const contactSec = document.getElementById('contact');
      const serviceSelect = document.getElementById('contactService');
      const budgetSelect = document.getElementById('contactBudget');
      const messageText = document.getElementById('contactMessage');

      if (serviceSelect) {
        if (currentGoal === 'leads') serviceSelect.value = 'Performance Marketing & Paid Ads';
        else if (currentGoal === 'rebrand') serviceSelect.value = 'Brand Strategy & Identity';
        else serviceSelect.value = 'Full 360° Growth Partnership';
      }

      if (budgetSelect) {
        if (currentBudgetTier === 1) budgetSelect.value = 'Under ₹50,000 / mo';
        else if (currentBudgetTier === 2) budgetSelect.value = '₹50,000 - ₹1,50,000 / mo';
        else if (currentBudgetTier === 3) budgetSelect.value = '₹1,50,000 - ₹5,00,000 / mo';
        else budgetSelect.value = '₹5,00,000+ / mo';
      }

      if (messageText) {
        messageText.value = `Selected Sprint Plan: ${planTitle.textContent}. We are in ${currentDomain} and our goal is ${currentGoal}. Looking forward to discussing implementation.`;
      }

      contactSec.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Initialize calculator on page load
  updateCalculator();

  // 7. FAQ Accordion Interaction
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close other items
      faqItems.forEach(other => {
        other.classList.remove('active');
        other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // 8. Contact Form Submission (POST /api/contact)
  const contactForm = document.getElementById('contactForm');
  const formResponse = document.getElementById('formResponse');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.btn-submit');
      const formData = new FormData(contactForm);
      const payload = Object.fromEntries(formData.entries());

      // Validation
      if (!payload.name || payload.name.trim().length < 2) {
        showStatus(formResponse, 'Please enter your full name.', 'error');
        return;
      }
      if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
        showStatus(formResponse, 'Please enter a valid work email address.', 'error');
        return;
      }
      if (!payload.service) {
        showStatus(formResponse, 'Please select your core service interest.', 'error');
        return;
      }
      if (!payload.message || payload.message.trim().length < 8) {
        showStatus(formResponse, 'Please provide a brief project overview.', 'error');
        return;
      }

      // Honeypot check on client
      if (payload.lead_trap) {
        showStatus(formResponse, 'Thank you! Your request has been received.', 'success');
        contactForm.reset();
        return;
      }

      setLoading(submitBtn, true);
      showStatus(formResponse, 'Submitting your growth request to Brand.B...', '');

      const isFile = window.location.protocol === 'file:';
      const endpoint = isFile ? 'http://localhost:3000/api/contact' : '/api/contact';

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok && data.ok) {
          showStatus(formResponse, `✓ Success: ${data.message}`, 'success');
          contactForm.reset();
        } else {
          showStatus(formResponse, data.message || (data.errors && data.errors.join(', ')) || 'An error occurred. Please try again.', 'error');
        }
      } catch (err) {
        if (isFile) {
          // Running directly via file:// without localhost server running
          showStatus(formResponse, '✓ Inquiry simulated successfully (Offline Preview Mode). Run "node server.js" or double-click "start.bat" to enable live backend lead capture!', 'success');
          contactForm.reset();
        } else {
          showStatus(formResponse, 'Network error. Please try again or reach out directly on WhatsApp.', 'error');
        }
      } finally {
        setLoading(submitBtn, false);
      }
    });
  }

  // 9. Free Brand Audit Form (POST /api/audit)
  const auditForm = document.getElementById('auditForm');
  const auditStatus = document.querySelector('.audit-status');

  if (auditForm) {
    auditForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = auditForm.querySelector('button[type="submit"]');
      const formData = new FormData(auditForm);
      const payload = Object.fromEntries(formData.entries());

      if (!payload.name || !payload.email || !payload.phone || !payload.website) {
        showStatus(auditStatus, 'Please fill in all required fields.', 'error');
        return;
      }

      setLoading(submitBtn, true);
      showStatus(auditStatus, 'Generating audit ticket...', '');

      const isFile = window.location.protocol === 'file:';
      const endpoint = isFile ? 'http://localhost:3000/api/audit' : '/api/audit';

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (res.ok && data.ok) {
          showStatus(auditStatus, `✓ Audit request received! Ticket: ${data.id}. Our strategist will email your review in 24h.`, 'success');
          auditForm.reset();
        } else {
          showStatus(auditStatus, data.message || 'Could not process audit request.', 'error');
        }
      } catch (err) {
        if (isFile) {
          showStatus(auditStatus, '✓ Audit request recorded (Offline Preview Mode). Start Node server for live cloud sync.', 'success');
          auditForm.reset();
        } else {
          showStatus(auditStatus, 'Network error. Please try again.', 'error');
        }
      } finally {
        setLoading(submitBtn, false);
      }
    });
  }

  // Helper UI functions
  function showStatus(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.className = type ? `${element.className.split(' ')[0]} ${type}` : element.className.split(' ')[0];
  }

  function setLoading(btn, isLoading) {
    if (!btn) return;
    btn.disabled = isLoading;
    const textSpan = btn.querySelector('span:first-child');
    if (isLoading) {
      btn.dataset.prevText = textSpan ? textSpan.textContent : btn.textContent;
      if (textSpan) textSpan.textContent = 'Processing...';
    } else {
      if (textSpan && btn.dataset.prevText) textSpan.textContent = btn.dataset.prevText;
    }
  }
});
