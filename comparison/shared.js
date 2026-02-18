(function () {
  const STORAGE_KEY = 'uspecme_lang';
  const SUPPORTED = ['en', 'de'];

  const I18N = {
    en: {
      'design.a': 'Design A · Mockup',
      'design.b': 'Design B · Editorial',
      'design.c': 'Design C · Performance',
      'design.d': 'Design D · World-Class',
      'nav.value': 'Value',
      'nav.flow': 'Flow',
      'nav.proof': 'Proof',
      'nav.profile': 'Public Profile',
      'nav.waitlist': 'Waitlist',
      'hero.badge': 'Early Access',
      'hero.title': 'Find your next teammate with proof, not guesswork.',
      'hero.lead': 'uSpecMe helps serious players and teams match on role fit, rank context, and verified performance evidence.',
      'hero.cta.primary': 'Join Waitlist',
      'hero.cta.secondary': 'See Public Profile',
      'value.heading': 'Why teams and players use uSpecMe',
      'value.v1.title': 'Role-Accurate Matching',
      'value.v1.text': 'Find people by role depth, playstyle, schedule, and communication fit.',
      'value.v2.title': 'Proof Before Tryouts',
      'value.v2.text': 'Compare ranked context and highlight evidence before investing scrim time.',
      'value.v3.title': 'Faster Team Decisions',
      'value.v3.text': 'Give captains a structured profile they can evaluate in under a minute.',
      'flow.heading': 'How the flow works',
      'flow.s1.title': 'Create Profile',
      'flow.s1.text': 'Set game, role, rank band, region, and team objective.',
      'flow.s2.title': 'Attach Proof',
      'flow.s2.text': 'Add rank snapshots, clips, and optional verification signals.',
      'flow.s3.title': 'Match + Compare',
      'flow.s3.text': 'Browse profiles with fit indicators and proof context.',
      'flow.s4.title': 'Trial + Commit',
      'flow.s4.text': 'Shortlist candidates and move into real tryouts quickly.',
      'proof.heading': 'Proof layer',
      'proof.lead': 'A profile should answer skill, consistency, and setup confidence without long back-and-forth.',
      'proof.stats.title': 'Performance Signals',
      'proof.stats.b1': 'Recent ranked trend and role consistency',
      'proof.stats.b2': 'Evidence clips linked to competitive context',
      'proof.stats.b3': 'Trust markers for cleaner team decisions',
      'proof.video.title': 'Shinobi Mockup Reference',
      'proof.video.caption': 'Reference visual from uploaded mockups.',
      'profile.title': 'Public Profile',
      'profile.role': 'Flex DPS',
      'profile.verified': 'Skill Verified',
      'profile.game.ow': 'Overwatch · Shinobi#4728',
      'profile.game.lol': 'League of Legends · Shn0bi',
      'profile.game.fn': 'ShinobiFN',
      'profile.game.rivals': 'Marvel Rivals · ShinobiX',
      'profile.rank.master': 'Master',
      'profile.rank.diamond': 'Diamond',
      'profile.rank.champion': 'Champion',
      'profile.rank.gm': 'Grandmaster',
      'profile.career.title': 'Career',
      'profile.career.line': 'FaZe · Current Member',
      'profile.career.former': 'Team Liquid · Former Member',
      'profile.setup.title': 'Pro Setup',
      'profile.setup.s1': 'Logitech G Pro X Superlight 2',
      'profile.setup.s2': 'Artisan Zero XL',
      'profile.setup.s3': 'Wooting 60HE',
      'profile.setup.s4': 'BenQ Zowie 360Hz',
      'profile.setup.s5': 'NVIDIA RTX 4090',
      'profile.metric.dpi': 'DPI 800',
      'profile.metric.sens': 'Sens 4.00',
      'profile.metric.poll': 'Polling 1000 Hz',
      'profile.metric.fov': 'FOV 103',
      'profile.caption': 'A single profile card should be enough to shortlist confidently.',
      'wait.heading': 'Join the waitlist',
      'wait.lead': 'Get early access to proof-first teamfinding for competitive online games.',
      'wait.panel.title': 'Early Access Invite',
      'wait.panel.text': 'Tell us your role and main game. The form is frontend-only in this preview.',
      'wait.panel.cta': 'Open Waitlist',
      'footer.note': 'Early access product in active construction.',
      'modal.title': 'Join the Waitlist',
      'modal.lead': 'This preview form is local-only and does not transmit data.',
      'modal.email.label': 'Email',
      'modal.email.placeholder': 'you@example.com',
      'modal.role.label': 'Role',
      'modal.role.placeholder': 'Select role',
      'modal.role.player': 'Player',
      'modal.role.team': 'Team',
      'modal.game.label': 'Main game',
      'modal.game.placeholder': 'Select main game',
      'modal.game.cs2': 'Counter-Strike 2',
      'modal.game.valorant': 'Valorant',
      'modal.game.lol': 'League of Legends',
      'modal.game.overwatch': 'Overwatch',
      'modal.game.fortnite': 'Fortnite',
      'modal.game.rivals': 'Marvel Rivals',
      'modal.game.rocket': 'Rocket League',
      'modal.game.apex': 'Apex Legends',
      'modal.game.other': 'Other',
      'c.hero.monitor.title': 'Match Monitor',
      'c.hero.monitor.roleFit': 'Role Fit',
      'c.hero.monitor.proofScore': 'Proof Score',
      'c.hero.monitor.trustIndex': 'Trust Index',
      'c.hero.monitor.queueTime': 'Queue Time',
      'modal.submit': 'Join Waitlist',
      'modal.submitted': 'Submitted',
      'modal.success': 'You are on the preview waitlist. No data is sent or stored.',
      'modal.micro': 'This interaction is a frontend preview only.',
      'modal.close': 'Close'
    },
    de: {
      'design.a': 'Design A · Mockup',
      'design.b': 'Design B · Editorial',
      'design.c': 'Design C · Performance',
      'design.d': 'Design D · World-Class',
      'nav.value': 'Wert',
      'nav.flow': 'Ablauf',
      'nav.proof': 'Proof',
      'nav.profile': 'Public Profile',
      'nav.waitlist': 'Warteliste',
      'hero.badge': 'Früher Zugang',
      'hero.title': 'Finde dein nächstes Teammitglied mit Proof statt Bauchgefühl.',
      'hero.lead': 'uSpecMe verbindet ambitionierte Spieler und Teams über Rollen-Fit, Rank-Kontext und verifizierbare Leistungsbelege.',
      'hero.cta.primary': 'Zur Warteliste',
      'hero.cta.secondary': 'Public Profile ansehen',
      'value.heading': 'Warum Teams und Spieler uSpecMe nutzen',
      'value.v1.title': 'Rollen-genaues Matching',
      'value.v1.text': 'Finde passende Leute nach Rolle, Spielstil, Zeitplan und Kommunikationsfit.',
      'value.v2.title': 'Proof vor Tryouts',
      'value.v2.text': 'Vergleiche Rank-Kontext und Highlight-Belege, bevor Scrim-Zeit investiert wird.',
      'value.v3.title': 'Schnellere Teamentscheidungen',
      'value.v3.text': 'Gib Captains ein strukturiertes Profil, das in unter einer Minute bewertbar ist.',
      'flow.heading': 'So funktioniert der Flow',
      'flow.s1.title': 'Profil erstellen',
      'flow.s1.text': 'Game, Rolle, Rank-Bereich, Region und Teamziel festlegen.',
      'flow.s2.title': 'Proof hinzufügen',
      'flow.s2.text': 'Rank-Snapshots, Clips und optionale Verifikation ergänzen.',
      'flow.s3.title': 'Match + Vergleich',
      'flow.s3.text': 'Profile mit Fit-Indikatoren und Proof-Kontext durchsuchen.',
      'flow.s4.title': 'Trial + Commitment',
      'flow.s4.text': 'Kandidaten auf die Shortlist setzen und schneller in echte Tryouts gehen.',
      'proof.heading': 'Proof Layer',
      'proof.lead': 'Ein Profil sollte Skill, Konstanz und Setup-Vertrauen ohne langes Hin und Her beantworten.',
      'proof.stats.title': 'Performance-Signale',
      'proof.stats.b1': 'Aktueller Rank-Trend und Rollenkonstanz',
      'proof.stats.b2': 'Clip-Belege mit kompetitivem Kontext',
      'proof.stats.b3': 'Trust-Marker für klarere Teamentscheidungen',
      'proof.video.title': 'Shinobi Mockup Referenz',
      'proof.video.caption': 'Visuelle Referenz aus den hochgeladenen Mockups.',
      'profile.title': 'Public Profile',
      'profile.role': 'Flex DPS',
      'profile.verified': 'Skill verifiziert',
      'profile.game.ow': 'Overwatch · Shinobi#4728',
      'profile.game.lol': 'League of Legends · Shn0bi',
      'profile.game.fn': 'ShinobiFN',
      'profile.game.rivals': 'Marvel Rivals · ShinobiX',
      'profile.rank.master': 'Master',
      'profile.rank.diamond': 'Diamond',
      'profile.rank.champion': 'Champion',
      'profile.rank.gm': 'Grandmaster',
      'profile.career.title': 'Karriere',
      'profile.career.line': 'FaZe · Aktuelles Mitglied',
      'profile.career.former': 'Team Liquid · Ehemaliges Mitglied',
      'profile.setup.title': 'Pro Setup',
      'profile.setup.s1': 'Logitech G Pro X Superlight 2',
      'profile.setup.s2': 'Artisan Zero XL',
      'profile.setup.s3': 'Wooting 60HE',
      'profile.setup.s4': 'BenQ Zowie 360Hz',
      'profile.setup.s5': 'NVIDIA RTX 4090',
      'profile.metric.dpi': 'DPI 800',
      'profile.metric.sens': 'Sens 4.00',
      'profile.metric.poll': 'Polling 1000 Hz',
      'profile.metric.fov': 'FOV 103',
      'profile.caption': 'Eine Profilkarte sollte für eine sichere Shortlist ausreichen.',
      'wait.heading': 'Zur Warteliste',
      'wait.lead': 'Sichere dir frühen Zugang zu proof-basiertem Teamfinding für kompetitive Online-Games.',
      'wait.panel.title': 'Early Access Invite',
      'wait.panel.text': 'Nenne uns Rolle und Main Game. Das Formular bleibt in dieser Vorschau rein frontendseitig.',
      'wait.panel.cta': 'Warteliste öffnen',
      'footer.note': 'Early-Access-Produkt im aktiven Aufbau.',
      'modal.title': 'Zur Warteliste',
      'modal.lead': 'Dieses Vorschau-Formular ist rein lokal und überträgt keine Daten.',
      'modal.email.label': 'E-Mail',
      'modal.email.placeholder': 'du@beispiel.de',
      'modal.role.label': 'Rolle',
      'modal.role.placeholder': 'Rolle auswählen',
      'modal.role.player': 'Spieler',
      'modal.role.team': 'Team',
      'modal.game.label': 'Hauptspiel',
      'modal.game.placeholder': 'Hauptspiel auswählen',
      'modal.game.cs2': 'Counter-Strike 2',
      'modal.game.valorant': 'Valorant',
      'modal.game.lol': 'League of Legends',
      'modal.game.overwatch': 'Overwatch',
      'modal.game.fortnite': 'Fortnite',
      'modal.game.rivals': 'Marvel Rivals',
      'modal.game.rocket': 'Rocket League',
      'modal.game.apex': 'Apex Legends',
      'modal.game.other': 'Andere',
      'c.hero.monitor.title': 'Match-Monitor',
      'c.hero.monitor.roleFit': 'Rollen-Fit',
      'c.hero.monitor.proofScore': 'Proof-Score',
      'c.hero.monitor.trustIndex': 'Trust-Index',
      'c.hero.monitor.queueTime': 'Wartezeit',
      'modal.submit': 'Zur Warteliste',
      'modal.submitted': 'Gesendet',
      'modal.success': 'Du bist auf der Preview-Warteliste. Es werden keine Daten gesendet oder gespeichert.',
      'modal.micro': 'Diese Interaktion ist nur eine Frontend-Vorschau.',
      'modal.close': 'Schließen'
    }
  };

  let currentLang = 'en';

  function safeGetStoredLang() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED.includes(value) ? value : 'en';
    } catch (_err) {
      return 'en';
    }
  }

  function safeSetStoredLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (_err) {
      // no-op
    }
  }

  function translate(key) {
    return (I18N[currentLang] && I18N[currentLang][key]) || (I18N.en && I18N.en[key]) || key;
  }

  function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      node.textContent = translate(node.dataset.i18n);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
      node.setAttribute('placeholder', translate(node.dataset.i18nPlaceholder));
    });

    const submitButton = document.querySelector('#waitlistForm button[type="submit"]');
    if (submitButton && submitButton.dataset.submitted === 'true') {
      submitButton.textContent = translate('modal.submitted');
    }

    document.documentElement.lang = currentLang;
  }

  function updateLanguageButtons() {
    document.querySelectorAll('[data-lang]').forEach((button) => {
      const selected = button.dataset.lang === currentLang;
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
      button.classList.toggle('active', selected);
    });
  }

  function setLanguage(lang) {
    const normalized = SUPPORTED.includes(lang) ? lang : 'en';
    currentLang = normalized;
    safeSetStoredLang(normalized);
    applyTranslations();
    updateLanguageButtons();
    document.dispatchEvent(new CustomEvent('uspecme:langchange', { detail: { lang: currentLang } }));
  }

  function initLanguageControls() {
    document.querySelectorAll('[data-lang]').forEach((button) => {
      button.addEventListener('click', () => {
        setLanguage(button.dataset.lang);
      });
    });
  }

  function initProfileAvatarFallbacks() {
    document.querySelectorAll('.profile-avatar').forEach((avatar) => {
      const image = avatar.querySelector('.profile-avatar-image');
      if (!image) {
        return;
      }

      image.addEventListener('load', () => {
        avatar.classList.add('has-image');
      });

      image.addEventListener('error', () => {
        image.style.display = 'none';
        avatar.classList.remove('has-image');
      });

      if (image.complete && image.naturalWidth > 0) {
        avatar.classList.add('has-image');
      }
    });
  }

  function openModal() {
    const modal = document.getElementById('waitlistModal');
    const form = document.getElementById('waitlistForm');
    const success = document.getElementById('waitlistSuccess');

    if (!modal) {
      return;
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    if (form) {
      form.reset();
      const submit = form.querySelector('button[type="submit"]');
      if (submit) {
        submit.disabled = false;
        submit.dataset.submitted = 'false';
        submit.textContent = translate('modal.submit');
      }
    }

    if (success) {
      success.classList.add('hidden');
    }
  }

  function closeModal() {
    const modal = document.getElementById('waitlistModal');
    if (!modal) {
      return;
    }

    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function initModal() {
    document.querySelectorAll('[data-open-modal]').forEach((trigger) => {
      trigger.addEventListener('click', openModal);
    });

    document.querySelectorAll('[data-close-modal]').forEach((trigger) => {
      trigger.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    });

    const form = document.getElementById('waitlistForm');
    if (!form) {
      return;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!form.reportValidity()) {
        return;
      }

      const success = document.getElementById('waitlistSuccess');
      const submit = form.querySelector('button[type="submit"]');

      if (success) {
        success.classList.remove('hidden');
      }

      if (submit) {
        submit.disabled = true;
        submit.dataset.submitted = 'true';
        submit.textContent = translate('modal.submitted');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    initLanguageControls();
    initProfileAvatarFallbacks();
    initModal();

    const defaultLang = safeGetStoredLang();
    setLanguage(defaultLang);
  });

  window.uspecmeTranslate = translate;
  window.uspecmeGetLang = () => currentLang;
  window.uspecmeSetLang = setLanguage;
})();
