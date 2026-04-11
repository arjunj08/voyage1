// ===== VOYAGE APP.JS =====
// Combined from voyage + voyage1 — includes AI Trip Planner & AI Support Chat
 
document.addEventListener('DOMContentLoaded', function () {
 
  // Init Lucide icons
  if (typeof lucide !== 'undefined') lucide.createIcons();
 
  // ===== SPLASH SCREEN =====
  const splash = document.getElementById('splash-screen');
  const app = document.getElementById('app-container');
 
  setTimeout(() => {
    splash.classList.add('fade-out');
    setTimeout(() => {
      splash.style.display = 'none';
      app.style.display = 'flex';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 600);
  }, 2000);
 
  // ===== NAVIGATION =====
  window.navigateToScreen = function (screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    const target = document.getElementById(screenId);
    if (target) target.classList.remove('hidden');
 
    document.querySelectorAll('.nav-item').forEach(nav => {
      const indicator = nav.querySelector('.nav-indicator');
      if (nav.dataset.screen === screenId) {
        nav.classList.add('active');
        if (indicator) indicator.classList.remove('hidden');
      } else {
        nav.classList.remove('active');
        if (indicator) indicator.classList.add('hidden');
      }
    });
  };
 
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => navigateToScreen(item.dataset.screen));
  });
 
  // Back buttons
  document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => navigateToScreen(btn.dataset.back));
  });
 
  // ===== MODAL =====
  function showModal(html) {
    document.getElementById('modal-content').innerHTML = html;
    document.getElementById('modal').classList.remove('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
 
  function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    document.getElementById('modal-content').innerHTML = '';
  }
 
  document.body.addEventListener('click', e => {
    if (e.target.dataset.modalAction === 'close') closeModal();
    if (e.target.id === 'modal') closeModal();
  });
 
  // ===== BOOKING TABS =====
  document.querySelectorAll('.booking-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.booking-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
 
      const tabName = tab.dataset.tab;
      ['flights-form', 'hotels-form', 'cars-form'].forEach(id => {
        document.getElementById(id)?.classList.add('hidden');
      });
      document.getElementById(`${tabName}-form`)?.classList.remove('hidden');
 
      const label = tabName.charAt(0).toUpperCase() + tabName.slice(1);
      const btn = document.getElementById('search-btn');
      btn.innerHTML = `<i data-lucide="search"></i> Search ${label}`;
      if (typeof lucide !== 'undefined') lucide.createIcons();
    });
  });
 
  // Date inputs
  document.querySelectorAll('.date-input').forEach(input => {
    input.addEventListener('focus', () => { input.type = 'date'; });
    input.addEventListener('blur', () => { if (!input.value) input.type = 'text'; });
  });
 
  // ===== SEARCH =====
  document.getElementById('search-btn')?.addEventListener('click', () => {
    showModal(`
      <div style="display:flex;justify-content:center;margin-bottom:16px;">
        <div style="width:48px;height:48px;border-radius:50%;border:3px solid #e2e8f0;border-top-color:#0ea5e9;animation:spin 0.8s linear infinite;"></div>
      </div>
      <p style="font-weight:600;color:#334155;">Finding the best deals...</p>
      <style>@keyframes spin{to{transform:rotate(360deg)}}</style>
    `);
    setTimeout(() => {
      closeModal();
      const activeTab = document.querySelector('.booking-tab.active')?.dataset.tab;
      const screenMap = { flights: 'flight-results-screen', hotels: 'hotel-results-screen', cars: 'car-results-screen' };
      if (screenMap[activeTab]) navigateToScreen(screenMap[activeTab]);
    }, 1500);
  });
 
  // ===== FLIGHT RESULTS → BOOKING =====
  document.querySelectorAll('.flight-result').forEach(card => {
    const selectBtn = card.querySelector('.btn-sm');
    selectBtn?.addEventListener('click', () => {
      document.getElementById('booking-airline').textContent = card.dataset.airline;
      document.getElementById('booking-route').textContent = `Round trip · ${card.dataset.route}`;
      document.getElementById('booking-price').textContent = `$${card.dataset.price}`;
      navigateToScreen('flight-booking-screen');
    });
  });
 
  // Payment flow
  document.getElementById('proceed-to-payment-btn')?.addEventListener('click', () => {
    showModal(`
      <div style="font-size:48px;margin-bottom:12px;">💳</div>
      <h3 style="font-family:'Syne',sans-serif;font-size:18px;font-weight:700;margin-bottom:8px;">Payment</h3>
      <p style="font-size:13px;color:#64748b;margin-bottom:20px;">Demo mode — no real charge</p>
      <button onclick="handlePaymentSuccess()" style="width:100%;background:linear-gradient(135deg,#0ea5e9,#22d3ee);color:white;border:none;border-radius:12px;padding:14px;font-size:15px;font-weight:600;cursor:pointer;">Confirm & Pay</button>
      <button data-modal-action="close" style="width:100%;background:none;border:none;padding:12px;font-size:14px;color:#64748b;cursor:pointer;margin-top:4px;">Cancel</button>
    `);
  });
 
  window.handlePaymentSuccess = function () {
    closeModal();
    setTimeout(() => {
      showModal(`
        <div style="font-size:56px;margin-bottom:12px;">🎉</div>
        <h3 style="font-family:'Syne',sans-serif;font-size:20px;font-weight:800;margin-bottom:8px;">Booking Confirmed!</h3>
        <p style="font-size:14px;color:#64748b;margin-bottom:20px;">Your flight has been booked. Check your trips for details.</p>
        <button onclick="document.getElementById('modal').classList.add('hidden');navigateToScreen('home-screen')" 
          style="width:100%;background:linear-gradient(135deg,#0ea5e9,#22d3ee);color:white;border:none;border-radius:12px;padding:14px;font-size:15px;font-weight:600;cursor:pointer;">
          Back to Home
        </button>
      `);
    }, 100);
  };
 
  // ===== EXPERIENCE CARDS =====
  document.querySelectorAll('.exp-card').forEach(card => {
    card.addEventListener('click', () => {
      showModal(`
        <div style="font-size:48px;margin-bottom:12px;">${card.querySelector('.exp-icon').textContent}</div>
        <h3 style="font-family:'Syne',sans-serif;font-size:20px;font-weight:800;margin-bottom:8px;">${card.dataset.exp}</h3>
        <p style="font-size:14px;color:#64748b;margin-bottom:8px;">${card.dataset.desc}</p>
        <p style="font-size:18px;font-weight:700;color:#0ea5e9;margin-bottom:20px;">from $${card.dataset.price}</p>
        <button onclick="document.getElementById('modal').classList.add('hidden')" 
          style="width:100%;background:linear-gradient(135deg,#0ea5e9,#22d3ee);color:white;border:none;border-radius:12px;padding:14px;font-size:15px;font-weight:600;cursor:pointer;">
          Book Experience
        </button>
        <button data-modal-action="close" style="width:100%;background:none;border:none;padding:12px;font-size:14px;color:#64748b;cursor:pointer;">
          Maybe Later
        </button>
      `);
    });
  });
 
  // Destination cards
  document.querySelectorAll('.featured-destination-card').forEach(card => {
    card.addEventListener('click', () => navigateToScreen('explore-screen'));
  });
 
  // ===== AI PLANNER SCREEN =====
  document.getElementById('open-ai-planner')?.addEventListener('click', () => {
    navigateToScreen('ai-planner-screen');
  });
 
  document.getElementById('generate-itinerary-btn')?.addEventListener('click', async () => {
    const destination = document.getElementById('planner-destination').value.trim();
    if (!destination) {
      document.getElementById('planner-destination').focus();
      return;
    }
 
    const btn = document.getElementById('generate-itinerary-btn');
    const result = document.getElementById('itinerary-result');
 
    btn.innerHTML = '<i data-lucide="loader-2"></i> Generating...';
    btn.disabled = true;
    result.classList.add('hidden');
    if (typeof lucide !== 'undefined') lucide.createIcons();
 
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `Create a detailed, exciting day-by-day travel itinerary for: ${destination}. 
Include must-see attractions, local food recommendations, and practical tips. 
Format clearly with Day 1, Day 2, etc. Keep it fun and inspiring!`
          }]
        })
      });
 
      const data = await response.json();
      const text = data.content?.map(b => b.text || '').join('') || 'Could not generate itinerary.';
 
      result.textContent = text;
      result.classList.remove('hidden');
    } catch (err) {
      result.textContent = '⚠️ Could not connect to AI. Please check your connection and try again.';
      result.classList.remove('hidden');
    }
 
    btn.innerHTML = '<i data-lucide="sparkles"></i> Generate Itinerary';
    btn.disabled = false;
    if (typeof lucide !== 'undefined') lucide.createIcons();
  });
 
  // ===== AI SUPPORT CHAT =====
  const chatHistory = [
    { role: 'user', content: 'Hi!' },
    { role: 'assistant', content: "Hi! I'm Voyage Assistant 👋 How can I help you today?" }
  ];
 
  function appendMessage(role, text) {
    const messages = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = `chat-msg ${role === 'assistant' ? 'bot' : 'user'}`;
    div.innerHTML = `<div class="chat-bubble">${text}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }
 
  function appendTyping() {
    const messages = document.getElementById('chat-messages');
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.id = 'typing-indicator';
    div.innerHTML = `<div class="chat-bubble" style="color:#94a3b8;">Typing...</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }
 
  function removeTyping() {
    document.getElementById('typing-indicator')?.remove();
  }
 
  async function sendChat(userMessage) {
    if (!userMessage.trim()) return;
 
    appendMessage('user', userMessage);
    chatHistory.push({ role: 'user', content: userMessage });
    appendTyping();
 
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: 'You are Voyage Assistant, a friendly and helpful travel support chatbot for the Voyage travel app. Help users with flight bookings, hotel recommendations, travel tips, visa information, packing advice, and anything travel-related. Keep responses concise and friendly.',
          messages: chatHistory.slice(-10)
        })
      });
 
      const data = await response.json();
      const reply = data.content?.map(b => b.text || '').join('') || "Sorry, I couldn't process that.";
 
      removeTyping();
      chatHistory.push({ role: 'assistant', content: reply });
      appendMessage('assistant', reply);
    } catch (err) {
      removeTyping();
      appendMessage('assistant', '⚠️ Connection error. Please try again.');
    }
  }
 
  document.getElementById('chat-send-btn')?.addEventListener('click', () => {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if (msg) { input.value = ''; sendChat(msg); }
  });
 
  document.getElementById('chat-input')?.addEventListener('keypress', e => {
    if (e.key === 'Enter') {
      const msg = e.target.value.trim();
      if (msg) { e.target.value = ''; sendChat(msg); }
    }
  });
 
  // ===== PROFILE DROPDOWN =====
  document.getElementById('profile-btn')?.addEventListener('click', e => {
    e.stopPropagation();
    document.getElementById('profile-dropdown')?.classList.toggle('hidden');
  });
 
  document.addEventListener('click', () => {
    document.getElementById('profile-dropdown')?.classList.add('hidden');
  });
 
  document.getElementById('view-profile-link')?.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('profile-dropdown')?.classList.add('hidden');
    navigateToScreen('profile-screen');
  });
 
});
       
