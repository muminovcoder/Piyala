const COMPANY = (() => {
  function renderAbout() {
    const el = document.getElementById('company-about');
    if (!el || el.dataset.rendered) return;
    el.dataset.rendered = '1';
    el.innerHTML = `
      <div class="stagger-1" style="margin-bottom:20px;background:linear-gradient(135deg,#5856D6,#007AFF);border-radius:16px;padding:24px;color:#fff">
        <div style="display:flex;align-items:center;gap:14px">
          <div style="width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:20px"><i class="ti ti-star"></i></div>
          <div>
            <h2 style="font-size:22px;font-weight:700;margin:0;line-height:1.2">About VocabMaster AI</h2>
            <p style="font-size:13px;opacity:0.85;margin:4px 0 0">Empowering learners worldwide with AI-powered vocabulary tools</p>
          </div>
        </div>
      </div>
      <div class="cp-body">
        <div class="cp-card cp-reveal">
          <div class="cp-card-icon"><i class="ti ti-rocket"></i></div>
          <h2 class="cp-card-title">Our Mission</h2>
          <p class="cp-card-text">VocabMaster AI is a next-generation vocabulary learning platform that combines artificial intelligence with proven spaced repetition techniques. We help learners master thousands of words efficiently through smart flashcards, contextual learning, and personalized study plans.</p>
        </div>
        <div class="cp-card cp-reveal" style="transition-delay:0.15s">
          <div class="cp-card-icon"><i class="ti ti-puzzle"></i></div>
          <h2 class="cp-card-title">What We Offer</h2>
          <ul class="cp-list">
            <li><span class="cp-list-icon" style="color:var(--accent2)"><i class="ti ti-robot"></i></span> AI-powered vocabulary recommendations tailored to your level</li>
            <li><span class="cp-list-icon" style="color:var(--cyan)"><i class="ti ti-refresh"></i></span> SM-2 spaced repetition for optimal long-term retention</li>
            <li><span class="cp-list-icon" style="color:var(--emerald2)"><i class="ti ti-chart-bar"></i></span> CEFR-aligned word levels (A1 through C2) with progress tracking</li>
            <li><span class="cp-list-icon" style="color:var(--rose2)"><i class="ti ti-gamepad"></i></span> Interactive mini-games, grammar exercises, and mock tests</li>
            <li><span class="cp-list-icon" style="color:var(--amber2)"><i class="ti ti-trophy"></i></span> Real-time leaderboard, achievements, and streak system</li>
            <li><span class="cp-list-icon" style="color:var(--accent3)"><i class="ti ti-broadcast"></i></span> News & roadmap — stay updated on new features</li>
          </ul>
        </div>
        <div class="cp-values">
          <div class="cp-value cp-reveal"><span class="cp-value-icon"><i class="ti ti-target"></i></span><div class="cp-value-title">Quality First</div><div class="cp-value-text">Every word curated and verified by language experts for accuracy.</div></div>
          <div class="cp-value cp-reveal" style="transition-delay:0.08s"><span class="cp-value-icon"><i class="ti ti-unlock"></i></span><div class="cp-value-title">Free for All</div><div class="cp-value-text">High-quality education should never have a price tag.</div></div>
          <div class="cp-value cp-reveal" style="transition-delay:0.16s"><span class="cp-value-icon"><i class="ti ti-brain"></i></span><div class="cp-value-title">Science-Backed</div><div class="cp-value-text">Built on proven memory and learning research.</div></div>
          <div class="cp-value cp-reveal" style="transition-delay:0.24s"><span class="cp-value-icon"><i class="ti ti-seedling"></i></span><div class="cp-value-title">Always Growing</div><div class="cp-value-text">New features, words, and improvements shipped weekly.</div></div>
        </div>
        <div class="cp-card cp-reveal">
          <div class="cp-card-icon"><i class="ti ti-scroll"></i></div>
          <h2 class="cp-card-title">Our Story</h2>
          <div class="cp-timeline">
            <div class="cp-timeline-item"><div class="cp-timeline-date">2024 — Q1</div><div class="cp-timeline-title">The Idea</div><div class="cp-timeline-text">Founder Muminov Muhammadsolixon recognized the gap in AI-powered vocabulary tools and began building the first prototype.</div></div>
            <div class="cp-timeline-item"><div class="cp-timeline-date">2024 — Q3</div><div class="cp-timeline-title">First Launch</div><div class="cp-timeline-text">VocabMaster AI beta launched with 1,000 words and basic flashcards. Reached 500 users in the first week.</div></div>
            <div class="cp-timeline-item"><div class="cp-timeline-date">2025 — Q1</div><div class="cp-timeline-title">AI Integration</div><div class="cp-timeline-text">Integrated Groq AI for intelligent word explanations, example sentences, and personalized recommendations.</div></div>
            <div class="cp-timeline-item"><div class="cp-timeline-date">2025 — Q3</div><div class="cp-timeline-title">Full Platform</div><div class="cp-timeline-text">Launched games, grammar exercises, leaderboards, achievements, and Telegram authentication. 10K+ active users.</div></div>
            <div class="cp-timeline-item"><div class="cp-timeline-date">2026 — Present</div><div class="cp-timeline-title">Global Growth</div><div class="cp-timeline-text">Serving learners in 120+ countries. Continuing to expand content, features, and community.</div></div>
          </div>
        </div>
        <div class="cp-card cp-reveal" style="transition-delay:0.2s">
          <div class="cp-card-icon"><i class="ti ti-users"></i></div>
          <h2 class="cp-card-title">Our Team</h2>
          <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:28px;margin-top:8px">
            <div class="cp-team-card-mod">
              <div style="width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,#5B3DE8,#22D3EE);display:flex;align-items:center;justify-content:center;font-size:32px;margin:0 auto 16px;box-shadow:0 4px 20px rgba(91,61,232,0.25);position:relative;z-index:1"><i class="ti ti-crown" style="color:#fff"></i></div>
              <div style="font-family:var(--font-display);font-size:18px;font-weight:700;color:var(--text1);margin-bottom:4px;position:relative;z-index:1">M. Muhammadsolixon</div>
              <div style="font-size:13px;color:var(--accent2);font-weight:600;margin-bottom:10px;letter-spacing:0.02em;position:relative;z-index:1">Founder & Lead Developer</div>
              <div style="font-size:13px;color:var(--text2);line-height:1.6;position:relative;z-index:1">Full-stack developer and language enthusiast. Building VocabMaster AI to make vocabulary learning free, smart, and accessible to everyone worldwide.</div>
              <div style="display:flex;gap:12px;justify-content:center;margin-top:14px;position:relative;z-index:1">
                <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--text3)"><i class="ti ti-map-pin"></i> Fergana, UZ</div>
                <div style="display:flex;align-items:center;gap:4px;font-size:11px;color:var(--text3)"><i class="ti ti-cake"></i> 19 years</div>
              </div>
            </div>
          </div>
        </div>
        <div class="cp-card cp-reveal" style="transition-delay:0.25s">
          <div class="cp-card-icon"><i class="ti ti-telescope"></i></div>
          <h2 class="cp-card-title">Our Vision</h2>
          <p class="cp-card-text">We believe language should never be a barrier. Our vision is to make high-quality vocabulary education accessible to everyone, anywhere in the world — for free. By combining cutting-edge AI with a delightful user experience, we're building the most advanced vocabulary platform on the planet.</p>
        </div>
        <div class="cp-card cp-reveal cp-cta-card" style="transition-delay:0.3s">
          <div style="text-align:center;padding:32px 20px 28px;position:relative;z-index:1">
            <div class="cp-card-icon" style="width:56px;height:56px;border-radius:16px;font-size:26px;margin:0 auto 10px"><i class="ti ti-rocket"></i></div>
            <div style="font-family:var(--font-display);font-size:24px;font-weight:800;background:linear-gradient(135deg,#5B3DE8,#22D3EE);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;margin-bottom:8px">Start Your Journey Today</div>
            <div style="font-size:14px;color:var(--text2);max-width:440px;margin:0 auto 18px;line-height:1.6">Join <strong style="color:var(--accent2)">10,000+</strong> learners worldwide. Master vocabulary, track your progress, and unlock your language potential.</div>
            <div style="display:flex;gap:16px;flex-wrap:wrap;justify-content:center;margin-bottom:20px">
              <div class="cp-stat-chip"><div style="font-size:20px;font-weight:700;color:var(--accent2);font-family:var(--font-display)">16M+</div><div style="font-size:11px;color:var(--text3)">Words Learned</div></div>
              <div class="cp-stat-chip"><div style="font-size:20px;font-weight:700;color:var(--emerald2);font-family:var(--font-display)">10K+</div><div style="font-size:11px;color:var(--text3)">Active Users</div></div>
              <div class="cp-stat-chip"><div style="font-size:20px;font-weight:700;color:var(--amber2);font-family:var(--font-display)">120+</div><div style="font-size:11px;color:var(--text3)">Countries</div></div>
            </div>
            <button class="vm-btn" onclick="routerNavigate('/learn/explore')" style="padding:12px 32px;font-size:15px;font-weight:700;background:linear-gradient(135deg,#5856D6,#007AFF);color:#fff;border:none"><i class="ti ti-rocket"></i> Get Started Free</button>
            <div style="font-size:11px;color:var(--text3);margin-top:10px">No credit card required • Free forever</div>
          </div>
        </div>
      </div>`;
  }

  function renderPrivacy() {
    const el = document.getElementById('company-privacy');
    if (!el || el.dataset.rendered) return;
    el.dataset.rendered = '1';
    el.innerHTML = `
      <div class="stagger-1" style="margin-bottom:20px;background:linear-gradient(135deg,#5856D6,#007AFF);border-radius:16px;padding:24px;color:#fff">
        <div style="display:flex;align-items:center;gap:14px">
          <div style="width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:20px"><i class="ti ti-shield"></i></div>
          <div>
            <h2 style="font-size:22px;font-weight:700;margin:0;line-height:1.2">Privacy Policy</h2>
            <p style="font-size:13px;opacity:0.85;margin:4px 0 0">How we handle your data</p>
          </div>
        </div>
      </div>
      <div class="cp-body">
        <div class="cp-toc cp-reveal">
          <div class="cp-toc-title">Table of Contents</div>
          <ul class="cp-toc-list">
            <li><a href="#" onclick="scrollToSection('priv-data-collect');return false">1. Data We Collect</a></li>
            <li><a href="#" onclick="scrollToSection('priv-how-use');return false">2. How We Use Your Data</a></li>
            <li><a href="#" onclick="scrollToSection('priv-legal');return false">3. Legal Basis (GDPR)</a></li>
            <li><a href="#" onclick="scrollToSection('priv-storage');return false">4. Data Storage & Retention</a></li>
            <li><a href="#" onclick="scrollToSection('priv-third');return false">5. Third-Party Services</a></li>
            <li><a href="#" onclick="scrollToSection('priv-rights');return false">6. Your Rights</a></li>
            <li><a href="#" onclick="scrollToSection('priv-security');return false">7. Data Security</a></li>
            <li><a href="#" onclick="scrollToSection('priv-contact');return false">8. Contact Information</a></li>
          </ul>
        </div>
        <div class="cp-legal-card cp-reveal">
          <div class="cp-legal-section" id="priv-data-collect">
            <h3 class="cp-legal-h">1. Data We Collect</h3>
            <p class="cp-legal-p">We collect only the data necessary to provide and improve our service:</p>
            <ul class="cp-legal-ul">
              <li><strong>Account data:</strong> username, email, Telegram username (if you register or connect via Telegram)</li>
              <li><strong>Learning data:</strong> words studied, quiz scores, study streaks, progress statistics, achievements</li>
              <li><strong>Technical data:</strong> anonymous device ID (for guest sync), browser type, IP address (in server logs)</li>
              <li><strong>Cookies:</strong> essential cookies only (csrf_token for security, session management) — no tracking cookies</li>
            </ul>
          </div>
          <div class="cp-legal-section" id="priv-how-use">
            <h3 class="cp-legal-h">2. How We Use Your Data</h3>
            <p class="cp-legal-p">Your data is used solely to:</p>
            <ul class="cp-legal-ul">
              <li>Personalize your learning experience</li>
              <li>Track your progress and provide statistics</li>
              <li>Sync data across devices (if signed in)</li>
              <li>Improve our AI recommendations</li>
              <li>Send service-related communications (if enabled)</li>
            </ul>
            <p class="cp-legal-p"><strong>We do not</strong> sell, rent, or share your personal data with third parties for marketing purposes.</p>
          </div>
          <div class="cp-legal-section" id="priv-legal">
            <h3 class="cp-legal-h">3. Legal Basis (GDPR)</h3>
            <p class="cp-legal-p">Under the General Data Protection Regulation (GDPR), we process your data based on:</p>
            <ul class="cp-legal-ul">
              <li><strong>Consent:</strong> you explicitly agree when creating an account</li>
              <li><strong>Contractual necessity:</strong> processing is required to provide the service</li>
              <li><strong>Legitimate interest:</strong> improving our educational platform</li>
            </ul>
          </div>
          <div class="cp-legal-section" id="priv-storage">
            <h3 class="cp-legal-h">4. Data Storage & Retention</h3>
            <p class="cp-legal-p">Primary progress data is stored locally in your browser's localStorage. If you create an account, your data is synced to our secure PostgreSQL database hosted on Neon (AWS Frankfurt, EU).</p>
            <p class="cp-legal-p">We retain your data for as long as your account is active. Upon account deletion, all personal data is permanently erased within 30 days.</p>
          </div>
          <div class="cp-legal-section" id="priv-third">
            <h3 class="cp-legal-h">5. Third-Party Services</h3>
            <p class="cp-legal-p">We use these third-party services. No personal data is shared with them for marketing:</p>
            <ul class="cp-legal-ul">
              <li><strong>Groq AI</strong> — AI-powered tutoring. Learning queries are sent but not linked to your identity</li>
              <li><strong>Dictionary API</strong> — word definitions</li>
              <li><strong>Datamuse API</strong> — related word suggestions</li>
              <li><strong>Neon (PostgreSQL)</strong> — secure database hosting (Frankfurt, EU)</li>
              <li><strong>Telegram</strong> — bot-based authentication (username shared only)</li>
            </ul>
          </div>
          <div class="cp-legal-section" id="priv-rights">
            <h3 class="cp-legal-h">6. Your Rights (GDPR)</h3>
            <p class="cp-legal-p">You have the following rights regarding your data:</p>
            <ul class="cp-legal-ul">
              <li><strong>Right to access</strong> — request a copy of your data</li>
              <li><strong>Right to rectification</strong> — correct inaccurate data</li>
              <li><strong>Right to erasure</strong> ("right to be forgotten") — delete your account and data</li>
              <li><strong>Right to restrict processing</strong> — limit how we use your data</li>
              <li><strong>Right to data portability</strong> — receive your data in a machine-readable format</li>
              <li><strong>Right to object</strong> — object to processing based on legitimate interest</li>
            </ul>
            <p class="cp-legal-p">To exercise any of these rights, contact us at <strong>muinovcoder@gmail.com</strong>. We will respond within 30 days.</p>
          </div>
          <div class="cp-legal-section" id="priv-security">
            <h3 class="cp-legal-h">7. Data Security</h3>
            <p class="cp-legal-p">We implement industry-standard security measures:</p>
            <ul class="cp-legal-ul">
              <li>All traffic encrypted via HTTPS (TLS 1.3)</li>
              <li>Passwords hashed with bcrypt (14 rounds)</li>
              <li>JWT tokens with automatic rotation</li>
              <li>CSRF protection on all state-changing requests</li>
              <li>Rate limiting against brute force attacks</li>
              <li>Regular security audits</li>
            </ul>
          </div>
          <div class="cp-legal-section" id="priv-contact">
            <h3 class="cp-legal-h">8. Contact Information</h3>
            <p class="cp-legal-p">VocabMaster AI is developed and operated from Fergana, Uzbekistan.</p>
            <ul class="cp-legal-ul">
              <li>Email: <strong>muinovcoder@gmail.com</strong></li>
              <li>Data Protection: <strong>muinovcoder@gmail.com</strong></li>
            </ul>
          </div>
          <div class="cp-legal-footer">Last updated: June 2026</div>
        </div>
      </div>`;
  }

  function renderTerms() {
    const el = document.getElementById('company-terms');
    if (!el || el.dataset.rendered) return;
    el.dataset.rendered = '1';
    el.innerHTML = `
      <div class="stagger-1" style="margin-bottom:20px;background:linear-gradient(135deg,#5856D6,#007AFF);border-radius:16px;padding:24px;color:#fff">
        <div style="display:flex;align-items:center;gap:14px">
          <div style="width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:20px"><i class="ti ti-scale"></i></div>
          <div>
            <h2 style="font-size:22px;font-weight:700;margin:0;line-height:1.2">Terms of Service</h2>
            <p style="font-size:13px;opacity:0.85;margin:4px 0 0">Rules and guidelines for using VocabMaster AI</p>
          </div>
        </div>
      </div>
      <div class="cp-body">
        <div class="cp-toc cp-reveal">
          <div class="cp-toc-title">Table of Contents</div>
          <ul class="cp-toc-list">
            <li><a href="#" onclick="scrollToSection('terms-accept');return false">1. Acceptance</a></li>
            <li><a href="#" onclick="scrollToSection('terms-service');return false">2. Service Description</a></li>
            <li><a href="#" onclick="scrollToSection('terms-accounts');return false">3. User Accounts</a></li>
            <li><a href="#" onclick="scrollToSection('terms-use');return false">4. Acceptable Use</a></li>
            <li><a href="#" onclick="scrollToSection('terms-ip');return false">5. Intellectual Property</a></li>
            <li><a href="#" onclick="scrollToSection('terms-content');return false">6. User Content</a></li>
            <li><a href="#" onclick="scrollToSection('terms-third');return false">7. Third-Party Services</a></li>
            <li><a href="#" onclick="scrollToSection('terms-privacy');return false">8. Privacy</a></li>
            <li><a href="#" onclick="scrollToSection('terms-warranty');return false">9. Disclaimer</a></li>
            <li><a href="#" onclick="scrollToSection('terms-liability');return false">10. Limitation of Liability</a></li>
            <li><a href="#" onclick="scrollToSection('terms-indemnify');return false">11. Indemnification</a></li>
            <li><a href="#" onclick="scrollToSection('terms-termination');return false">12. Termination</a></li>
            <li><a href="#" onclick="scrollToSection('terms-law');return false">13. Governing Law</a></li>
            <li><a href="#" onclick="scrollToSection('terms-changes');return false">14. Changes</a></li>
            <li><a href="#" onclick="scrollToSection('terms-contact');return false">15. Contact</a></li>
          </ul>
        </div>
        <div class="cp-legal-card cp-reveal">
          <div class="cp-legal-section" id="terms-accept">
            <h3 class="cp-legal-h">1. Acceptance of Terms</h3>
            <p class="cp-legal-p">By accessing or using VocabMaster AI ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms, you may not access or use the Service. These Terms apply to all visitors, users, and others who access or use the Service.</p>
          </div>
          <div class="cp-legal-section" id="terms-service">
            <h3 class="cp-legal-h">2. Description of Service</h3>
            <p class="cp-legal-p">VocabMaster AI is an AI-powered vocabulary learning platform that provides:</p>
            <ul class="cp-legal-ul">
              <li>Word definitions, example sentences, and contextual learning materials</li>
              <li>Spaced repetition flashcards and quizzes</li>
              <li>Grammar exercises and interactive mini-games</li>
              <li>Progress tracking, achievements, and leaderboards</li>
              <li>AI-powered word explanations and tutoring</li>
            </ul>
            <p class="cp-legal-p">The Service is provided for personal, non-commercial educational use only.</p>
          </div>
          <div class="cp-legal-section" id="terms-accounts">
            <h3 class="cp-legal-h">3. User Accounts</h3>
            <p class="cp-legal-p"><strong>Registration.</strong> You may create an account to access certain features. You agree to provide accurate, current, and complete information and to keep your login credentials confidential.</p>
            <p class="cp-legal-p"><strong>Guest Mode.</strong> You may use the Service without an account. Data is stored locally in your browser. Creating an account enables cross-device sync.</p>
            <p class="cp-legal-p"><strong>Account Security.</strong> You are responsible for all activity under your account. Notify us immediately at <strong>muinovcoder@gmail.com</strong> if you suspect unauthorized access.</p>
            <p class="cp-legal-p"><strong>Account Deletion.</strong> You may delete your account at any time from your profile settings. Upon deletion, all personal data is permanently erased within 30 days.</p>
          </div>
          <div class="cp-legal-section" id="terms-use">
            <h3 class="cp-legal-h">4. Acceptable Use</h3>
            <p class="cp-legal-p">You agree not to engage in any of the following prohibited activities:</p>
            <ul class="cp-legal-ul">
              <li>Using the Service for any illegal purpose or in violation of any applicable laws</li>
              <li>Attempting to reverse-engineer, decompile, or extract the source code of the Service</li>
              <li>Interfering with or disrupting the integrity or performance of the Service</li>
              <li>Using automated bots, scrapers, or scripts to access, collect, or manipulate content</li>
              <li>Uploading or transmitting viruses, malware, or any malicious code</li>
              <li>Impersonating any person or entity or falsely stating your affiliation</li>
              <li>Harassing, abusing, or harming other users</li>
            </ul>
            <p class="cp-legal-p">Violation of these rules may result in immediate suspension or termination of your access without prior notice.</p>
          </div>
          <div class="cp-legal-section" id="terms-ip">
            <h3 class="cp-legal-h">5. Intellectual Property</h3>
            <p class="cp-legal-p"><strong>Our Content.</strong> All content, code, design, graphics, text, and materials on VocabMaster AI are the intellectual property of VocabMaster AI and its licensors, unless otherwise noted. You may not copy, modify, distribute, sell, or create derivative works without prior written permission.</p>
            <p class="cp-legal-p"><strong>Trademarks.</strong> "VocabMaster AI" and the VocabMaster logo are trademarks of VocabMaster AI. You may not use them without permission.</p>
            <p class="cp-legal-p"><strong>Feedback.</strong> If you provide feedback or suggestions, you grant us a non-exclusive, royalty-free, perpetual license to use them without restriction.</p>
          </div>
          <div class="cp-legal-section" id="terms-content">
            <h3 class="cp-legal-h">6. User Content</h3>
            <p class="cp-legal-p">You retain ownership of any content you submit, post, or display through the Service (such as study notes or lists). By submitting content, you grant VocabMaster AI a worldwide, non-exclusive, royalty-free license to use, reproduce, and display that content solely for the purpose of operating and improving the Service.</p>
            <p class="cp-legal-p">You represent and warrant that your content does not infringe the rights of any third party.</p>
          </div>
          <div class="cp-legal-section" id="terms-third">
            <h3 class="cp-legal-h">7. Third-Party Services</h3>
            <p class="cp-legal-p">The Service integrates with third-party APIs and services, including Groq AI, Dictionary API, Datamuse, Neon, and Telegram. Your use of these services is subject to their respective terms. VocabMaster AI is not responsible for the availability, accuracy, or performance of third-party services.</p>
          </div>
          <div class="cp-legal-section" id="terms-privacy">
            <h3 class="cp-legal-h">8. Privacy</h3>
            <p class="cp-legal-p">Your privacy is important to us. Our <a href="#" onclick="routerNavigate('/company/privacy');return false" style="color:var(--accent)">Privacy Policy</a> explains how we collect, use, and protect your personal data. By using the Service, you consent to our data practices as described in the Privacy Policy.</p>
          </div>
          <div class="cp-legal-section" id="terms-warranty">
            <h3 class="cp-legal-h">9. Disclaimer of Warranties</h3>
            <p class="cp-legal-p">THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR FREE OF VIRUSES.</p>
            <p class="cp-legal-p">VocabMaster AI is an educational tool and does not guarantee specific learning outcomes or language proficiency.</p>
          </div>
          <div class="cp-legal-section" id="terms-liability">
            <h3 class="cp-legal-h">10. Limitation of Liability</h3>
            <p class="cp-legal-p">TO THE MAXIMUM EXTENT PERMITTED BY LAW, VOCABMASTER AI, ITS AFFILIATES, AND THEIR RESPECTIVE OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATED TO YOUR USE OF THE SERVICE, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY.</p>
            <p class="cp-legal-p">Our total liability for any claims under these Terms shall not exceed the amount you have paid us (if any) in the past 12 months.</p>
          </div>
          <div class="cp-legal-section" id="terms-indemnify">
            <h3 class="cp-legal-h">11. Indemnification</h3>
            <p class="cp-legal-p">You agree to indemnify, defend, and hold harmless VocabMaster AI, its affiliates, and their respective officers, directors, employees, and agents from any claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to your use of the Service, your violation of these Terms, or your violation of any third-party rights.</p>
          </div>
          <div class="cp-legal-section" id="terms-termination">
            <h3 class="cp-legal-h">12. Termination</h3>
            <p class="cp-legal-p">We may terminate or suspend your access to the Service at any time, with or without cause, with or without notice. Upon termination, your right to use the Service immediately ceases. Sections 5 (Intellectual Property), 8-11, and 13-15 shall survive termination.</p>
          </div>
          <div class="cp-legal-section" id="terms-law">
            <h3 class="cp-legal-h">13. Governing Law</h3>
            <p class="cp-legal-p">These Terms shall be governed by and construed in accordance with the laws of the Republic of Uzbekistan, without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved in the courts of Fergana, Uzbekistan.</p>
          </div>
          <div class="cp-legal-section" id="terms-changes">
            <h3 class="cp-legal-h">14. Changes to Terms</h3>
            <p class="cp-legal-p">We reserve the right to modify these Terms at any time. Material changes will be notified via the Service (in-app notice or email). Your continued use of the Service after changes take effect constitutes your acceptance of the new Terms. If you do not agree, you must stop using the Service.</p>
          </div>
          <div class="cp-legal-section" id="terms-contact">
            <h3 class="cp-legal-h">15. Contact Information</h3>
            <p class="cp-legal-p">For questions, concerns, or legal inquiries regarding these Terms:</p>
            <ul class="cp-legal-ul">
              <li>Email: <strong>muinovcoder@gmail.com</strong></li>
              <li>Address: Fergana, Uzbekistan</li>
            </ul>
          </div>
          <div class="cp-legal-footer">Last updated: June 2026</div>
        </div>
      </div>`;
  }

  function renderCookies() {
    const el = document.getElementById('company-cookies');
    if (!el || el.dataset.rendered) return;
    el.dataset.rendered = '1';
    el.innerHTML = `
      <div class="stagger-1" style="margin-bottom:20px;background:linear-gradient(135deg,#5856D6,#007AFF);border-radius:16px;padding:24px;color:#fff">
        <div style="display:flex;align-items:center;gap:14px">
          <div style="width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:20px"><i class="ti ti-cookie"></i></div>
          <div>
            <h2 style="font-size:22px;font-weight:700;margin:0;line-height:1.2">Cookie Policy</h2>
            <p style="font-size:13px;opacity:0.85;margin:4px 0 0">How we use cookies and similar technologies</p>
          </div>
        </div>
      </div>
      <div class="cp-body">
        <div class="cp-toc cp-reveal">
          <div class="cp-toc-title">Table of Contents</div>
          <ul class="cp-toc-list">
            <li><a href="#" onclick="scrollToSection('cookies-what');return false">1. What Are Cookies</a></li>
            <li><a href="#" onclick="scrollToSection('cookies-types');return false">2. Types of Cookies</a></li>
            <li><a href="#" onclick="scrollToSection('cookies-how');return false">3. How We Use Cookies</a></li>
            <li><a href="#" onclick="scrollToSection('cookies-third');return false">4. Third-Party Cookies</a></li>
            <li><a href="#" onclick="scrollToSection('cookies-choices');return false">5. Your Choices</a></li>
            <li><a href="#" onclick="scrollToSection('cookies-contact');return false">6. Contact</a></li>
          </ul>
        </div>
        <div class="cp-legal-card cp-reveal">
          <div class="cp-legal-section" id="cookies-what">
            <h3 class="cp-legal-h">1. What Are Cookies</h3>
            <p class="cp-legal-p">Cookies are small text files that are placed on your device when you visit a website. They help the website function properly, improve your experience, and provide information to the site owners. VocabMaster AI uses cookies and similar technologies (localStorage, sessionStorage) to deliver and improve our service.</p>
          </div>
          <div class="cp-legal-section" id="cookies-types">
            <h3 class="cp-legal-h">2. Types of Cookies We Use</h3>
            <p class="cp-legal-p"><strong>Essential Cookies.</strong> Required for the Service to function. These include CSRF tokens for security and session management. Without these cookies, certain features may not work.</p>
            <p class="cp-legal-p"><strong>Functional Cookies.</strong> Remember your preferences (theme, language settings, study preferences). These enhance your experience but are not strictly necessary.</p>
            <p class="cp-legal-p"><strong>Analytics Cookies.</strong> We use minimal analytics to understand how the Service is used. No personal data is collected, and no data is shared with third parties for marketing.</p>
            <p class="cp-legal-p"><strong>Local Storage.</strong> Your learning progress, settings, and session data are stored in your browser's localStorage. This data never leaves your device unless you create an account and enable sync.</p>
          </div>
          <div class="cp-legal-section" id="cookies-how">
            <h3 class="cp-legal-h">3. How We Use Cookies</h3>
            <p class="cp-legal-p">Cookies and local storage are used for:</p>
            <ul class="cp-legal-ul">
              <li><strong>Authentication:</strong> keeping you signed in between sessions</li>
              <li><strong>Security:</strong> CSRF protection against unauthorized requests</li>
              <li><strong>Preferences:</strong> remembering your theme, language, and study settings</li>
              <li><strong>Progress:</strong> storing your learning data locally for offline access</li>
              <li><strong>Session management:</strong> maintaining your session state</li>
            </ul>
            <p class="cp-legal-p">We do <strong>not</strong> use cookies for advertising, tracking across websites, or profiling.</p>
          </div>
          <div class="cp-legal-section" id="cookies-third">
            <h3 class="cp-legal-h">4. Third-Party Cookies</h3>
            <p class="cp-legal-p">VocabMaster AI does not set third-party tracking cookies. The third-party services we integrate with (Groq AI, Dictionary API, Datamuse, Neon, Telegram) may set their own cookies in accordance with their respective privacy policies. We have no control over these cookies.</p>
          </div>
          <div class="cp-legal-section" id="cookies-choices">
            <h3 class="cp-legal-h">5. Your Cookie Choices</h3>
            <p class="cp-legal-p">Most browsers allow you to control cookies through browser settings. You can:</p>
            <ul class="cp-legal-ul">
              <li>Delete existing cookies from your browser</li>
              <li>Block cookies from being set</li>
              <li>Set your browser to notify you before accepting cookies</li>
              <li>Use incognito/private browsing mode</li>
            </ul>
            <p class="cp-legal-p">Please note that blocking essential cookies may affect the functionality of VocabMaster AI. You can clear your localStorage data at any time from your browser's developer tools or by clearing your browsing data.</p>
          </div>
          <div class="cp-legal-section" id="cookies-contact">
            <h3 class="cp-legal-h">6. Contact Information</h3>
            <p class="cp-legal-p">If you have any questions about our use of cookies, please contact us:</p>
            <ul class="cp-legal-ul">
              <li>Email: <strong>muinovcoder@gmail.com</strong></li>
            </ul>
          </div>
          <div class="cp-legal-footer">Last updated: June 2026</div>
        </div>
      </div>`;
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function revealObserve() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('cp-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.cp-reveal').forEach(el => observer.observe(el));
  }

  function init() {
    renderAbout();
    renderPrivacy();
    renderTerms();
    renderCookies();
    setTimeout(revealObserve, 100);
  }

  document.addEventListener('DOMContentLoaded', init);
  if (document.readyState !== 'loading') init();

  window.scrollToSection = scrollToSection;
  return { init, renderAbout, renderPrivacy, renderTerms, renderCookies, scrollToSection };
})();
