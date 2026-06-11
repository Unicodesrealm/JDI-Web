/**
 * JDI Analytics System (Global site-wide tracking and admin dashboard)
 * Supports both Vanilla JS and React environments without external dependencies.
 */
(function() {
  // --- DATABASE HELPER ---
  const DB_KEY = 'jdi_analytics_db';

  function getDB() {
    let db = localStorage.getItem(DB_KEY);
    if (!db) {
      db = {
        pageViews: [],
        events: [],
        leads: [],
        calculatorData: [],
        sessions: {}
      };
      localStorage.setItem(DB_KEY, JSON.stringify(db));
    } else {
      try {
        db = JSON.parse(db);
        if (!db.pageViews) db.pageViews = [];
        if (!db.events) db.events = [];
        if (!db.leads) db.leads = [];
        if (!db.calculatorData) db.calculatorData = [];
        if (!db.sessions) db.sessions = {};
      } catch (e) {
        db = { pageViews: [], events: [], leads: [], calculatorData: [], sessions: {} };
        localStorage.setItem(DB_KEY, JSON.stringify(db));
      }
    }
    return db;
  }

  function saveDB(db) {
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }

  // --- SESSION MANAGEMENT ---
  const SESSION_KEY = 'jdi_session_id';
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }

  // Track session details
  const db = getDB();
  if (!db.sessions[sessionId]) {
    db.sessions[sessionId] = {
      id: sessionId,
      startTime: Date.now(),
      lastActive: Date.now(),
      duration: 0,
      device: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'Telemóvel' : 'Desktop'
    };
    saveDB(db);
  }

  // Session duration updater
  function pingSession() {
    const db = getDB();
    if (db.sessions[sessionId]) {
      const sess = db.sessions[sessionId];
      const now = Date.now();
      const elapsed = Math.round((now - sess.startTime) / 1000);
      sess.lastActive = now;
      sess.duration = elapsed;
      saveDB(db);
    }
  }

  // Keep pinging session duration
  setInterval(pingSession, 5000);
  window.addEventListener('beforeunload', pingSession);
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      pingSession();
    }
  });

  // --- ANALYTICS APIS ---
  const JDIAnalytics = {
    sessionId: sessionId,

    trackPageView: function(customPath) {
      const path = customPath || window.location.pathname.split('/').pop() || 'index.html';
      const db = getDB();
      db.pageViews.push({
        path: path,
        timestamp: Date.now(),
        sessionId: sessionId
      });
      saveDB(db);
      pingSession();
    },

    trackEvent: function(eventName, metadata = {}) {
      const db = getDB();
      db.events.push({
        eventName: eventName,
        metadata: metadata,
        timestamp: Date.now(),
        sessionId: sessionId
      });
      saveDB(db);
      pingSession();
    },

    trackLead: function(source, details = {}) {
      const db = getDB();
      db.leads.push({
        source: source,
        details: details,
        timestamp: Date.now(),
        sessionId: sessionId
      });
      saveDB(db);
      pingSession();
    },

    trackCalculator: function(area, location, standard, estimatedCost = 0) {
      const db = getDB();
      db.calculatorData.push({
        area: Number(area),
        location: location,
        standard: standard,
        estimatedCost: Number(estimatedCost),
        timestamp: Date.now(),
        sessionId: sessionId
      });
      saveDB(db);
      pingSession();
    },

    clearData: function() {
      localStorage.removeItem(DB_KEY);
      const db = getDB();
      db.sessions[sessionId] = {
        id: sessionId,
        startTime: Date.now(),
        lastActive: Date.now(),
        duration: 0,
        device: /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'Telemóvel' : 'Desktop'
      };
      saveDB(db);
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('jdi_analytics_updated'));
      }
    },

    injectMockData: function() {
      this.clearData();
      const db = getDB();
      const now = Date.now();

      // Mock sessions
      const mockSessions = [
        { id: 'sess_m1', startTime: now - 3600000 * 24 * 3, duration: 420, device: 'Desktop' },
        { id: 'sess_m2', startTime: now - 3600000 * 24 * 2, duration: 180, device: 'Telemóvel' },
        { id: 'sess_m3', startTime: now - 3600000 * 24 * 2, duration: 60, device: 'Desktop' },
        { id: 'sess_m4', startTime: now - 3600000 * 24 * 1, duration: 840, device: 'Desktop' },
        { id: 'sess_m5', startTime: now - 3600000 * 12, duration: 250, device: 'Telemóvel' },
        { id: 'sess_m6', startTime: now - 3600000 * 3, duration: 320, device: 'Desktop' },
        { id: 'sess_m7', startTime: now - 1800000, duration: 490, device: 'Telemóvel' },
        { id: sessionId, startTime: now - 30000, duration: 30, device: 'Desktop' }
      ];

      mockSessions.forEach(s => {
        db.sessions[s.id] = s;
      });

      // Mock Page Views
      const pages = ['index.html', 'projectos.html', 'blog.html', 'orcamento.html'];
      mockSessions.forEach(s => {
        // every session views index
        db.pageViews.push({ path: 'index.html', timestamp: s.startTime, sessionId: s.id });
        if (s.duration > 100) {
          db.pageViews.push({ path: 'projectos.html', timestamp: s.startTime + 60000, sessionId: s.id });
        }
        if (s.duration > 200) {
          db.pageViews.push({ path: 'orcamento.html', timestamp: s.startTime + 120000, sessionId: s.id });
        }
        if (s.duration > 400) {
          db.pageViews.push({ path: 'blog.html', timestamp: s.startTime + 240000, sessionId: s.id });
        }
      });

      // Mock calculator usages
      db.calculatorData.push(
        { area: 120, location: 'base', standard: 'executivo', estimatedCost: 1800000, timestamp: now - 3600000 * 48, sessionId: 'sess_m1' },
        { area: 180, location: 'logistic', standard: 'premium', estimatedCost: 5562000, timestamp: now - 3600000 * 24, sessionId: 'sess_m4' },
        { area: 350, location: 'water', standard: 'luxo', estimatedCost: 20212500, timestamp: now - 3600000 * 10, sessionId: 'sess_m6' },
        { area: 150, location: 'base', standard: 'executivo', estimatedCost: 2250000, timestamp: now - 1500000, sessionId: 'sess_m7' }
      );

      // Mock leads
      db.leads.push(
        {
          source: 'Simulador',
          details: { nome: 'João Macaringue', email: 'joao.mac@empresa.co.mz', telefone: '+258 84 123 4567', standard: 'Padrão Convencional', area: 120, custo: '1.800.000 MT', totalCost: 1800000 },
          timestamp: now - 3600000 * 48,
          sessionId: 'sess_m1'
        },
        {
          source: 'Simulador',
          details: { nome: 'Maria Langa', email: 'maria.langa@hotmail.com', telefone: '+258 82 890 1234', standard: 'Padrão Executivo', area: 180, custo: '5.562.000 MT', totalCost: 5562000 },
          timestamp: now - 3600000 * 24,
          sessionId: 'sess_m4'
        },
        {
          source: 'Simulador',
          details: { nome: 'Amina Patel', email: 'amina.patel@villa.co.mz', telefone: '+258 85 555 4321', standard: 'Alto Padrão / Luxo', area: 350, custo: '42.367.000 MT', totalCost: 42367000 },
          timestamp: now - 3600000 * 10,
          sessionId: 'sess_m6'
        },
        {
          source: 'Contactos',
          details: { nome: 'Carlos Muthemba', email: 'carlos@muthemba.com', telefone: '+258 87 111 2222', mensagem: 'Solicito catálogo de moradias corporativas para Marracuene.' },
          timestamp: now - 3600000 * 8,
          sessionId: 'sess_m6'
        },
        {
          source: 'WhatsApp Clicado',
          details: { button: 'Botão de Contacto Directo' },
          timestamp: now - 3600000 * 2,
          sessionId: 'sess_m7'
        }
      );

      // Mock other clicks
      db.events.push(
        { eventName: 'Project Click', metadata: { id: 'project-9', category: 'Inovação' }, timestamp: now - 3600000 * 24, sessionId: 'sess_m4' },
        { eventName: 'Project Click', metadata: { id: 'project-18', category: 'Saúde' }, timestamp: now - 3600000 * 10, sessionId: 'sess_m6' }
      );

      saveDB(db);
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('jdi_analytics_updated'));
      }
    }
  };

  // Run automatically on load
  JDIAnalytics.trackPageView();

  // Expose globally
  window.JDIAnalytics = JDIAnalytics;

  // --- REACT CONTEXT AND HOOK DEFINITION ---
  if (window.React) {
    const React = window.React;
    JDIAnalytics.SiteAnalyticsContext = React.createContext(null);

    JDIAnalytics.SiteAnalyticsProvider = function({ children }) {
      const value = React.useMemo(() => ({
        trackEvent: (name, meta) => JDIAnalytics.trackEvent(name, meta),
        trackLead: (src, det) => JDIAnalytics.trackLead(src, det),
        trackCalculator: (a, l, s) => JDIAnalytics.trackCalculator(a, l, s),
        sessionId: JDIAnalytics.sessionId
      }), []);

      return React.createElement(
        JDIAnalytics.SiteAnalyticsContext.Provider,
        { value: value },
        children
      );
    };

    JDIAnalytics.useSiteAnalytics = function() {
      const context = React.useContext(JDIAnalytics.SiteAnalyticsContext);
      if (!context) {
        throw new Error('useSiteAnalytics must be used within a SiteAnalyticsProvider');
      }
      return context;
    };
  }

  // --- HIDDEN TRIGGER WORKSPACE ---
  window.addEventListener('keydown', function(e) {
    if ((e.key === "'" || e.key === '"' || e.code === 'Quote') && e.shiftKey && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      triggerPINModal();
    }
  });

  // URL trigger check (?admin, ?analytics, #admin, #analytics)
  function checkUrlTrigger() {
    const search = window.location.search.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (search.includes('admin') || search.includes('analytics') || hash === '#admin' || hash === '#analytics') {
      // Clean up the hash/query parameter without reloading the page for security and clean UI
      if (window.history && window.history.replaceState) {
        const cleanUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({path: cleanUrl}, '', cleanUrl);
      }
      triggerPINModal();
    }
  }

  function checkSessionOrUrl() {
    if (sessionStorage.getItem('jdi_admin_active') === 'true') {
      launchDashboard();
    } else {
      checkUrlTrigger();
    }
  }

  // Check on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkSessionOrUrl);
  } else {
    checkSessionOrUrl();
  }
  window.addEventListener('hashchange', checkSessionOrUrl);

  // Footer Copyright triple-tap trigger and automatic link click tracking
  let footerClicks = 0;
  let lastClickTime = 0;
  document.addEventListener('click', function(e) {
    const target = e.target;
    
    // 1. Footer triple-click trigger
    if (target.closest('.site-footer') || target.closest('.contacts-footer-section')) {
      const now = Date.now();
      if (now - lastClickTime < 800) {
        footerClicks++;
      } else {
        footerClicks = 1;
      }
      lastClickTime = now;
      if (footerClicks >= 3) {
        footerClicks = 0;
        triggerPINModal();
      }
    }

    // 2. Track critical contact link clicks automatically
    const a = target.closest('a');
    if (a) {
      const href = a.getAttribute('href') || '';
      const text = a.textContent.trim() || 'Link';
      if (href.startsWith('mailto:')) {
        JDIAnalytics.trackLead('Email Clicado', { email: href.replace('mailto:', ''), label: text });
      } else if (href.includes('wa.me') || href.includes('whatsapp.com')) {
        JDIAnalytics.trackLead('WhatsApp Clicado', { url: href, label: text });
      } else if (href.startsWith('tel:')) {
        JDIAnalytics.trackLead('Telefone Clicado', { tel: href.replace('tel:', ''), label: text });
      } else if (href.includes('orcamento.html')) {
        JDIAnalytics.trackEvent('Simulador Click', { label: text, page: window.location.pathname });
      }
    }
  });

  // --- PIN MODAL POPUP ---
  function triggerPINModal() {
    // Check if already open
    if (document.getElementById('jdi-pin-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'jdi-pin-modal';
    modal.className = 'no-print';
    modal.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(12, 19, 29, 0.75);
      backdrop-filter: blur(15px);
      -webkit-backdrop-filter: blur(15px);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter', system-ui, sans-serif;
    `;

    const modalBox = document.createElement('div');
    modalBox.style.cssText = `
      background: rgba(25, 41, 61, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.15);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
      border-radius: 24px;
      padding: 32px;
      width: min(340px, 90vw);
      text-align: center;
      color: #fff;
    `;

    modalBox.innerHTML = `
      <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 8px; letter-spacing: 0.05em; text-transform: uppercase; color: #1ea8fc;">Acesso Administrativo</h3>
      <p style="font-size: 0.75rem; color: #94a3b8; margin-bottom: 24px;">Introduza o PIN de 4 dígitos</p>
      
      <!-- PIN Indicators -->
      <div style="display: flex; justify-content: center; gap: 16px; margin-bottom: 32px;">
        <span class="pin-dot" style="width: 14px; height: 14px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); transition: all 0.2s;"></span>
        <span class="pin-dot" style="width: 14px; height: 14px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); transition: all 0.2s;"></span>
        <span class="pin-dot" style="width: 14px; height: 14px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); transition: all 0.2s;"></span>
        <span class="pin-dot" style="width: 14px; height: 14px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.3); transition: all 0.2s;"></span>
      </div>

      <!-- Numeric Keypad -->
      <div style="display: grid; grid-cols-3; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px;">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => `
          <button class="keypad-btn" data-val="${num}" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.05); color: #fff; font-size: 1.25rem; font-weight: 600; padding: 12px; rounded; border-radius: 12px; cursor: pointer; transition: all 0.15s; outline: none;">${num}</button>
        `).join('')}
        <button class="keypad-btn" data-val="C" style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.1); color: #ef4444; font-size: 1rem; font-weight: bold; padding: 12px; border-radius: 12px; cursor: pointer; transition: all 0.15s; outline: none;">Limpar</button>
        <button class="keypad-btn" data-val="0" style="background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.05); color: #fff; font-size: 1.25rem; font-weight: 600; padding: 12px; border-radius: 12px; cursor: pointer; transition: all 0.15s; outline: none;">0</button>
        <button class="keypad-btn" data-val="X" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.05); color: #ccc; font-size: 0.9rem; font-weight: bold; padding: 12px; border-radius: 12px; cursor: pointer; transition: all 0.15s; outline: none;">Fechar</button>
      </div>
    `;

    modal.appendChild(modalBox);
    document.body.appendChild(modal);

    let enteredPin = "";
    const dots = modalBox.querySelectorAll('.pin-dot');

    function updateDots() {
      dots.forEach((dot, idx) => {
        if (idx < enteredPin.length) {
          dot.style.background = '#1ea8fc';
          dot.style.borderColor = '#1ea8fc';
          dot.style.transform = 'scale(1.2)';
        } else {
          dot.style.background = 'transparent';
          dot.style.borderColor = 'rgba(255,255,255,0.3)';
          dot.style.transform = 'scale(1)';
        }
      });
    }

    const correctPin = "2580";

    modalBox.addEventListener('click', function(e) {
      const btn = e.target.closest('.keypad-btn');
      if (!btn) return;
      const val = btn.dataset.val;

      // Click micro-animation
      btn.style.transform = 'scale(0.92)';
      setTimeout(() => { btn.style.transform = 'none'; }, 100);

      if (val === 'X') {
        document.body.removeChild(modal);
      } else if (val === 'C') {
        enteredPin = "";
        updateDots();
      } else {
        if (enteredPin.length < 4) {
          enteredPin += val;
          updateDots();
        }
        if (enteredPin.length === 4) {
          setTimeout(() => {
            if (enteredPin === correctPin) {
              sessionStorage.setItem('jdi_admin_active', 'true');
              document.body.removeChild(modal);
              launchDashboard();
            } else {
              // Shake animation/error effect
              modalBox.style.animation = 'shake 0.3s ease';
              dots.forEach(d => d.style.background = '#ef4444');
              setTimeout(() => {
                enteredPin = "";
                updateDots();
                modalBox.style.animation = '';
              }, 400);
            }
          }, 200);
        }
      }
    });

    // CSS Shake & Pulse Keyframes
    if (!document.getElementById('jdi-shake-style')) {
      const shakeStyle = document.createElement('style');
      shakeStyle.id = 'jdi-shake-style';
      shakeStyle.innerHTML = `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
      `;
      document.head.appendChild(shakeStyle);
    }
  }

  // --- LAUNCH REACT WORKSPACE DASHBOARD ---
  function launchDashboard() {
    // If dashboard container already exists, return
    if (document.getElementById('jdi-admin-dashboard-root')) return;

    // Create wrapper div
    const rootDiv = document.createElement('div');
    rootDiv.id = 'jdi-admin-dashboard-root';
    document.body.appendChild(rootDiv);

    // Dynamic React Dependency check
    if (window.React && window.ReactDOM) {
      renderDashboardApp();
    } else {
      // In vanilla JS pages, dynamically load React and ReactDOM first
      const overlayLoader = document.createElement('div');
      overlayLoader.id = 'jdi-dashboard-loader';
      overlayLoader.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 999998;
        background: #0c131d;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: 'Inter', sans-serif;
        color: #fff;
      `;
      overlayLoader.innerHTML = `
        <div style="width: 40px; height: 40px; border: 3px solid rgba(255,255,255,0.1); border-top-color: #1ea8fc; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 16px;"></div>
        <p style="font-size: 0.8rem; color: #94a3b8; letter-spacing: 0.1em; text-transform: uppercase;">Carregando Painel...</p>
        <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
      `;
      document.body.appendChild(overlayLoader);

      Promise.all([
        loadScript('https://unpkg.com/react@18/umd/react.production.min.js'),
        loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js')
      ]).then(() => {
        document.body.removeChild(overlayLoader);
        renderDashboardApp();
      }).catch(err => {
        alert('Falha ao carregar dependências do Painel.');
        document.body.removeChild(overlayLoader);
        document.body.removeChild(rootDiv);
      });
    }
  }

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.crossOrigin = 'anonymous';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // --- REACT DASHBOARD COMPONENT RENDERER ---
  function renderDashboardApp() {
    const React = window.React;
    const ReactDOM = window.ReactDOM;
    const e = React.createElement;

    function AdminDashboard() {
      const [activeTab, setActiveTab] = React.useState('overview');
      const [dbState, setDbState] = React.useState(getDB());

      React.useEffect(() => {
        const handler = () => {
          setDbState(getDB());
        };
        window.addEventListener('jdi_analytics_updated', handler);
        return () => window.removeEventListener('jdi_analytics_updated', handler);
      }, []);

      const closeDashboard = () => {
        sessionStorage.removeItem('jdi_admin_active');
        const root = document.getElementById('jdi-admin-dashboard-root');
        if (root) {
          document.body.removeChild(root);
        }
      };

      const handleClear = () => {
        if (confirm('Tem a certeza que deseja apagar todos os dados de rastreio de analítica?')) {
          JDIAnalytics.clearData();
        }
      };

      const handleInject = () => {
        JDIAnalytics.injectMockData();
      };

      // --- CALCULATIONS FOR VISÃO GERAL ---
      const stats = React.useMemo(() => {
        const pageViewsCount = dbState.pageViews.length;
        
        // Sessions
        const sessKeys = Object.keys(dbState.sessions);
        const uniqueSessionsCount = sessKeys.length;
        
        // Avg retention
        let totalDuration = 0;
        sessKeys.forEach(k => {
          totalDuration += dbState.sessions[k].duration;
        });
        const avgDurationSecs = uniqueSessionsCount > 0 ? Math.round(totalDuration / uniqueSessionsCount) : 0;
        const avgDurationFmt = `${Math.floor(avgDurationSecs / 60)}m ${avgDurationSecs % 60}s`;

        // Conversions
        const formConversionsCount = dbState.leads.filter(l => l.source === 'Simulador' || l.source === 'Contactos').length;
        const totalConversions = dbState.leads.length;

        // Page view breakdown
        const pageRank = {};
        dbState.pageViews.forEach(pv => {
          pageRank[pv.path] = (pageRank[pv.path] || 0) + 1;
        });
        const rankedPages = Object.entries(pageRank)
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => ({ name, count }));

        // Event click rankings
        const eventRank = {};
        dbState.events.forEach(evt => {
          const key = evt.eventName + (evt.metadata.id ? ` - ${evt.metadata.id}` : '');
          eventRank[key] = (eventRank[key] || 0) + 1;
        });
        const rankedEvents = Object.entries(eventRank)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => ({ name, count }));

        return {
          pageViewsCount,
          uniqueSessionsCount,
          avgDurationFmt,
          formConversionsCount,
          totalConversions,
          rankedPages,
          rankedEvents
        };
      }, [dbState]);

      // --- CALCULATIONS FOR LAST 7 DAYS CHARTS ---
      const dateStats = React.useMemo(() => {
        const last7Days = [];
        const label7Days = [];
        const viewCounts = {};
        const leadCounts = {};
        
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          const dateStr = `${year}-${month}-${day}`;
          
          last7Days.push(dateStr);
          label7Days.push(`${d.getDate()} ${monthNames[d.getMonth()]}`);
          
          viewCounts[dateStr] = 0;
          leadCounts[dateStr] = 0;
        }

        const getLocalDateStr = (timestamp) => {
          const d = new Date(timestamp);
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const day = String(d.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        dbState.pageViews.forEach(pv => {
          const pvDate = getLocalDateStr(pv.timestamp);
          if (viewCounts[pvDate] !== undefined) {
            viewCounts[pvDate]++;
          }
        });

        dbState.leads.forEach(ld => {
          const ldDate = getLocalDateStr(ld.timestamp);
          if (leadCounts[ldDate] !== undefined) {
            leadCounts[ldDate]++;
          }
        });

        return {
          labels: label7Days,
          views: last7Days.map(d => viewCounts[d]),
          leads: last7Days.map(d => leadCounts[d])
        };
      }, [dbState]);

      const dateRangeFmt = React.useMemo(() => {
        if (dateStats.labels.length === 0) return '';
        return `${dateStats.labels[0]} - ${dateStats.labels[dateStats.labels.length - 1]}`;
      }, [dateStats]);

      // --- CALCULATIONS FOR CALCULATOR PREFERENCES ---
      const calcStats = React.useMemo(() => {
        const totalSims = dbState.calculatorData.length;
        
        // Location distribution
        const locations = { base: 0, water: 0, logistic: 0 };
        dbState.calculatorData.forEach(d => {
          if (locations[d.location] !== undefined) locations[d.location]++;
        });
        
        // Standard distribution
        const standards = { executivo: 0, premium: 0, luxo: 0 };
        dbState.calculatorData.forEach(d => {
          if (standards[d.standard] !== undefined) standards[d.standard]++;
        });

        // Money Generated Calculations from Simulador leads and calculatorData
        let totalSimulatedCost = 0;
        dbState.calculatorData.forEach(d => {
          totalSimulatedCost += Number(d.estimatedCost || 0);
        });

        const sims = dbState.leads.filter(l => l.source === 'Simulador');
        let totalPipeline = 0;
        let maxProject = 0;
        
        sims.forEach(s => {
          const cost = Number(s.details.totalCost || 0);
          totalPipeline += cost;
          if (cost > maxProject) maxProject = cost;
        });
        
        const avgProject = sims.length > 0 ? Math.round(totalPipeline / sims.length) : 0;
        
        const formatMZ = (val) => {
          return new Intl.NumberFormat('pt-MZ').format(val) + ' MT';
        };

        const locationLabels = {
          base: 'Maputo Cidade / Matola',
          water: 'Costa do Sol / Catembe',
          logistic: 'Marracuene'
        };

        const standardLabels = {
          executivo: 'Padrão Convencional',
          premium: 'Padrão Executivo',
          luxo: 'Alto Padrão / Luxo'
        };

        return {
          totalSims,
          totalPipelineFmt: formatMZ(totalPipeline),
          totalSimulatedCostFmt: formatMZ(totalSimulatedCost),
          avgProjectFmt: formatMZ(avgProject),
          maxProjectFmt: formatMZ(maxProject),
          locations: Object.entries(locations).map(([key, count]) => ({
            label: locationLabels[key] || key,
            count,
            percent: totalSims > 0 ? Math.round((count / totalSims) * 100) : 0
          })),
          standards: Object.entries(standards).map(([key, count]) => ({
            label: standardLabels[key] || key,
            count,
            percent: totalSims > 0 ? Math.round((count / totalSims) * 100) : 0
          }))
        };
      }, [dbState]);

      // Elements structure using React.createElement
      return e('div', {
        style: {
          position: 'fixed',
          inset: 0,
          zIndex: 999999,
          background: '#0a0f1d',
          color: '#fff',
          fontFamily: "'Inter', sans-serif",
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }
      }, [
        // --- NAVBAR HEADER ---
        e('div', {
          key: 'header',
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 4%',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(10,15,29,0.9)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backdropFilter: 'blur(10px)'
          }
        }, [
          e('div', { key: 'logo-area', style: { display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' } }, [
            e('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
              e('div', { style: { width: '10px', height: '10px', borderRadius: '50%', background: '#1ea8fc', animation: 'pulse 2s infinite' } }),
              e('h2', { style: { fontSize: '1rem', fontWeight: '800', letterSpacing: '0.12em', textTransform: 'uppercase', margin: 0 } }, 'JDI Analytics')
            ]),
            e('div', {
              style: {
                background: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.25)',
                color: '#10b981',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                padding: '4px 10px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }
            }, [
              e('span', { style: { width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', animation: 'pulse 1.5s infinite' } }),
              e('span', {}, `Página Aberta: ${window.location.pathname.split('/').pop() || 'index.html'}`)
            ])
          ]),
          e('div', { key: 'action-area', style: { display: 'flex', gap: '12px' } }, [
            e('button', {
              onClick: handleClear,
              style: { background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: '0.75rem', fontWeight: 'bold', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }
            }, 'Limpar Histórico'),
            e('button', {
              onClick: closeDashboard,
              style: { background: '#1b5f90', border: 'none', color: '#fff', fontSize: '0.75rem', fontWeight: 'bold', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }
            }, 'Fechar Painel')
          ])
        ]),

        // --- SUBHEADER TABS ---
        e('div', {
          key: 'tabs-bar',
          style: {
            display: 'flex',
            padding: '12px 4%',
            background: 'rgba(10,15,29,0.5)',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            gap: '16px'
          }
        }, [
          ['overview', 'Visão Geral'],
          ['leads', 'Conversões e Leads'],
          ['calculator', 'Preferências do Mercado']
        ].map(([tabKey, label]) => 
          e('button', {
            key: tabKey,
            onClick: () => setActiveTab(tabKey),
            style: {
              background: activeTab === tabKey ? 'rgba(255,255,255,0.08)' : 'transparent',
              border: 'none',
              color: activeTab === tabKey ? '#1ea8fc' : '#94a3b8',
              fontSize: '0.8rem',
              fontWeight: activeTab === tabKey ? 'bold' : 'normal',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }
          }, label)
        )),

        // --- TAB BODY ---
        e('div', {
          key: 'tab-content',
          style: {
            flexGrow: 1,
            padding: '32px 4%',
            maxWidth: '1200px',
            width: '100%',
            margin: '0 auto'
          }
        }, [
          // ── TAB 1: VISÃO GERAL ──
          activeTab === 'overview' && e('div', { key: 'view-overview', className: 'space-y-8' }, [
            // Date Range Tracker Header
            e('div', {
              key: 'date-tracker',
              style: { 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginBottom: '24px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.04)',
                borderRadius: '12px',
                padding: '12px 20px',
                fontSize: '0.8rem'
              }
            }, [
              e('span', { style: { color: '#94a3b8' } }, 'Análise de Tráfego e Conversões'),
              e('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', color: '#1ea8fc', fontWeight: 'bold' } }, [
                e('svg', { 
                  fill: 'none', 
                  stroke: 'currentColor', 
                  viewBox: '0 0 24 24', 
                  strokeWidth: '2', 
                  style: { width: '16px', height: '16px', display: 'inline-block' } 
                }, [
                  e('path', { strokeLinecap: 'round', strokeLinejoin: 'round', d: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5' })
                ]),
                e('span', {}, `Período: ${dateRangeFmt}`)
              ])
            ]),

            // Stat Grid
            e('div', {
              key: 'stat-grid',
              style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }
            }, [
              ['Total Page Views', stats.pageViewsCount, '#1ea8fc', 'Cliques em links e navegação ativa.'],
              ['Sessões Únicas', stats.uniqueSessionsCount, '#10b981', 'Identificador de navegador único.'],
              ['Tempo Médio Retenção', stats.avgDurationFmt, '#f9ad0a', 'Duração média da sessão ativa.'],
              ['Total Conversões', stats.totalConversions, '#8b5cf6', 'Leads submetidos e cliques sociais.']
            ].map(([title, val, color, desc]) => 
              e('div', {
                key: title,
                style: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', position: 'relative' }
              }, [
                e('span', { style: { fontSize: '0.7rem', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', trackingWide: '0.05em' } }, title),
                e('div', { style: { fontSize: '1.8rem', fontWeight: '800', color: color, margin: '8px 0' } }, val),
                e('span', { style: { fontSize: '0.65rem', color: '#64748b' } }, desc)
              ])
            )),

            // Graphs Row
            e('div', {
              key: 'graphs-row',
              style: { 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                gap: '32px', 
                marginBottom: '32px' 
              }
            }, [
              // Graph 1: Page Views
              e('div', {
                style: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '16px', padding: '24px' }
              }, [
                e('h3', { style: { fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '20px', color: '#1ea8fc', textTransform: 'uppercase', letterSpacing: '0.05em' } }, 'Tráfego (Page Views)'),
                e('svg', {
                  width: '100%',
                  height: '180',
                  viewBox: '0 0 450 180',
                  style: { overflow: 'visible' }
                }, (() => {
                  const width = 450;
                  const height = 180;
                  const paddingX = 40;
                  const paddingY = 25;
                  const graphWidth = width - paddingX * 2;
                  const graphHeight = height - paddingY * 2;
                  
                  const maxView = Math.max(...dateStats.views, 1);
                  const points = dateStats.views.map((val, idx) => {
                    const x = paddingX + idx * (graphWidth / 6);
                    const y = height - paddingY - (val / maxView) * graphHeight;
                    return { x, y, val };
                  });

                  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
                  const areaPath = points.length > 0 ? `${linePath} L ${points[points.length-1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z` : '';

                  return [
                    e('defs', { key: 'defs' }, [
                      e('linearGradient', { id: 'viewGrad', x1: '0', y1: '0', x2: '0', y2: '1', key: 'grad' }, [
                        e('stop', { offset: '0%', stopColor: '#1ea8fc', stopOpacity: 0.25, key: 's1' }),
                        e('stop', { offset: '100%', stopColor: '#1ea8fc', stopOpacity: 0.0, key: 's2' })
                      ])
                    ]),
                    // Grid lines
                    [0.25, 0.5, 0.75, 1.0].map((ratio, idx) => {
                      const y = height - paddingY - ratio * graphHeight;
                      return e('line', {
                        key: `grid-${idx}`,
                        x1: paddingX,
                        y1: y,
                        x2: width - paddingX,
                        y2: y,
                        stroke: 'rgba(255,255,255,0.03)',
                        strokeWidth: 1,
                        strokeDasharray: '3 3'
                      });
                    }),
                    // Area path
                    areaPath && e('path', {
                      key: 'area',
                      d: areaPath,
                      fill: 'url(#viewGrad)'
                    }),
                    // Line path
                    linePath && e('path', {
                      key: 'line',
                      d: linePath,
                      fill: 'none',
                      stroke: '#1ea8fc',
                      strokeWidth: 3.5,
                      strokeLinecap: 'round',
                      strokeLinejoin: 'round'
                    }),
                    // Dots & text labels
                    points.map((p, idx) => e('g', { key: `dot-${idx}` }, [
                      e('circle', {
                        cx: p.x,
                        cy: p.y,
                        r: 4.5,
                        fill: '#1ea8fc',
                        stroke: '#0a0f1d',
                        strokeWidth: 2,
                        key: 'circle'
                      }),
                      p.val > 0 && e('text', {
                        x: p.x,
                        y: p.y - 10,
                        textAnchor: 'middle',
                        fill: '#fff',
                        fontSize: '9',
                        fontWeight: 'bold',
                        key: 'lbl'
                      }, p.val),
                      e('text', {
                        x: p.x,
                        y: height - 5,
                        textAnchor: 'middle',
                        fill: '#64748b',
                        fontSize: '8',
                        key: 'axis-lbl'
                      }, dateStats.labels[idx])
                    ]))
                  ];
                })())
              ]),

              // Graph 2: Leads & Conversões
              e('div', {
                style: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '16px', padding: '24px' }
              }, [
                e('h3', { style: { fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '20px', color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' } }, 'Conversões (Leads)'),
                e('svg', {
                  width: '100%',
                  height: '180',
                  viewBox: '0 0 450 180',
                  style: { overflow: 'visible' }
                }, (() => {
                  const width = 450;
                  const height = 180;
                  const paddingX = 40;
                  const paddingY = 25;
                  const graphWidth = width - paddingX * 2;
                  const graphHeight = height - paddingY * 2;
                  const maxLead = Math.max(...dateStats.leads, 1);
                  
                  return [
                    e('defs', { key: 'defs' }, [
                      e('linearGradient', { id: 'leadGrad', x1: '0', y1: '0', x2: '0', y2: '1', key: 'grad' }, [
                        e('stop', { offset: '0%', stopColor: '#10b981', stopOpacity: 1.0, key: 's1' }),
                        e('stop', { offset: '100%', stopColor: '#059669', stopOpacity: 0.3, key: 's2' })
                      ])
                    ]),
                    // Grid lines
                    [0.25, 0.5, 0.75, 1.0].map((ratio, idx) => {
                      const y = height - paddingY - ratio * graphHeight;
                      return e('line', {
                        key: `grid-${idx}`,
                        x1: paddingX,
                        y1: y,
                        x2: width - paddingX,
                        y2: y,
                        stroke: 'rgba(255,255,255,0.03)',
                        strokeWidth: 1,
                        strokeDasharray: '3 3'
                      });
                    }),
                    // Bars
                    dateStats.leads.map((val, idx) => {
                      const x = paddingX + idx * (graphWidth / 6) - 10;
                      const barHeight = (val / maxLead) * graphHeight;
                      const y = height - paddingY - barHeight;
                      
                      return e('g', { key: `bar-${idx}` }, [
                        e('rect', {
                          x: x,
                          y: y,
                          width: 20,
                          height: Math.max(barHeight, 0),
                          rx: 4,
                          fill: val > 0 ? 'url(#leadGrad)' : 'rgba(255,255,255,0.05)',
                          key: 'rect'
                        }),
                        val > 0 && e('text', {
                          x: x + 10,
                          y: y - 8,
                          textAnchor: 'middle',
                          fill: '#fff',
                          fontSize: '9',
                          fontWeight: 'bold',
                          key: 'lbl'
                        }, val),
                        e('text', {
                          x: x + 10,
                          y: height - 5,
                          textAnchor: 'middle',
                          fill: '#64748b',
                          fontSize: '8',
                          key: 'axis-lbl'
                        }, dateStats.labels[idx])
                      ]);
                    })
                  ];
                })())
              ])
            ]),

            // Ranked lists side-by-side
            e('div', {
              key: 'ranked-lists',
              style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '32px' }
            }, [
              // Page Views Ranking
              e('div', {
                style: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '16px', padding: '24px' }
              }, [
                e('h3', { style: { fontSize: '0.9rem', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '16px' } }, 'Tráfego por Página / Secção'),
                stats.rankedPages.length === 0 ? e('p', { style: { fontSize: '0.75rem', color: '#64748b' } }, 'Nenhum dado registado.') : 
                stats.rankedPages.map((page, idx) => 
                  e('div', {
                    key: page.name,
                    style: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.02)', fontSize: '0.8rem' }
                  }, [
                    e('span', { style: { color: '#94a3b8' } }, [
                      `${idx + 1}. `,
                      e('a', {
                        href: page.name,
                        style: {
                          color: '#1ea8fc',
                          textDecoration: 'none',
                          fontWeight: '600',
                          borderBottom: '1px dashed rgba(30,168,252,0.3)',
                          cursor: 'pointer'
                        }
                      }, page.name)
                    ]),
                    e('span', { style: { fontWeight: 'bold', color: '#1ea8fc' } }, `${page.count} views`)
                  ])
                )
              ]),

              // Event clicks rankings
              e('div', {
                style: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '16px', padding: '24px' }
              }, [
                e('h3', { style: { fontSize: '0.9rem', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px', marginBottom: '16px' } }, 'Top Ações e Cliques Críticos'),
                stats.rankedEvents.length === 0 ? e('p', { style: { fontSize: '0.75rem', color: '#64748b' } }, 'Nenhum clique registado ainda.') :
                stats.rankedEvents.map((evt, idx) => 
                  e('div', {
                    key: evt.name,
                    style: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.02)', fontSize: '0.8rem' }
                  }, [
                    e('span', { style: { color: '#94a3b8' } }, `${idx + 1}. ${evt.name}`),
                    e('span', { style: { fontWeight: 'bold', color: '#10b981' } }, `${evt.count} cliques`)
                  ])
                )
              ])
            ])
          ]),

          // ── TAB 2: CONVERSÕES E LEADS ──
          activeTab === 'leads' && e('div', { key: 'view-leads' }, [
            e('h3', { style: { fontSize: '1rem', fontWeight: 'bold', marginBottom: '20px' } }, 'Leads e Submissões de Formulários'),
            dbState.leads.length === 0 ? e('p', { style: { fontSize: '0.8rem', color: '#64748b' } }, 'Sem leads capturadas no momento.') :
            e('div', {
              style: { overflowX: 'auto', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px' }
            }, 
              e('table', {
                style: { width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem', textAlign: 'left' }
              }, [
                e('thead', { key: 'thead' }, 
                  e('tr', { style: { background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.08)' } }, [
                    e('th', { style: { padding: '12px 16px', color: '#94a3b8' } }, 'Data'),
                    e('th', { style: { padding: '12px 16px', color: '#94a3b8' } }, 'Origem'),
                    e('th', { style: { padding: '12px 16px', color: '#94a3b8' } }, 'Contacto'),
                    e('th', { style: { padding: '12px 16px', color: '#94a3b8' } }, 'Detalhes / Mensagem')
                  ])
                ),
                e('tbody', { key: 'tbody' }, 
                  dbState.leads.map((lead, idx) => {
                    const date = new Date(lead.timestamp).toLocaleString('pt-MZ');
                    let contactStr = `${lead.details.nome || 'Visitante'} \n [${lead.details.email || 'N/A'}] \n ${lead.details.telefone || ''}`;
                    if (lead.source === 'WhatsApp Clicado') {
                      contactStr = `Visitante (WhatsApp)`;
                    }

                    return e('tr', {
                      key: idx,
                      style: { borderBottom: '1px solid rgba(255,255,255,0.04)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }
                    }, [
                      e('td', { style: { padding: '16px', verticalAlign: 'top', color: '#64748b' } }, date),
                      e('td', { style: { padding: '16px', verticalAlign: 'top', fontWeight: 'bold', color: lead.source === 'Simulador' ? '#10b981' : '#1ea8fc' } }, lead.source),
                      e('td', { style: { padding: '16px', verticalAlign: 'top', whiteSpace: 'pre-line', color: '#e2e8f0' } }, contactStr),
                      e('td', { style: { padding: '16px', verticalAlign: 'top', color: '#94a3b8', lineHeight: '1.4' } }, 
                        lead.source === 'Simulador' 
                          ? `Área: ${lead.details.area}m² | Acabamento: ${lead.details.standard} \n Custo Estimado: ${lead.details.custo}` 
                          : (lead.details.mensagem || lead.details.button || 'Conversão de contacto direto')
                      )
                    ]);
                  })
                )
              ])
            )
          ]),

          // ── TAB 3: PREFERÊNCIAS DO MERCADO ──
          activeTab === 'calculator' && e('div', { key: 'view-calculator' }, [
            e('div', {
              style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }
            }, [
              // Standard level breakdown
              e('div', {
                style: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '16px', padding: '24px' }
              }, [
                e('h3', { style: { fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '24px', color: '#1ea8fc' } }, 'Distribuição por Padrão de Acabamento'),
                calcStats.totalSims === 0 ? e('p', { style: { fontSize: '0.75rem', color: '#64748b' } }, 'Nenhum dado disponível.') :
                calcStats.standards.map(std => 
                  e('div', { key: std.label, style: { marginBottom: '20px' } }, [
                    e('div', { style: { display: 'flex', justifyBetween: 'space-between', displayFlex: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' } }, [
                      e('span', { style: { color: '#94a3b8' } }, std.label),
                      e('span', { style: { fontWeight: 'bold' } }, `${std.percent}% (${std.count})`)
                    ]),
                    e('div', {
                      style: { width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }
                    }, 
                      e('div', {
                        style: { width: `${std.percent}%`, height: '100%', background: '#1ea8fc', borderRadius: '4px', transition: 'width 0.5s' }
                      })
                    )
                  ])
                )
              ]),

              // Location breakdown
              e('div', {
                style: { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '16px', padding: '24px' }
              }, [
                e('h3', { style: { fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '24px', color: '#10b981' } }, 'Distribuição Geográfica de Obras'),
                calcStats.totalSims === 0 ? e('p', { style: { fontSize: '0.75rem', color: '#64748b' } }, 'Nenhum dado disponível.') :
                calcStats.locations.map(loc => 
                  e('div', { key: loc.label, style: { marginBottom: '20px' } }, [
                    e('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' } }, [
                      e('span', { style: { color: '#94a3b8' } }, loc.label),
                      e('span', { style: { fontWeight: 'bold' } }, `${loc.percent}% (${loc.count})`)
                    ]),
                    e('div', {
                      style: { width: '100%', height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }
                    }, 
                      e('div', {
                        style: { width: `${loc.percent}%`, height: '100%', background: '#10b981', borderRadius: '4px', transition: 'width 0.5s' }
                      })
                    )
                  ])
                )
              ]),

              // Pipeline Financeiro Gerado card
              e('div', {
                style: { 
                  background: 'rgba(255,255,255,0.02)', 
                  border: '1px solid rgba(255,255,255,0.04)', 
                  borderRadius: '16px', 
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }
              }, [
                e('div', { key: 'title-sec', style: { marginBottom: '16px' } }, [
                  e('h3', { style: { fontSize: '0.9rem', fontWeight: 'bold', color: '#f9ad0a', margin: 0 } }, 'Pipeline Financeiro Gerado')
                ]),
                e('div', { key: 'main-metric', style: { textAlign: 'center', margin: '12px 0' } }, [
                  e('span', { style: { fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 'bold' } }, 'Pipeline Convertido (Leads)'),
                  e('div', { style: { fontSize: '2rem', fontWeight: '900', color: '#f9ad0a', marginTop: '8px' } }, calcStats.totalPipelineFmt),
                  e('p', { style: { fontSize: '0.7rem', color: '#64748b', margin: '8px auto 0', maxWidth: '280px' } }, 'Soma dos orçamentos calculados de leads que preencheram o formulário de contacto.')
                ]),
                e('div', { 
                  key: 'sub-metrics', 
                  style: { 
                    borderTop: '1px solid rgba(255,255,255,0.05)', 
                    paddingTop: '16px', 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '12px',
                    fontSize: '0.75rem'
                  } 
                }, [
                  e('div', { key: 'sub-sim' }, [
                    e('span', { style: { color: '#64748b', display: 'block', marginBottom: '2px' } }, 'Total Simulado'),
                    e('strong', { style: { color: '#e2e8f0', fontSize: '0.85rem' } }, calcStats.totalSimulatedCostFmt)
                  ]),
                  e('div', { key: 'sub-avg' }, [
                    e('span', { style: { color: '#64748b', display: 'block', marginBottom: '2px' } }, 'Média / Projecto'),
                    e('strong', { style: { color: '#e2e8f0', fontSize: '0.85rem' } }, calcStats.avgProjectFmt)
                  ])
                ])
              ])
            ])
          ])

        ])
      ]);
    }

    // Mount React App
    const root = ReactDOM.createRoot(document.getElementById('jdi-admin-dashboard-root'));
    root.render(React.createElement(AdminDashboard));
  }

})();
