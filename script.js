(function () {
  const THEME_KEY = 'uspecme_theme';
  const MOTION_KEY = 'uspecme_reduce_motion';

  const PROOF_STATUS = {
    RANK_VERIFIED: 'RANK_VERIFIED',
    ACCOUNT_CONNECTED: 'ACCOUNT_CONNECTED',
    SELF_DECLARED: 'SELF_DECLARED',
    USPECME_TRYOUT_VERIFIED: 'USPECME_TRYOUT_VERIFIED'
  };

  const state = {
    mode: 'players',
    search: '',
    game: 'Any',
    role: 'Any',
    rank: 'Any',
    region: 'Any',
    availability: 'Any',
    proof: 'Any',
    compare: [],
    metrics: {
      connect: 0,
      tryouts: 0,
      waitlist: 0,
      compareAdds: 0
    },
    selectedInviteContext: null,
    authMode: 'register',
    authEmail: ''
  };

  function safeStorageGet(key) {
    try {
      return window.localStorage.getItem(key);
    } catch (_err) {
      return null;
    }
  }

  function safeStorageSet(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (_err) {
      // no-op
    }
  }

  const players = [
    {
      handle: 'ValkyrieEU',
      region: 'EU',
      language: ['DE', 'EN'],
      availability: 'Weeknights',
      lookingFor: ['Team', 'Tryouts'],
      games: [
        { game: 'Overwatch', role: 'Support', rank: 'Master 3', peak: 'GM 5', proof: PROOF_STATUS.ACCOUNT_CONNECTED },
        { game: 'LoL', role: 'Support', rank: 'Diamond II', peak: 'Master', proof: PROOF_STATUS.RANK_VERIFIED }
      ]
    },
    {
      handle: 'ArcScout',
      region: 'EU',
      language: ['EN'],
      availability: 'Weekend',
      lookingFor: ['Scrims', 'Tryouts'],
      games: [
        { game: 'ArcRaiders', role: 'Scout', rank: 'N/A', peak: 'N/A', proof: PROOF_STATUS.SELF_DECLARED },
        { game: 'Fortnite', role: 'IGL', rank: 'Champion', peak: 'Unreal', proof: PROOF_STATUS.ACCOUNT_CONNECTED }
      ]
    },
    {
      handle: 'Shinobi',
      region: 'EU',
      language: ['EN', 'DE'],
      availability: 'Weeknights',
      lookingFor: ['Tryouts', 'Team'],
      games: [
        { game: 'Overwatch', role: 'Flex DPS', rank: 'Master', peak: 'Grandmaster', proof: PROOF_STATUS.ACCOUNT_CONNECTED },
        { game: 'Fortnite', role: 'IGL', rank: 'Champion', peak: 'Unreal', proof: PROOF_STATUS.SELF_DECLARED }
      ]
    }
  ];

  const teams = [
    {
      slug: 'vienna-ascend',
      name: 'Vienna Ascend',
      region: 'EU',
      verified: PROOF_STATUS.ACCOUNT_CONNECTED,
      games: [
        {
          game: 'Overwatch',
          needs: [
            { role: 'Tank', rankMin: 'Master' },
            { role: 'Support', rankMin: 'Diamond' }
          ]
        },
        {
          game: 'LoL',
          needs: [{ role: 'Jungle', rankMin: 'Diamond' }]
        }
      ],
      schedule: 'Mon/Wed/Fri 19:00-22:00 CET'
    },
    {
      slug: 'cloud-quarter',
      name: 'Cloud 25',
      region: 'EU',
      verified: PROOF_STATUS.SELF_DECLARED,
      games: [
        {
          game: 'Fortnite',
          needs: [{ role: 'IGL', rankMin: 'Champion' }]
        },
        {
          game: 'ArcRaiders',
          needs: [{ role: 'Scout', rankMin: 'N/A' }]
        }
      ],
      schedule: 'Tue/Thu 20:00-23:00 CET'
    }
  ];

  const GAME_LOGO = {
    Overwatch: 'assets/logos/misc/overwatch_logo_2026.png',
    LoL: 'assets/logos/misc/LoL.png',
    Fortnite: 'assets/logos/misc/Fortnite.jpeg',
    ArcRaiders: 'assets/logos/misc/rivals.png'
  };

  const I18N_D = {
    en: {
      'd.a11y.skip': 'Skip to content',
      'd.nav.explore': 'Explore',
      'd.nav.matches': 'Matches',
      'd.nav.tryouts': 'Tryouts',
      'd.nav.messages': 'Messages',
      'd.nav.profile': 'Profile',
      'd.auth.open.register': 'Register',
      'd.auth.open.login': 'Login',
      'd.toggle.themeDark': 'Theme: Dark',
      'd.toggle.themeLight': 'Theme: Light',
      'd.toggle.motionOn': 'Motion: On',
      'd.toggle.motionOff': 'Motion: Reduced',
      'd.hero.badge': 'Fake-Door MVP',
      'd.hero.title': 'From solo queue to a real team.',
      'd.hero.lead': 'Find verified players and teams in Overwatch, LoL, Fortnite and Arc Raiders. Compare fast. Tryouts made simple.',
      'd.hero.ctaPlayer': "I'm a Player",
      'd.hero.ctaTeam': "I'm a Team",
      'd.kpi.verified.title': 'Verified Ranks',
      'd.kpi.verified.text': 'Where possible, rank is verified. Otherwise status is clearly labeled.',
      'd.kpi.compare.title': 'Compare in Seconds',
      'd.kpi.compare.text': 'Shortlist two profiles side by side without leaving Explore.',
      'd.kpi.tryout.title': 'Invite to Tryout',
      'd.kpi.tryout.text': 'Trigger clear intent with one modal and capture early-access demand.',
      'd.panel.title': 'Live Intent Monitor',
      'd.panel.connect': 'Connect',
      'd.panel.note': 'No autoplay. Fast scan, high signal density, clear CTA hierarchy.',
      'd.metric.m1': 'Connect Clicks',
      'd.metric.m2': 'Tryout Requests',
      'd.metric.m3': 'Waitlist Submits',
      'd.metric.m4': 'Compare Adds',
      'd.explore.title': 'Explore',
      'd.mode.players': 'Players',
      'd.mode.teams': 'Teams',
      'd.filter.search': 'Search',
      'd.filter.title': 'Filters',
      'd.filter.role': 'Role',
      'd.filter.rank': 'Rank',
      'd.filter.region': 'Region',
      'd.filter.availability': 'Availability',
      'd.filter.proof': 'Proof',
      'd.filter.any': 'Any',
      'd.game.overwatch': 'Overwatch',
      'd.game.lol': 'LoL',
      'd.game.fortnite': 'Fortnite',
      'd.game.arcraiders': 'Arc Raiders',
      'd.role.tank': 'Tank',
      'd.role.support': 'Support',
      'd.role.dps': 'DPS',
      'd.role.flexDps': 'Flex DPS',
      'd.role.jungle': 'Jungle',
      'd.role.igl': 'IGL',
      'd.role.scout': 'Scout',
      'd.rank.diamondPlus': 'Diamond+',
      'd.rank.masterPlus': 'Master+',
      'd.rank.championUnreal': 'Champion/Unreal',
      'd.availability.weeknights': 'Weeknights',
      'd.availability.weekend': 'Weekend',
      'd.schedule.monWedFri': 'Mon/Wed/Fri',
      'd.schedule.tueThu': 'Tue/Thu',
      'd.proof.rankVerified': 'Rank Verified',
      'd.proof.accountConnected': 'Account Connected',
      'd.proof.selfDeclared': 'Self Declared',
      'd.compare.title': 'Compare (max 2)',
      'd.compare.clear': 'Clear',
      'd.compare.empty': 'Select up to 2 players to compare role, rank, proof and availability.',
      'd.compare.invite': 'Invite selected',
      'd.empty': 'No results for current filters.',
      'd.legal.privacy': 'Privacy',
      'd.legal.terms': 'Terms',
      'd.toast.comingSoon': 'Coming soon.',
      'd.toast.tryoutsSoon': 'Tryouts are coming soon.',
      'd.toast.messagesSoon': 'Messages are coming soon.',
      'd.toast.maxCompare': 'You can compare at most 2 players.',
      'd.invite.title': 'Invite to Tryout',
      'd.invite.game': 'Game',
      'd.invite.role': 'Role needed / offered',
      'd.invite.slot': 'Suggested slot',
      'd.invite.notes': 'Notes',
      'd.invite.submit': 'Send tryout request',
      'd.invite.success': 'Intent captured. Join early access to activate real invites.',
      'd.connect.title': 'Connect account',
      'd.connect.lead': 'Choose a provider to confirm ownership and improve trust signals.',
      'd.connect.success': 'Connection intent captured. Full verification goes live in early access.',
      'd.auth.title.register': 'Create your account',
      'd.auth.title.login': 'Log in to your account',
      'd.auth.lead': 'Start with Register or Login, then continue to the waitlist.',
      'd.auth.tab.register': 'Register',
      'd.auth.tab.login': 'Login',
      'd.auth.field.email': 'Email',
      'd.auth.field.password': 'Password',
      'd.auth.placeholder.email': 'you@example.com',
      'd.auth.placeholder.password': 'At least 6 characters',
      'd.auth.submit.register': 'Register and continue',
      'd.auth.submit.login': 'Login and continue',
      'd.auth.success': 'Preview auth completed.',
      'd.auth.continueWaitlist': 'Continuing to waitlist...',
      'd.modal.close': 'Close',
      'd.card.region': 'Region',
      'd.card.availability': 'Availability',
      'd.card.invite': 'Invite',
      'd.card.compare': 'Compare',
      'd.card.remove': 'Remove',
      'd.card.open': 'Open profile',
      'd.card.apply': 'Apply / Request tryout',
      'd.compare.row.role': 'Role',
      'd.compare.row.rank': 'Rank',
      'd.compare.row.proof': 'Proof',
      'd.compare.row.availability': 'Availability',
      'd.compare.row.languages': 'Languages',
      'd.compare.header.field': 'Field',
      'd.search.placeholder.players': 'Search handle',
      'd.search.placeholder.teams': 'Search team name',
      'd.card.peak': 'Peak',
      'd.invite.slot.tue': 'Tue 20:00',
      'd.invite.slot.thu': 'Thu 19:30',
      'd.invite.slot.sun': 'Sun 18:00',
      'd.proof.tooltip.rank': 'Rank verified from supported source/API.',
      'd.proof.tooltip.connected': 'Account ownership connected, rank may be self-declared.',
      'd.proof.tooltip.self': 'Self-declared data, no verification yet.'
    },
    de: {
      'd.a11y.skip': 'Zum Inhalt springen',
      'd.nav.explore': 'Explore',
      'd.nav.matches': 'Matches',
      'd.nav.tryouts': 'Tryouts',
      'd.nav.messages': 'Nachrichten',
      'd.nav.profile': 'Profil',
      'd.auth.open.register': 'Registrieren',
      'd.auth.open.login': 'Login',
      'd.toggle.themeDark': 'Theme: Dunkel',
      'd.toggle.themeLight': 'Theme: Hell',
      'd.toggle.motionOn': 'Motion: An',
      'd.toggle.motionOff': 'Motion: Reduziert',
      'd.hero.badge': 'Fake-Door MVP',
      'd.hero.title': 'Von Solo-Queue zu einem echten Team.',
      'd.hero.lead': 'Finde verifizierte Spieler und Teams in Overwatch, LoL, Fortnite und Arc Raiders. Schnell vergleichen. Tryouts einfach machen.',
      'd.hero.ctaPlayer': 'Ich bin Spieler',
      'd.hero.ctaTeam': 'Ich bin Team',
      'd.kpi.verified.title': 'Verifizierte Ranks',
      'd.kpi.verified.text': 'Wo möglich wird Rank verifiziert, sonst klar gekennzeichnet.',
      'd.kpi.compare.title': 'In Sekunden vergleichen',
      'd.kpi.compare.text': 'Vergleiche zwei Profile direkt in Explore.',
      'd.kpi.tryout.title': 'Zum Tryout einladen',
      'd.kpi.tryout.text': 'Messe klare Intent-Signale über einen fokussierten Modal-Flow.',
      'd.panel.title': 'Live Intent Monitor',
      'd.panel.connect': 'Verbinden',
      'd.panel.note': 'Kein Autoplay. Schnelles Scannen, hohe Signaldichte, klare CTA-Hierarchie.',
      'd.metric.m1': 'Connect Klicks',
      'd.metric.m2': 'Tryout Anfragen',
      'd.metric.m3': 'Waitlist Submits',
      'd.metric.m4': 'Compare Adds',
      'd.explore.title': 'Explore',
      'd.mode.players': 'Spieler',
      'd.mode.teams': 'Teams',
      'd.filter.search': 'Suche',
      'd.filter.title': 'Filter',
      'd.filter.role': 'Rolle',
      'd.filter.rank': 'Rank',
      'd.filter.region': 'Region',
      'd.filter.availability': 'Verfügbarkeit',
      'd.filter.proof': 'Proof',
      'd.filter.any': 'Alle',
      'd.game.overwatch': 'Overwatch',
      'd.game.lol': 'LoL',
      'd.game.fortnite': 'Fortnite',
      'd.game.arcraiders': 'Arc Raiders',
      'd.role.tank': 'Tank',
      'd.role.support': 'Support',
      'd.role.dps': 'DPS',
      'd.role.flexDps': 'Flex DPS',
      'd.role.jungle': 'Jungle',
      'd.role.igl': 'IGL',
      'd.role.scout': 'Scout',
      'd.rank.diamondPlus': 'Diamond+',
      'd.rank.masterPlus': 'Master+',
      'd.rank.championUnreal': 'Champion/Unreal',
      'd.availability.weeknights': 'Abends unter der Woche',
      'd.availability.weekend': 'Wochenende',
      'd.schedule.monWedFri': 'Mo/Mi/Fr',
      'd.schedule.tueThu': 'Di/Do',
      'd.proof.rankVerified': 'Rank verifiziert',
      'd.proof.accountConnected': 'Account verbunden',
      'd.proof.selfDeclared': 'Selbst angegeben',
      'd.compare.title': 'Vergleich (max 2)',
      'd.compare.clear': 'Leeren',
      'd.compare.empty': 'Wähle bis zu 2 Spieler für Rollen-, Rank- und Proof-Vergleich.',
      'd.compare.invite': 'Ausgewählte einladen',
      'd.empty': 'Keine Ergebnisse für diese Filter.',
      'd.legal.privacy': 'Datenschutz',
      'd.legal.terms': 'AGB',
      'd.toast.comingSoon': 'Bald verfügbar.',
      'd.toast.tryoutsSoon': 'Tryouts kommen bald.',
      'd.toast.messagesSoon': 'Nachrichten kommen bald.',
      'd.toast.maxCompare': 'Du kannst maximal 2 Spieler vergleichen.',
      'd.invite.title': 'Zum Tryout einladen',
      'd.invite.game': 'Spiel',
      'd.invite.role': 'Gesuchte / angebotene Rolle',
      'd.invite.slot': 'Vorgeschlagener Slot',
      'd.invite.notes': 'Notizen',
      'd.invite.submit': 'Tryout-Anfrage senden',
      'd.invite.success': 'Intent erfasst. Für echte Einladungen der Early-Access-Warteliste beitreten.',
      'd.connect.title': 'Account verbinden',
      'd.connect.lead': 'Wähle einen Provider, um Ownership zu bestätigen und Trust-Signale zu verbessern.',
      'd.connect.success': 'Connection-Intent erfasst. Vollständige Verifikation folgt im Early Access.',
      'd.auth.title.register': 'Konto erstellen',
      'd.auth.title.login': 'In dein Konto einloggen',
      'd.auth.lead': 'Starte mit Registrierung oder Login und fahre dann mit der Warteliste fort.',
      'd.auth.tab.register': 'Registrieren',
      'd.auth.tab.login': 'Login',
      'd.auth.field.email': 'E-Mail',
      'd.auth.field.password': 'Passwort',
      'd.auth.placeholder.email': 'du@beispiel.de',
      'd.auth.placeholder.password': 'Mindestens 6 Zeichen',
      'd.auth.submit.register': 'Registrieren und fortfahren',
      'd.auth.submit.login': 'Einloggen und fortfahren',
      'd.auth.success': 'Preview-Auth abgeschlossen.',
      'd.auth.continueWaitlist': 'Weiter zur Warteliste...',
      'd.modal.close': 'Schließen',
      'd.card.region': 'Region',
      'd.card.availability': 'Verfügbarkeit',
      'd.card.invite': 'Einladen',
      'd.card.compare': 'Vergleichen',
      'd.card.remove': 'Entfernen',
      'd.card.open': 'Profil öffnen',
      'd.card.apply': 'Bewerben / Tryout anfragen',
      'd.compare.row.role': 'Rolle',
      'd.compare.row.rank': 'Rank',
      'd.compare.row.proof': 'Proof',
      'd.compare.row.availability': 'Verfügbarkeit',
      'd.compare.row.languages': 'Sprachen',
      'd.compare.header.field': 'Feld',
      'd.search.placeholder.players': 'Handle suchen',
      'd.search.placeholder.teams': 'Teamnamen suchen',
      'd.card.peak': 'Peak',
      'd.invite.slot.tue': 'Di 20:00',
      'd.invite.slot.thu': 'Do 19:30',
      'd.invite.slot.sun': 'So 18:00',
      'd.proof.tooltip.rank': 'Rank aus unterstützter Quelle/API verifiziert.',
      'd.proof.tooltip.connected': 'Account verbunden, Rank kann selbst angegeben sein.',
      'd.proof.tooltip.self': 'Selbst angegebene Daten, noch nicht verifiziert.'
    }
  };

  function getLang() {
    if (typeof window.uspecmeGetLang === 'function') {
      return window.uspecmeGetLang();
    }
    return 'en';
  }

  function t(key) {
    const lang = getLang();
    return (I18N_D[lang] && I18N_D[lang][key]) || (I18N_D.en && I18N_D.en[key]) || key;
  }

  function track(event, payload) {
    if (typeof window.uspecTrack === 'function') {
      window.uspecTrack(event, payload || {});
    }
  }

  function applyCustomI18n() {
    document.querySelectorAll('[data-d18n]').forEach((node) => {
      node.textContent = t(node.dataset.d18n);
    });

    document.querySelectorAll('[data-d18n-placeholder]').forEach((node) => {
      node.setAttribute('placeholder', t(node.dataset.d18nPlaceholder));
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.placeholder = state.mode === 'players' ? t('d.search.placeholder.players') : t('d.search.placeholder.teams');
    }

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      const dark = document.documentElement.classList.contains('dark');
      themeToggle.textContent = dark ? t('d.toggle.themeDark') : t('d.toggle.themeLight');
      themeToggle.setAttribute('aria-pressed', String(dark));
    }

    const motionToggle = document.getElementById('motionToggle');
    if (motionToggle) {
      const reduced = document.documentElement.classList.contains('reduce-motion');
      motionToggle.textContent = reduced ? t('d.toggle.motionOff') : t('d.toggle.motionOn');
      motionToggle.setAttribute('aria-pressed', String(reduced));
    }
  }

  function showToast(messageKeyOrText) {
    const node = document.getElementById('uiNotice');
    if (!node) {
      return;
    }

    const text = messageKeyOrText && messageKeyOrText.startsWith && messageKeyOrText.startsWith('d.') ? t(messageKeyOrText) : messageKeyOrText;
    node.textContent = text || '';
    node.classList.remove('hidden');

    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => {
      node.classList.add('hidden');
    }, 1800);
  }

  function mapProof(proofStatus) {
    if (proofStatus === PROOF_STATUS.RANK_VERIFIED) {
      return { cls: 'rank', label: t('d.proof.rankVerified'), tooltip: t('d.proof.tooltip.rank') };
    }
    if (proofStatus === PROOF_STATUS.ACCOUNT_CONNECTED) {
      return { cls: 'connected', label: t('d.proof.accountConnected'), tooltip: t('d.proof.tooltip.connected') };
    }
    return { cls: 'self', label: t('d.proof.selfDeclared'), tooltip: t('d.proof.tooltip.self') };
  }

  function formatAvailability(availability) {
    if (availability === 'Weeknights') {
      return t('d.availability.weeknights');
    }
    if (availability === 'Weekend') {
      return t('d.availability.weekend');
    }
    return availability;
  }

  function formatRole(role) {
    if (role === 'Flex DPS') {
      return t('d.role.flexDps');
    }
    if (role === 'Tank') {
      return t('d.role.tank');
    }
    if (role === 'Support') {
      return t('d.role.support');
    }
    if (role === 'DPS') {
      return t('d.role.dps');
    }
    if (role === 'Jungle') {
      return t('d.role.jungle');
    }
    if (role === 'IGL') {
      return t('d.role.igl');
    }
    if (role === 'Scout') {
      return t('d.role.scout');
    }
    return role;
  }

  function formatSchedule(schedule) {
    return schedule
      .replace('Mon/Wed/Fri', t('d.schedule.monWedFri'))
      .replace('Tue/Thu', t('d.schedule.tueThu'));
  }

  function getPrimaryGame(player) {
    const game = state.game;
    if (game !== 'Any') {
      const match = player.games.find((entry) => entry.game === game);
      if (match) {
        return match;
      }
    }
    return player.games[0];
  }

  function passesPlayerFilters(player) {
    if (state.search && !player.handle.toLowerCase().includes(state.search.toLowerCase())) {
      return false;
    }

    if (state.region !== 'Any' && player.region !== state.region) {
      return false;
    }

    if (state.availability !== 'Any' && player.availability !== state.availability) {
      return false;
    }

    const games = player.games.filter((entry) => state.game === 'Any' || entry.game === state.game);
    if (!games.length) {
      return false;
    }

    const roleMatch = state.role === 'Any' || games.some((entry) => (entry.role || '').includes(state.role));
    if (!roleMatch) {
      return false;
    }

    const proofMatch = state.proof === 'Any' || games.some((entry) => entry.proof === state.proof);
    if (!proofMatch) {
      return false;
    }

    if (state.rank !== 'Any') {
      const rankMatch = games.some((entry) => {
        const rank = (entry.rank || '').toLowerCase();
        if (state.rank === 'Diamond') {
          return rank.includes('diamond') || rank.includes('master') || rank.includes('grandmaster') || rank.includes('champion') || rank.includes('unreal');
        }
        if (state.rank === 'Master') {
          return rank.includes('master') || rank.includes('grandmaster') || rank.includes('champion') || rank.includes('unreal');
        }
        if (state.rank === 'Champion') {
          return rank.includes('champion') || rank.includes('unreal');
        }
        return true;
      });
      if (!rankMatch) {
        return false;
      }
    }

    return true;
  }

  function passesTeamFilters(team) {
    if (state.search && !team.name.toLowerCase().includes(state.search.toLowerCase())) {
      return false;
    }

    if (state.region !== 'Any' && team.region !== state.region) {
      return false;
    }

    if (state.game !== 'Any' && !team.games.some((entry) => entry.game === state.game)) {
      return false;
    }

    if (state.proof !== 'Any' && team.verified !== state.proof) {
      return false;
    }

    if (state.role !== 'Any') {
      const roleMatch = team.games.some((entry) => entry.needs.some((need) => need.role === state.role));
      if (!roleMatch) {
        return false;
      }
    }

    return true;
  }

  function renderPlayerCard(player) {
    const game = getPrimaryGame(player);
    const proof = mapProof(game.proof);
    const inCompare = state.compare.includes(player.handle);

    return [
      '<article class="result-card">',
      '<div class="result-top">',
      `<h3 class="result-handle">${player.handle}</h3>`,
      `<span class="primary-chip">${game.game}</span>`,
      '</div>',
      '<div class="result-main">',
      `<strong>${formatRole(game.role) || '-'}</strong>`,
      `<span>${game.rank || '-'} · ${t('d.card.peak')} ${game.peak || '-'}</span>`,
      '</div>',
      `<span class="proof-badge ${proof.cls}" title="${proof.tooltip}">${proof.label}</span>`,
      '<div class="result-meta">',
      `<span>${t('d.card.region')}: ${player.region}</span>`,
      `<span>${t('d.card.availability')}: ${formatAvailability(player.availability)}</span>`,
      `<span>${player.language.join(', ')}</span>`,
      '</div>',
      '<div class="result-actions">',
      `<button type="button" class="button primary small" data-action="invite-player" data-handle="${player.handle}" data-game="${game.game}">${t('d.card.invite')}</button>`,
      `<button type="button" class="button ghost small" data-action="compare-player" data-handle="${player.handle}">${inCompare ? t('d.card.remove') : t('d.card.compare')}</button>`,
      `<button type="button" class="button ghost small" data-action="open-player" data-handle="${player.handle}">${t('d.card.open')}</button>`,
      '</div>',
      '</article>'
    ].join('');
  }

  function renderTeamCard(team) {
    const proof = mapProof(team.verified);
    const needs = team.games
      .filter((entry) => state.game === 'Any' || entry.game === state.game)
      .flatMap((entry) => entry.needs.map((need) => `${entry.game}: ${formatRole(need.role)} (${need.rankMin}+)`));

    return [
      '<article class="result-card">',
      '<div class="result-top">',
      `<h3 class="result-handle">${team.name}</h3>`,
      `<span class="primary-chip">${team.region}</span>`,
      '</div>',
      `<span class="proof-badge ${proof.cls}" title="${proof.tooltip}">${proof.label}</span>`,
      '<div class="team-needs">',
      needs.map((need) => `<span class="need-chip">${need}</span>`).join(''),
      '</div>',
      `<div class="result-meta"><span>${t('d.card.availability')}: ${formatSchedule(team.schedule)}</span></div>`,
      '<div class="result-actions">',
      `<button type="button" class="button primary small" data-action="invite-team" data-team="${team.slug}" data-game="${team.games[0].game}">${t('d.card.apply')}</button>`,
      '</div>',
      '</article>'
    ].join('');
  }

  function renderResults() {
    const list = document.getElementById('resultList');
    const empty = document.getElementById('emptyState');
    if (!list || !empty) {
      return;
    }

    if (state.mode === 'players') {
      const filteredPlayers = players.filter(passesPlayerFilters);
      list.innerHTML = filteredPlayers.map(renderPlayerCard).join('');
      empty.classList.toggle('hidden', filteredPlayers.length > 0);
    } else {
      const filteredTeams = teams.filter(passesTeamFilters);
      list.innerHTML = filteredTeams.map(renderTeamCard).join('');
      empty.classList.toggle('hidden', filteredTeams.length > 0);
    }

    bindCardActions();
  }

  function renderCompareDrawer() {
    const compareEmpty = document.getElementById('compareEmpty');
    const compareContent = document.getElementById('compareContent');
    const inviteSelected = document.getElementById('inviteSelected');

    if (!compareEmpty || !compareContent || !inviteSelected) {
      return;
    }

    const selected = players.filter((player) => state.compare.includes(player.handle));

    if (!selected.length) {
      compareEmpty.classList.remove('hidden');
      compareContent.classList.add('hidden');
      compareContent.innerHTML = '';
      inviteSelected.disabled = true;
      return;
    }

    const rows = [
      { key: t('d.compare.row.role'), value: (p) => formatRole(getPrimaryGame(p).role) || '-' },
      { key: t('d.compare.row.rank'), value: (p) => getPrimaryGame(p).rank || '-' },
      { key: t('d.compare.row.proof'), value: (p) => mapProof(getPrimaryGame(p).proof).label },
      { key: t('d.compare.row.availability'), value: (p) => formatAvailability(p.availability) },
      { key: t('d.compare.row.languages'), value: (p) => p.language.join(', ') }
    ];

    compareContent.innerHTML = [
      '<table class="compare-table">',
      `<thead><tr><th>${t('d.compare.header.field')}</th>`,
      selected.map((p) => `<th>${p.handle}</th>`).join(''),
      '</tr></thead><tbody>',
      rows
        .map((row) => `<tr><td>${row.key}</td>${selected.map((p) => `<td>${row.value(p)}</td>`).join('')}</tr>`)
        .join(''),
      '</tbody></table>'
    ].join('');

    compareEmpty.classList.add('hidden');
    compareContent.classList.remove('hidden');
    inviteSelected.disabled = false;
  }

  function applyFiltersTracking() {
    track('apply_filter', {
      game: state.game,
      role: state.role,
      rankRange: state.rank,
      proof: state.proof
    });
  }

  function setMode(mode) {
    state.mode = mode;

    document.getElementById('modePlayers').classList.toggle('active', mode === 'players');
    document.getElementById('modeTeams').classList.toggle('active', mode === 'teams');
    document.getElementById('modePlayers').setAttribute('aria-selected', String(mode === 'players'));
    document.getElementById('modeTeams').setAttribute('aria-selected', String(mode === 'teams'));

    if (mode === 'players') {
      track('view_explore_players', {});
    }

    applyCustomI18n();
    renderResults();
    renderCompareDrawer();
  }

  function syncMetrics() {
    const connect = document.getElementById('metricConnect');
    const tryouts = document.getElementById('metricTryouts');
    const waitlist = document.getElementById('metricWaitlist');
    const compare = document.getElementById('metricCompare');

    if (connect) connect.textContent = String(state.metrics.connect);
    if (tryouts) tryouts.textContent = String(state.metrics.tryouts);
    if (waitlist) waitlist.textContent = String(state.metrics.waitlist);
    if (compare) compare.textContent = String(state.metrics.compareAdds);
  }

  function openInviteModal(context) {
    const modal = document.getElementById('inviteModal');
    if (!modal) {
      return;
    }

    state.selectedInviteContext = context;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    const gameSelect = document.getElementById('inviteGame');
    const roleInput = document.getElementById('inviteRole');
    const success = document.getElementById('inviteSuccess');

    if (gameSelect && context && context.game) {
      gameSelect.value = context.game;
    }
    if (roleInput) {
      roleInput.value = context && context.role ? context.role : '';
    }
    if (success) {
      success.classList.add('hidden');
    }
  }

  function closeInviteModal() {
    const modal = document.getElementById('inviteModal');
    if (!modal) {
      return;
    }
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function openConnectModal() {
    const modal = document.getElementById('connectModal');
    if (!modal) {
      return;
    }
    track('open_connect_modal', {});
    state.metrics.connect += 1;
    syncMetrics();

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    const success = document.getElementById('connectSuccess');
    if (success) {
      success.classList.add('hidden');
    }
  }

  function closeConnectModal() {
    const modal = document.getElementById('connectModal');
    if (!modal) {
      return;
    }
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function setAuthTitle(mode) {
    const title = document.getElementById('authTitle');
    if (!title) {
      return;
    }
    const key = mode === 'login' ? 'd.auth.title.login' : 'd.auth.title.register';
    title.dataset.d18n = key;
    title.textContent = t(key);
  }

  function setAuthMode(mode, options) {
    const opts = options || {};
    const normalized = mode === 'login' ? 'login' : 'register';
    const changed = state.authMode !== normalized;
    state.authMode = normalized;

    const registerTab = document.querySelector('#authTabs [data-auth-tab="register"]');
    const loginTab = document.querySelector('#authTabs [data-auth-tab="login"]');
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    if (registerTab) {
      registerTab.classList.toggle('active', normalized === 'register');
      registerTab.setAttribute('aria-selected', String(normalized === 'register'));
    }
    if (loginTab) {
      loginTab.classList.toggle('active', normalized === 'login');
      loginTab.setAttribute('aria-selected', String(normalized === 'login'));
    }
    if (registerForm) {
      registerForm.classList.toggle('hidden', normalized !== 'register');
    }
    if (loginForm) {
      loginForm.classList.toggle('hidden', normalized !== 'login');
    }

    setAuthTitle(normalized);

    if (!opts.keepSuccess) {
      const success = document.getElementById('authSuccess');
      if (success) {
        success.classList.add('hidden');
      }
    }

    if (changed && opts.track !== false) {
      track('switch_auth_mode', { mode: normalized });
    }
  }

  function openWaitlistAfterAuth(email) {
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
      const emailField = form.querySelector('input[name="email"]');
      if (emailField && email) {
        emailField.value = email;
      }
      const submit = form.querySelector('button[type="submit"]');
      if (submit) {
        submit.disabled = false;
        submit.dataset.submitted = 'false';
        if (typeof window.uspecmeTranslate === 'function') {
          submit.textContent = window.uspecmeTranslate('modal.submit');
        }
      }
    }

    if (success) {
      success.classList.add('hidden');
    }
  }

  function openAuthModal(mode) {
    const modal = document.getElementById('authModal');
    if (!modal) {
      return;
    }

    track('open_auth_modal', { mode: mode === 'login' ? 'login' : 'register' });
    setAuthMode(mode, { track: false, keepSuccess: false });

    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    if (registerForm) {
      registerForm.reset();
    }
    if (loginForm) {
      loginForm.reset();
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (!modal) {
      return;
    }
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function bindCardActions() {
    document.querySelectorAll('[data-action="invite-player"]').forEach((button) => {
      button.addEventListener('click', () => {
        const handle = button.dataset.handle;
        const game = button.dataset.game;
        track('click_invite_tryout', { handle, game });
        state.metrics.tryouts += 1;
        syncMetrics();
        openInviteModal({ type: 'player', handle, game });
      });
    });

    document.querySelectorAll('[data-action="invite-team"]').forEach((button) => {
      button.addEventListener('click', () => {
        const team = button.dataset.team;
        const game = button.dataset.game;
        track('click_invite_tryout', { team, game });
        state.metrics.tryouts += 1;
        syncMetrics();
        openInviteModal({ type: 'team', team, game });
      });
    });

    document.querySelectorAll('[data-action="open-player"]').forEach((button) => {
      button.addEventListener('click', () => {
        const handle = button.dataset.handle;
        track('view_player_profile', { handle });
        showToast(`${handle}`);
      });
    });

    document.querySelectorAll('[data-action="compare-player"]').forEach((button) => {
      button.addEventListener('click', () => {
        const handle = button.dataset.handle;
        const index = state.compare.indexOf(handle);

        if (index >= 0) {
          state.compare.splice(index, 1);
          track('toggle_compare', { action: 'remove', handle });
        } else {
          if (state.compare.length >= 2) {
            showToast('d.toast.maxCompare');
            return;
          }
          state.compare.push(handle);
          state.metrics.compareAdds += 1;
          syncMetrics();
          track('toggle_compare', { action: 'add', handle });
        }

        renderResults();
        renderCompareDrawer();
      });
    });
  }

  function initExplore() {
    const searchInput = document.getElementById('searchInput');
    const roleFilter = document.getElementById('roleFilter');
    const rankFilter = document.getElementById('rankFilter');
    const regionFilter = document.getElementById('regionFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');
    const proofFilter = document.getElementById('proofFilter');

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        state.search = searchInput.value.trim();
        renderResults();
      });
    }

    [
      [roleFilter, 'role'],
      [rankFilter, 'rank'],
      [regionFilter, 'region'],
      [availabilityFilter, 'availability'],
      [proofFilter, 'proof']
    ].forEach(([node, key]) => {
      if (!node) return;
      node.addEventListener('change', () => {
        state[key] = node.value;
        applyFiltersTracking();
        renderResults();
      });
    });

    document.querySelectorAll('#gameChips .chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#gameChips .chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        state.game = chip.dataset.game || 'Any';
        applyFiltersTracking();
        renderResults();
      });
    });

    document.getElementById('modePlayers').addEventListener('click', () => setMode('players'));
    document.getElementById('modeTeams').addEventListener('click', () => setMode('teams'));

    document.getElementById('clearCompare').addEventListener('click', () => {
      state.compare = [];
      renderResults();
      renderCompareDrawer();
    });

    document.getElementById('inviteSelected').addEventListener('click', () => {
      if (!state.compare.length) {
        return;
      }
      track('click_invite_tryout', { handle: state.compare.join(','), game: state.game === 'Any' ? 'mixed' : state.game });
      state.metrics.tryouts += 1;
      syncMetrics();
      openInviteModal({ type: 'multi', game: state.game === 'Any' ? 'Overwatch' : state.game });
    });

    renderResults();
    renderCompareDrawer();
  }

  function initInviteModal() {
    document.querySelectorAll('[data-close-invite]').forEach((button) => {
      button.addEventListener('click', closeInviteModal);
    });

    const form = document.getElementById('inviteForm');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) {
        return;
      }

      const game = form.querySelector('#inviteGame').value;
      const role = form.querySelector('#inviteRole').value;
      track('submit_invite_request', { game, role, region: state.region });

      const success = document.getElementById('inviteSuccess');
      if (success) {
        success.classList.remove('hidden');
      }

      showToast('d.invite.success');
    });
  }

  function initConnectModal() {
    document.querySelectorAll('[data-close-connect]').forEach((button) => {
      button.addEventListener('click', closeConnectModal);
    });

    document.getElementById('openConnectFromHero').addEventListener('click', openConnectModal);

    document.querySelectorAll('#connectModal [data-provider]').forEach((button) => {
      button.addEventListener('click', () => {
        const provider = button.dataset.provider;
        track('click_connect_provider', { provider });
        track('complete_connect_fake', { provider });

        const success = document.getElementById('connectSuccess');
        if (success) {
          success.classList.remove('hidden');
        }
      });
    });
  }

  function initAuthModal() {
    document.querySelectorAll('[data-open-auth]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        const mode = trigger.dataset.authMode || 'register';
        openAuthModal(mode);
      });
    });

    document.querySelectorAll('[data-close-auth]').forEach((trigger) => {
      trigger.addEventListener('click', closeAuthModal);
    });

    document.querySelectorAll('#authTabs [data-auth-tab]').forEach((tab) => {
      tab.addEventListener('click', () => {
        const mode = tab.dataset.authTab || 'register';
        setAuthMode(mode, { track: true, keepSuccess: false });
      });
    });

    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    function handleAuthSubmit(form, mode) {
      if (!form) {
        return;
      }
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!form.reportValidity()) {
          return;
        }

        const emailField = form.querySelector('input[name="email"]');
        const email = emailField ? emailField.value.trim() : '';
        state.authEmail = email;

        track(mode === 'login' ? 'submit_login_fake' : 'submit_register_fake', {});

        const success = document.getElementById('authSuccess');
        if (success) {
          success.classList.remove('hidden');
        }

        window.setTimeout(() => {
          track('continue_to_waitlist_after_auth', { mode });
          closeAuthModal();
          openWaitlistAfterAuth(state.authEmail);
        }, 260);
      });
    }

    handleAuthSubmit(registerForm, 'register');
    handleAuthSubmit(loginForm, 'login');
  }

  function initTheme() {
    const root = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const motionToggle = document.getElementById('motionToggle');

    const storedTheme = safeStorageGet(THEME_KEY);
    if (storedTheme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }

    const reducedMotion = safeStorageGet(MOTION_KEY) === '1';
    root.classList.toggle('reduce-motion', reducedMotion);

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const dark = root.classList.toggle('dark');
        safeStorageSet(THEME_KEY, dark ? 'dark' : 'light');
        applyCustomI18n();
      });
    }

    if (motionToggle) {
      motionToggle.addEventListener('click', () => {
        const reduced = root.classList.toggle('reduce-motion');
        safeStorageSet(MOTION_KEY, reduced ? '1' : '0');
        applyCustomI18n();
      });
    }
  }

  function initHeroCTAs() {
    const player = document.getElementById('ctaPlayer');
    const team = document.getElementById('ctaTeam');

    player.addEventListener('click', () => {
      track('click_cta_player', {});
      document.getElementById('modePlayers').click();
      document.getElementById('explore').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    team.addEventListener('click', () => {
      track('click_cta_team', {});
      document.getElementById('modeTeams').click();
      document.getElementById('explore').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  function initWaitlistTracking() {
    const form = document.getElementById('waitlistForm');
    if (!form) {
      return;
    }

    form.addEventListener('submit', () => {
      if (!form.reportValidity()) {
        return;
      }
      const role = form.querySelector('select[name="role"]').value;
      const game = form.querySelector('select[name="game"]').value;
      track('submit_waitlist', { persona: role, games: game, region: state.region === 'Any' ? 'unknown' : state.region });
      state.metrics.waitlist += 1;
      syncMetrics();
    });
  }

  function initGlobalToasts() {
    document.querySelectorAll('[data-toast]').forEach((button) => {
      button.addEventListener('click', () => {
        showToast(button.dataset.toast);
      });
    });
  }

  function bindGlobalEsc() {
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') {
        return;
      }
      closeInviteModal();
      closeConnectModal();
      closeAuthModal();
    });
  }

  function onLanguageChange() {
    applyCustomI18n();
    setAuthTitle(state.authMode);
    renderResults();
    renderCompareDrawer();
  }

  document.addEventListener('uspecme:langchange', onLanguageChange);

  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initHeroCTAs();
    initExplore();
    initInviteModal();
    initConnectModal();
    initAuthModal();
    initWaitlistTracking();
    initGlobalToasts();
    bindGlobalEsc();

    applyCustomI18n();
    syncMetrics();

    track('view_landing', {});
    track('view_explore_players', {});
  });
})();
