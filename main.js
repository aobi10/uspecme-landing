(function () {
  const THEME_KEY = 'uspecme_theme';
  const MOTION_KEY = 'uspecme_reduce_motion';
  const METRICS_STORAGE_KEY = 'uspecme_intent_metrics_v1';
  const AUTH_SESSION_KEY = 'uspecme_auth_session_v1';
  const AUTH_USERS_KEY = 'uspecme_auth_users_v1';
  const PROFILE_STORAGE_KEY = 'uspecme_profile_v1';
  const PROFILE_VERSION = 1;

  const DEFAULT_AUTH_USER = {
    username: 'aobi10',
    email: 'aobi10@gamein.local',
    password: 'Meister1337',
    handle: 'Shinobi',
    status: 'online'
  };

  const PROOF_STATUS = {
    RANK_VERIFIED: 'RANK_VERIFIED',
    ACCOUNT_CONNECTED: 'ACCOUNT_CONNECTED',
    SELF_DECLARED: 'SELF_DECLARED',
    USPECME_TRYOUT_VERIFIED: 'USPECME_TRYOUT_VERIFIED'
  };

  const PROFILE_RANKS = {
    overwatch: {
      tiers: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master', 'Grandmaster', 'Champion'],
      divisions: ['5', '4', '3', '2', '1'],
      allowsDivision: () => true
    },
    lol: {
      tiers: ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Emerald', 'Diamond', 'Master', 'Grandmaster', 'Challenger'],
      divisions: ['IV', 'III', 'II', 'I'],
      allowsDivision: (tier) => ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'].includes(tier)
    },
    fortnite: {
      tiers: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Elite', 'Champion', 'Unreal'],
      divisions: ['I', 'II', 'III'],
      allowsDivision: (tier) => tier !== 'Unreal'
    },
    rivals: {
      tiers: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Grandmaster', 'Celestial', 'Eternity', 'One Above All'],
      divisions: [],
      allowsDivision: () => false
    }
  };

  const PROFILE_COUNTRY_CODES = [
    'DE', 'AT', 'CH', 'US', 'CA', 'GB', 'FR', 'ES', 'IT', 'NL', 'BE', 'PL', 'CZ', 'RO', 'TR',
    'UA', 'SE', 'NO', 'DK', 'FI', 'PT', 'BR', 'AR', 'MX', 'JP', 'KR', 'CN', 'IN', 'AU', 'NZ', 'ZA'
  ];

  const COUNTRY_I18N_KEYS = {
    DE: 'd.country.de',
    AT: 'd.country.at',
    CH: 'd.country.ch',
    US: 'd.country.us',
    CA: 'd.country.ca',
    GB: 'd.country.gb',
    FR: 'd.country.fr',
    ES: 'd.country.es',
    IT: 'd.country.it',
    NL: 'd.country.nl',
    BE: 'd.country.be',
    PL: 'd.country.pl',
    CZ: 'd.country.cz',
    RO: 'd.country.ro',
    TR: 'd.country.tr',
    UA: 'd.country.ua',
    SE: 'd.country.se',
    NO: 'd.country.no',
    DK: 'd.country.dk',
    FI: 'd.country.fi',
    PT: 'd.country.pt',
    BR: 'd.country.br',
    AR: 'd.country.ar',
    MX: 'd.country.mx',
    JP: 'd.country.jp',
    KR: 'd.country.kr',
    CN: 'd.country.cn',
    IN: 'd.country.in',
    AU: 'd.country.au',
    NZ: 'd.country.nz',
    ZA: 'd.country.za'
  };

  const GAME_IDS = {
    ANY: 'any',
    OVERWATCH: 'overwatch',
    LOL: 'lol',
    FORTNITE: 'fortnite',
    RIVALS: 'rivals'
  };

  const ALLOWED_GAME_IDS = [
    GAME_IDS.OVERWATCH,
    GAME_IDS.LOL,
    GAME_IDS.FORTNITE,
    GAME_IDS.RIVALS
  ];

  const EXPLORE_ROLE_OPTIONS = ['Tank', 'Support', 'DPS', 'Jungle', 'IGL', 'Scout'];

  const state = {
    mode: 'players',
    search: '',
    game: GAME_IDS.ANY,
    role: 'Any',
    rank: 'Any',
    region: 'Any',
    availability: 'Any',
    proof: 'Any',
    compare: [],
    networkMode: 'intro',
    authMode: 'register',
    authEmail: '',
    isAuthenticated: false,
    authUser: null,
    authUsers: loadAuthUsers(),
    profile: null,
    profileEditorSection: 'public',
    metrics: loadMetrics(),
    selectedInviteContext: null
  };

  const authSession = loadAuthSession(state.authUsers);
  state.isAuthenticated = authSession.isAuthenticated;
  state.authUser = authSession.user;
  state.profile = loadProfileState();

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

  function safeStorageRemove(key) {
    try {
      window.localStorage.removeItem(key);
    } catch (_err) {
      // no-op
    }
  }

  function getUnifiedStateApi() {
    if (window.usmState && typeof window.usmState === 'object') {
      return window.usmState;
    }
    return null;
  }

  function loadUnifiedState(path, fallbackValue, legacyReader) {
    const api = getUnifiedStateApi();
    if (api && typeof api.loadState === 'function') {
      return api.loadState(path, fallbackValue, legacyReader);
    }
    if (typeof legacyReader === 'function') {
      const legacyValue = legacyReader();
      if (legacyValue !== undefined && legacyValue !== null) {
        return legacyValue;
      }
    }
    return fallbackValue;
  }

  function saveUnifiedState(path, value) {
    const api = getUnifiedStateApi();
    if (api && typeof api.saveState === 'function') {
      api.saveState(path, value);
    }
    return value;
  }

  function updateUnifiedState(path, updater, fallbackValue) {
    const api = getUnifiedStateApi();
    if (api && typeof api.updateState === 'function') {
      return api.updateState(path, updater, fallbackValue);
    }
    const nextValue = typeof updater === 'function' ? updater(fallbackValue) : updater;
    return saveUnifiedState(path, nextValue);
  }

  function makeUnifiedId(prefix) {
    const api = getUnifiedStateApi();
    if (api && typeof api.makeId === 'function') {
      return api.makeId(prefix);
    }
    const safePrefix = String(prefix || 'id').replace(/[^a-z0-9_-]/gi, '').toLowerCase() || 'id';
    return `${safePrefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function persistUiSubmitMeta(key, statusOrPayload, extra) {
    const payload = typeof statusOrPayload === 'object' && statusOrPayload !== null
      ? statusOrPayload
      : { status: statusOrPayload };
    updateUnifiedState(
      `ui.submits.${key}`,
      (prev) => ({
        ...(prev && typeof prev === 'object' ? prev : {}),
        ...(payload && typeof payload === 'object' ? payload : {}),
        updatedAt: new Date().toISOString(),
        ...(extra && typeof extra === 'object' ? extra : {})
      }),
      {}
    );
  }

  function loadPersistedExploreFilters() {
    return loadUnifiedState(
      'explore.filters',
      null,
      () => null
    );
  }

  function persistExploreFilters() {
    saveUnifiedState('explore.filters', {
      mode: state.mode,
      search: state.search,
      game: state.game,
      role: state.role,
      rank: state.rank,
      region: state.region,
      availability: state.availability,
      proof: state.proof
    });
  }

  function applyPersistedExploreFilters() {
    const saved = loadPersistedExploreFilters();
    if (!saved || typeof saved !== 'object') {
      return;
    }

    const normalizedMode = saved.mode === 'teams' ? 'teams' : 'players';
    state.mode = normalizedMode;
    state.search = typeof saved.search === 'string' ? saved.search : '';
    state.game = normalizeGameId(saved.game, GAME_IDS.ANY);
    state.role = typeof saved.role === 'string' ? saved.role : 'Any';
    state.rank = typeof saved.rank === 'string' ? saved.rank : 'Any';
    state.region = typeof saved.region === 'string' ? saved.region : 'Any';
    state.availability = typeof saved.availability === 'string' ? saved.availability : 'Any';
    state.proof = typeof saved.proof === 'string' ? saved.proof : 'Any';
  }

  function getGameLabel(gameId) {
    if (gameId === GAME_IDS.OVERWATCH) return t('d.game.overwatch');
    if (gameId === GAME_IDS.LOL) return t('d.game.lol');
    if (gameId === GAME_IDS.FORTNITE) return t('d.game.fortnite');
    if (gameId === GAME_IDS.RIVALS) return t('d.game.rivals');
    return String(gameId || '-');
  }

  function normalizeGameId(value, fallback) {
    const raw = String(value || '').trim().toLowerCase();
    if (raw === GAME_IDS.OVERWATCH) return GAME_IDS.OVERWATCH;
    if (raw === GAME_IDS.LOL || raw === 'league') return GAME_IDS.LOL;
    if (raw === GAME_IDS.FORTNITE) return GAME_IDS.FORTNITE;
    if (raw === 'arcraiders' || raw === 'arc raiders') return GAME_IDS.RIVALS;
    if (raw === GAME_IDS.RIVALS) return GAME_IDS.RIVALS;
    if (raw === GAME_IDS.ANY || raw === 'any') return GAME_IDS.ANY;
    return fallback;
  }

  async function callMockApi(action, payload, options) {
    if (typeof window.usmMockApi === 'function') {
      return window.usmMockApi(action, payload, {
        minDelay: 300,
        maxDelay: 900,
        failureRate: 0.06,
        ...(options && typeof options === 'object' ? options : {})
      });
    }

    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve({
          ok: true,
          id: makeUnifiedId(action || 'req'),
          action: action || 'unknown',
          payload: payload || {},
          createdAt: new Date().toISOString()
        });
      }, 300);
    });
  }

  function normalizeIdentity(value) {
    return String(value || '').trim().toLowerCase();
  }

  function toPublicAuthUser(user) {
    if (!user) {
      return null;
    }
    return {
      username: user.username,
      email: user.email,
      handle: user.handle,
      status: user.status || 'online'
    };
  }

  function deriveUsernameFromEmail(email) {
    const localPart = String(email || '').split('@')[0] || 'player';
    const cleaned = localPart.toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 24);
    return cleaned || 'player';
  }

  function deriveHandleFromUsername(username) {
    const cleaned = String(username || '').replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 24);
    if (!cleaned) {
      return 'Player';
    }
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  function normalizeAuthUser(rawUser) {
    if (!rawUser || typeof rawUser !== 'object') {
      return null;
    }

    const email = normalizeIdentity(rawUser.email);
    const password = typeof rawUser.password === 'string' ? rawUser.password : '';
    if (!email || !password) {
      return null;
    }

    const fallbackUsername = deriveUsernameFromEmail(email);
    const usernameRaw = typeof rawUser.username === 'string' ? rawUser.username.trim() : '';
    const username = (usernameRaw || fallbackUsername).slice(0, 24);
    const handleRaw = typeof rawUser.handle === 'string' ? rawUser.handle.trim() : '';
    const handle = (handleRaw || deriveHandleFromUsername(username)).slice(0, 24);

    return {
      username,
      email,
      password,
      handle,
      status: 'online'
    };
  }

  function ensureDefaultAuthUser(users) {
    const defaults = normalizeAuthUser(DEFAULT_AUTH_USER);
    if (!defaults) {
      return users;
    }

    const exists = users.some((user) => normalizeIdentity(user.email) === normalizeIdentity(defaults.email));
    if (exists) {
      return users;
    }
    return [defaults].concat(users);
  }

  function loadAuthUsers() {
    const raw = safeStorageGet(AUTH_USERS_KEY);
    if (!raw) {
      return ensureDefaultAuthUser([]);
    }

    try {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return ensureDefaultAuthUser([]);
      }

      const unique = [];
      const emailSet = new Set();
      parsed.forEach((entry) => {
        const user = normalizeAuthUser(entry);
        if (!user) {
          return;
        }
        const emailKey = normalizeIdentity(user.email);
        if (emailSet.has(emailKey)) {
          return;
        }
        emailSet.add(emailKey);
        unique.push(user);
      });

      return ensureDefaultAuthUser(unique);
    } catch (_err) {
      return ensureDefaultAuthUser([]);
    }
  }

  function persistAuthUsers() {
    safeStorageSet(
      AUTH_USERS_KEY,
      JSON.stringify(
        (state.authUsers || []).map((user) => ({
          username: user.username,
          email: user.email,
          password: user.password,
          handle: user.handle,
          status: 'online'
        }))
      )
    );
  }

  function findAuthUserByIdentity(identity) {
    const normalized = normalizeIdentity(identity);
    if (!normalized) {
      return null;
    }

    return (state.authUsers || []).find((user) => {
      const username = normalizeIdentity(user.username);
      const email = normalizeIdentity(user.email);
      return username === normalized || email === normalized;
    }) || null;
  }

  function findAuthUserByCredentials(identity, password) {
    const user = findAuthUserByIdentity(identity);
    if (!user) {
      return null;
    }
    if (String(user.password) !== String(password || '')) {
      return null;
    }
    return user;
  }

  function getUniqueUsername(baseUsername) {
    const base = (baseUsername || 'player').slice(0, 20);
    const existing = new Set((state.authUsers || []).map((user) => normalizeIdentity(user.username)));
    if (!existing.has(normalizeIdentity(base))) {
      return base;
    }

    let counter = 2;
    while (counter < 9999) {
      const candidate = `${base}${counter}`.slice(0, 24);
      if (!existing.has(normalizeIdentity(candidate))) {
        return candidate;
      }
      counter += 1;
    }
    return `${base}${Date.now().toString().slice(-4)}`.slice(0, 24);
  }

  function registerAuthUser(email, password) {
    const normalizedEmail = normalizeIdentity(email);
    if (!normalizedEmail) {
      return { ok: false, reason: 'invalid' };
    }

    const emailExists = (state.authUsers || []).some((user) => normalizeIdentity(user.email) === normalizedEmail);
    if (emailExists) {
      return { ok: false, reason: 'exists' };
    }

    const usernameBase = deriveUsernameFromEmail(normalizedEmail);
    const username = getUniqueUsername(usernameBase);
    const user = {
      username,
      email: normalizedEmail,
      password: String(password || ''),
      handle: deriveHandleFromUsername(username),
      status: 'online'
    };

    state.authUsers = (state.authUsers || []).concat(user);
    persistAuthUsers();
    return { ok: true, user };
  }

  function getAuthOnlineLabel(user) {
    const source = user || state.authUser;
    if (!source) {
      return t('d.auth.open.login');
    }
    const identity = source.handle || source.username || 'Player';
    return `${identity} · ${t('d.auth.status.online')}`;
  }

  function cloneValue(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function getDefaultProfileState() {
    return {
      version: PROFILE_VERSION,
      publicProfile: {
        displayName: 'Shinobi',
        role: 'Flex DPS',
        country: 'DE',
        headline: 'Flex DPS focused on team systems, comms discipline and measurable improvement.',
        about: 'Known for calm mid-round communication, role flexibility across metas and consistent VOD review habits.',
        proofStatus: PROOF_STATUS.SELF_DECLARED,
        mainGame: 'overwatch',
        games: {
          overwatch: { handle: 'Shinobi#4728', tier: 'Master', division: '3' },
          lol: { handle: 'Shn0bi', tier: 'Diamond', division: 'II' },
          rivals: { handle: 'ShinobiX', tier: 'Grandmaster' },
          fortnite: { handle: 'ShinobiFN', tier: 'Champion', division: 'II' }
        }
      },
      experience: [
        { role: 'Flex DPS', org: 'FaZe Academy · Active Roster', date: '2025 - Present' },
        { role: 'Starter Support', org: 'Team Liquid Community Division', date: '2023 - 2025' },
        { role: 'Scrim Captain', org: 'EU Contenders Mix', date: '2022 - 2023' }
      ],
      career: {
        currentTeamText: 'FaZe · Current Member',
        formerTeamText: 'Team Liquid · Former Member'
      },
      setup: {
        dpi: '800',
        sens: '4.00',
        fov: '103',
        hz: '1000'
      }
    };
  }

  function sanitizeTextValue(value, fallback, maxLength) {
    const text = typeof value === 'string' ? value.trim() : '';
    if (!text) {
      return fallback;
    }
    const limit = Number.isFinite(maxLength) ? maxLength : 180;
    return text.slice(0, limit);
  }

  function normalizeProofStatus(value, fallback) {
    if (value === PROOF_STATUS.RANK_VERIFIED || value === PROOF_STATUS.ACCOUNT_CONNECTED || value === PROOF_STATUS.SELF_DECLARED) {
      return value;
    }
    return fallback;
  }

  function normalizeProfileGame(gameKey, gameValue, fallbackValue) {
    const catalog = PROFILE_RANKS[gameKey];
    if (!catalog) {
      return cloneValue(fallbackValue);
    }

    const source = gameValue && typeof gameValue === 'object' ? gameValue : {};
    const tier = catalog.tiers.includes(source.tier) ? source.tier : fallbackValue.tier;
    const allowsDivision = catalog.allowsDivision(tier);

    const normalized = {
      handle: sanitizeTextValue(source.handle, fallbackValue.handle, 64),
      tier
    };

    if (allowsDivision) {
      const fallbackDivision = fallbackValue.division || catalog.divisions[0] || '';
      normalized.division = catalog.divisions.includes(source.division) ? source.division : fallbackDivision;
    }

    return normalized;
  }

  function normalizeProfileState(rawState) {
    const defaults = getDefaultProfileState();
    if (!rawState || typeof rawState !== 'object') {
      return defaults;
    }

    const source = rawState;
    const normalized = cloneValue(defaults);
    const sourcePublic = source.publicProfile && typeof source.publicProfile === 'object' ? source.publicProfile : {};

    normalized.publicProfile.displayName = sanitizeTextValue(sourcePublic.displayName, defaults.publicProfile.displayName, 40);
    normalized.publicProfile.role = sanitizeTextValue(sourcePublic.role, defaults.publicProfile.role, 40);
    normalized.publicProfile.country = PROFILE_COUNTRY_CODES.includes(String(sourcePublic.country || '').toUpperCase())
      ? String(sourcePublic.country).toUpperCase()
      : defaults.publicProfile.country;
    normalized.publicProfile.headline = sanitizeTextValue(sourcePublic.headline, defaults.publicProfile.headline, 170);
    normalized.publicProfile.about = sanitizeTextValue(sourcePublic.about, defaults.publicProfile.about, 280);
    normalized.publicProfile.proofStatus = normalizeProofStatus(sourcePublic.proofStatus, defaults.publicProfile.proofStatus);
    normalized.publicProfile.mainGame = ['overwatch', 'lol', 'rivals', 'fortnite'].includes(sourcePublic.mainGame)
      ? sourcePublic.mainGame
      : defaults.publicProfile.mainGame;

    const sourceGames = sourcePublic.games && typeof sourcePublic.games === 'object' ? sourcePublic.games : {};
    normalized.publicProfile.games.overwatch = normalizeProfileGame('overwatch', sourceGames.overwatch, defaults.publicProfile.games.overwatch);
    normalized.publicProfile.games.lol = normalizeProfileGame('lol', sourceGames.lol, defaults.publicProfile.games.lol);
    normalized.publicProfile.games.rivals = normalizeProfileGame('rivals', sourceGames.rivals, defaults.publicProfile.games.rivals);
    normalized.publicProfile.games.fortnite = normalizeProfileGame('fortnite', sourceGames.fortnite, defaults.publicProfile.games.fortnite);

    const sourceExperience = Array.isArray(source.experience) ? source.experience.slice(0, 3) : [];
    normalized.experience = defaults.experience.map((fallbackEntry, index) => {
      const sourceEntry = sourceExperience[index] && typeof sourceExperience[index] === 'object' ? sourceExperience[index] : {};
      return {
        role: sanitizeTextValue(sourceEntry.role, fallbackEntry.role, 60),
        org: sanitizeTextValue(sourceEntry.org, fallbackEntry.org, 120),
        date: sanitizeTextValue(sourceEntry.date, fallbackEntry.date, 40)
      };
    });

    const sourceCareer = source.career && typeof source.career === 'object' ? source.career : {};
    normalized.career.currentTeamText = sanitizeTextValue(sourceCareer.currentTeamText, defaults.career.currentTeamText, 90);
    normalized.career.formerTeamText = sanitizeTextValue(sourceCareer.formerTeamText, defaults.career.formerTeamText, 90);

    const sourceSetup = source.setup && typeof source.setup === 'object' ? source.setup : {};
    normalized.setup.dpi = sanitizeTextValue(String(sourceSetup.dpi || ''), defaults.setup.dpi, 8);
    normalized.setup.sens = sanitizeTextValue(String(sourceSetup.sens || ''), defaults.setup.sens, 8);
    normalized.setup.fov = sanitizeTextValue(String(sourceSetup.fov || ''), defaults.setup.fov, 8);
    normalized.setup.hz = sanitizeTextValue(String(sourceSetup.hz || ''), defaults.setup.hz, 8);

    normalized.version = PROFILE_VERSION;
    return normalized;
  }

  function loadProfileState() {
    const raw = safeStorageGet(PROFILE_STORAGE_KEY);
    if (!raw) {
      return getDefaultProfileState();
    }

    try {
      const parsed = JSON.parse(raw);
      return normalizeProfileState(parsed);
    } catch (_err) {
      return getDefaultProfileState();
    }
  }

  function persistProfileState() {
    safeStorageSet(PROFILE_STORAGE_KEY, JSON.stringify(state.profile));
  }

  function sanitizeMetricValue(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return 0;
    }
    return Math.floor(parsed);
  }

  function getMetricsPayload() {
    return {
      connect: sanitizeMetricValue(state.metrics.connect),
      tryouts: sanitizeMetricValue(state.metrics.tryouts),
      waitlist: sanitizeMetricValue(state.metrics.waitlist),
      compareAdds: sanitizeMetricValue(state.metrics.compareAdds)
    };
  }

  function loadMetrics() {
    const fallback = { connect: 0, tryouts: 0, waitlist: 0, compareAdds: 0 };
    const raw = safeStorageGet(METRICS_STORAGE_KEY);
    if (!raw) {
      return fallback;
    }

    try {
      const parsed = JSON.parse(raw);
      return {
        connect: sanitizeMetricValue(parsed.connect),
        tryouts: sanitizeMetricValue(parsed.tryouts),
        waitlist: sanitizeMetricValue(parsed.waitlist),
        compareAdds: sanitizeMetricValue(parsed.compareAdds)
      };
    } catch (_err) {
      return fallback;
    }
  }

  function persistMetrics() {
    const payload = getMetricsPayload();
    safeStorageSet(
      METRICS_STORAGE_KEY,
      JSON.stringify({
        ...payload,
        updatedAt: new Date().toISOString()
      })
    );
  }

  function loadAuthSession(authUsers) {
    const raw = safeStorageGet(AUTH_SESSION_KEY);
    if (!raw) {
      return { isAuthenticated: false, user: null };
    }

    try {
      const parsed = JSON.parse(raw);
      const users = Array.isArray(authUsers) ? authUsers : [];
      const candidates = [];
      if (parsed && typeof parsed.email === 'string') {
        candidates.push(normalizeIdentity(parsed.email));
      }
      if (parsed && typeof parsed.username === 'string') {
        candidates.push(normalizeIdentity(parsed.username));
      }

      const match = users.find((user) => {
        const email = normalizeIdentity(user.email);
        const username = normalizeIdentity(user.username);
        return candidates.includes(email) || candidates.includes(username);
      });

      if (!match) {
        return { isAuthenticated: false, user: null };
      }

      return {
        isAuthenticated: true,
        user: toPublicAuthUser(match)
      };
    } catch (_err) {
      return { isAuthenticated: false, user: null };
    }
  }

  function persistAuthSession() {
    if (!state.isAuthenticated || !state.authUser) {
      safeStorageRemove(AUTH_SESSION_KEY);
      return;
    }

    safeStorageSet(
      AUTH_SESSION_KEY,
      JSON.stringify({
        username: state.authUser.username,
        email: state.authUser.email,
        handle: state.authUser.handle,
        status: state.authUser.status,
        loggedInAt: new Date().toISOString()
      })
    );
  }

  function getAssetBase() {
    const path = (window.location && window.location.pathname) ? window.location.pathname : '';
    return path.includes('/comparison/') ? '../assets' : 'assets';
  }

  const players = [
    {
      handle: 'ValkyrieEU',
      region: 'EU',
      country: 'DE',
      language: ['DE', 'EN'],
      availability: 'Weeknights',
      lookingFor: ['Team', 'Tryouts'],
      games: [
        { game: GAME_IDS.OVERWATCH, role: 'Support', rank: 'Master 3', peak: 'GM 5', proof: PROOF_STATUS.ACCOUNT_CONNECTED },
        { game: GAME_IDS.LOL, role: 'Support', rank: 'Diamond II', peak: 'Master', proof: PROOF_STATUS.RANK_VERIFIED }
      ]
    },
    {
      handle: 'ArcScout',
      region: 'EU',
      country: 'AT',
      language: ['EN'],
      availability: 'Weekend',
      lookingFor: ['Scrims', 'Tryouts'],
      games: [
        { game: GAME_IDS.RIVALS, role: 'Scout', rank: 'N/A', peak: 'N/A', proof: PROOF_STATUS.SELF_DECLARED },
        { game: GAME_IDS.FORTNITE, role: 'IGL', rank: 'Champion', peak: 'Unreal', proof: PROOF_STATUS.ACCOUNT_CONNECTED }
      ]
    },
    {
      handle: 'Shinobi',
      region: 'EU',
      country: 'DE',
      language: ['EN', 'DE'],
      availability: 'Weeknights',
      lookingFor: ['Tryouts', 'Team'],
      games: [
        { game: GAME_IDS.OVERWATCH, role: 'Flex DPS', rank: 'Master', peak: 'Grandmaster', proof: PROOF_STATUS.SELF_DECLARED },
        { game: GAME_IDS.FORTNITE, role: 'IGL', rank: 'Champion', peak: 'Unreal', proof: PROOF_STATUS.SELF_DECLARED }
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
          game: GAME_IDS.OVERWATCH,
          needs: [
            { role: 'Tank', rankMin: 'Master' },
            { role: 'Support', rankMin: 'Diamond' }
          ]
        },
        {
          game: GAME_IDS.LOL,
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
          game: GAME_IDS.FORTNITE,
          needs: [{ role: 'IGL', rankMin: 'Champion' }]
        },
        {
          game: GAME_IDS.RIVALS,
          needs: [{ role: 'Scout', rankMin: 'N/A' }]
        }
      ],
      schedule: 'Tue/Thu 20:00-23:00 CET'
    }
  ];

  const ASSET_BASE = getAssetBase();
  const GAME_LOGO = {
    [GAME_IDS.OVERWATCH]: `${ASSET_BASE}/logos/misc/overwatch_logo_2026.png`,
    [GAME_IDS.LOL]: `${ASSET_BASE}/logos/misc/LoL.png`,
    [GAME_IDS.FORTNITE]: `${ASSET_BASE}/logos/misc/Fortnite.jpeg`,
    [GAME_IDS.RIVALS]: `${ASSET_BASE}/logos/misc/rivals.png`
  };

  const I18N_D = {
    en: {
      'd.a11y.skip': 'Skip to content',
      'd.nav.start': 'Start',
      'd.nav.network': 'Network',
      'd.nav.requests': 'Requests',
      'd.nav.explore': 'Explore',
      'd.nav.matches': 'Matches',
      'd.nav.tryouts': 'Tryouts',
      'd.nav.messages': 'Messages',
      'd.nav.notifications': 'Notifications',
      'd.nav.profile': 'Profile',
      'd.toggle.themeDark': 'Theme: Dark',
      'd.toggle.themeLight': 'Theme: Light',
      'd.toggle.motionOn': 'Motion: On',
      'd.toggle.motionOff': 'Motion: Reduced',
      'd.preview.tag': 'Shinobi Profile',
      'd.preview.tag.live': 'Shinobi Live',
      'd.preview.lock.note': 'Shinobi profile is visible. Log in to unlock full actions.',
      'd.preview.lock.cta': 'Login for full access',
      'd.page.network.title': 'Network',
      'd.page.network.lead': 'See how Shinobi would manage contacts, introductions, and relationship context in GameIn.',
      'd.page.requests.title': 'Requests',
      'd.page.requests.lead': 'Browse open tryout requests, recommended fits, and saved opportunities in a professional workflow.',
      'd.page.messages.title': 'Messages',
      'd.page.messages.lead': 'Threaded communication, context summaries, and role-specific collaboration history.',
      'd.page.notifications.title': 'Notifications',
      'd.page.notifications.lead': 'Track mentions, request updates, and system notices in one timeline.',
      'd.module.network.your': 'Your Network',
      'd.module.network.pending': 'Pending Invites',
      'd.module.network.suggested': 'People You May Know',
      'd.module.requests.open': 'Open Requests',
      'd.module.requests.recommended': 'Recommended Fits',
      'd.module.requests.saved': 'Saved Opportunities',
      'd.module.messages.threads': 'Thread List',
      'd.module.messages.preview': 'Conversation',
      'd.module.messages.compose': 'Compose',
      'd.module.notifications.mentions': 'Mentions',
      'd.module.notifications.updates': 'Request Updates',
      'd.module.notifications.system': 'System Notices',
      'd.action.addConnection': 'Add Connection',
      'd.action.accept': 'Accept Invite',
      'd.action.message': 'Message',
      'd.action.apply': 'Apply',
      'd.action.createRequest': 'Create Request',
      'd.action.unlockContact': 'Unlock Contact',
      'd.action.send': 'Send Message',
      'd.action.attach': 'Attach File',
      'd.action.startThread': 'Start New Thread',
      'd.action.markAllRead': 'Mark all as read',
      'd.action.openThread': 'Open full thread',
      'd.action.managePrefs': 'Manage preferences',
      'd.messages.sample.one': 'Shinobi, can you join tonight at 20:00 CET for role trials?',
      'd.messages.sample.two': 'Confirmed. I can bring two VOD clips from last week scrims.',
      'd.messages.sample.three': 'Perfect. I will send lobby details after captain review.',
      'd.messages.compose.placeholder': 'Write a message draft for this thread.',
      'd.notifications.item.one': 'Your profile was mentioned in Vienna Ascend\'s request thread.',
      'd.notifications.item.two': 'FaZe Academy changed required rank from Diamond to Master.',
      'd.notifications.item.three': 'Login unlocks messaging, invites, and workflow actions.',
      'd.network.meta.self': 'EU · Flex DPS · Overwatch',
      'd.network.meta.valk': 'Support · Master 3 · 42 shared scrims',
      'd.network.meta.arc': 'Scout · Marvel Rivals · Weekend availability',
      'd.network.meta.pending.one': 'Incoming · Tank + Support trial squad · 19:00 CET',
      'd.network.meta.pending.two': 'Incoming · Marvel Rivals scrim cluster · Tue/Thu',
      'd.network.meta.pending.three': 'Outgoing · Follow-up intro requested',
      'd.network.meta.suggested.one': 'Team Manager · FaZe Academy · Shared org history',
      'd.network.meta.suggested.two': 'Head Coach · Vienna Ascend · Looking for shot-calling structure',
      'd.network.meta.suggested.three': 'Overwatch · Grandmaster · Team Liquid alumni circuit',
      'd.requests.meta.open.one': 'Needs: Support + Tank · Rank floor: Master · Tue 20:00 CET',
      'd.requests.meta.open.two': 'Needs: Scout · Regional scrim cluster · Thu 19:30 CET',
      'd.requests.meta.open.three': 'Needs: Jungle · Rank floor: Diamond · Weekend block',
      'd.requests.meta.reco.one': 'Shinobi profile aligns with Overwatch Flex DPS tryout needs.',
      'd.requests.meta.reco.two': 'Weeknight availability fits Mon/Wed/Fri training blocks.',
      'd.requests.meta.reco.titleOne': 'Role Match: 92%',
      'd.requests.meta.reco.titleTwo': 'Schedule Match: 88%',
      'd.requests.meta.saved.one': 'Saved two days ago · Follow-up pending',
      'd.requests.meta.saved.two': 'Saved yesterday · Contact not unlocked',
      'd.messages.meta.thread.one': 'Tryout prep · 4 unread · Updated 08:42',
      'd.messages.meta.thread.two': 'Roster review · 2 unread · Updated yesterday',
      'd.messages.meta.thread.three': 'Intro thread · 1 unread · Updated 2 days ago',
      'd.messages.field.to': 'To',
      'd.messages.field.draft': 'Draft',
      'd.notifications.meta.mentions.two': '3 profile views · 1 direct mention · Last 24h',
      'd.notifications.meta.updates.oneTitle': 'Rank requirement update',
      'd.notifications.meta.updates.twoTitle': 'Tryout slot shift',
      'd.notifications.meta.updates.twoText': 'Cloud 25 moved Thursday block to 20:30 CET',
      'd.notifications.meta.system.oneTitle': 'Account Access',
      'd.notifications.meta.system.twoTitle': 'Profile proof state',
      'd.notifications.meta.system.twoText': 'Connected account badges are visible, rank verification expands in early access.',
      'd.hero.badge': 'GameIn',
      'd.hero.title': 'From solo queue to a real team.',
      'd.hero.lead': 'Find verified players and teams in Overwatch, LoL, Fortnite and Marvel Rivals. Compare fast. Tryouts made simple.',
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
      'd.game.rivals': 'Marvel Rivals',
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
      'd.country.de': 'Germany',
      'd.country.at': 'Austria',
      'd.country.ch': 'Switzerland',
      'd.country.us': 'United States',
      'd.country.ca': 'Canada',
      'd.country.gb': 'United Kingdom',
      'd.country.fr': 'France',
      'd.country.es': 'Spain',
      'd.country.it': 'Italy',
      'd.country.nl': 'Netherlands',
      'd.country.be': 'Belgium',
      'd.country.pl': 'Poland',
      'd.country.cz': 'Czech Republic',
      'd.country.ro': 'Romania',
      'd.country.tr': 'Turkey',
      'd.country.ua': 'Ukraine',
      'd.country.se': 'Sweden',
      'd.country.no': 'Norway',
      'd.country.dk': 'Denmark',
      'd.country.fi': 'Finland',
      'd.country.pt': 'Portugal',
      'd.country.br': 'Brazil',
      'd.country.ar': 'Argentina',
      'd.country.mx': 'Mexico',
      'd.country.jp': 'Japan',
      'd.country.kr': 'South Korea',
      'd.country.cn': 'China',
      'd.country.in': 'India',
      'd.country.au': 'Australia',
      'd.country.nz': 'New Zealand',
      'd.country.za': 'South Africa',
      'd.schedule.monWedFri': 'Mon/Wed/Fri',
      'd.schedule.tueThu': 'Tue/Thu',
      'd.proof.rankVerified': 'Rank Verified',
      'd.proof.accountConnected': 'Account Connected',
      'd.proof.selfDeclared': 'Self Declared',
      'd.compare.title': 'Compare (max 2)',
      'd.compare.clear': 'Clear',
      'd.compare.empty': 'Select up to 2 players to compare role, rank, proof, country and availability.',
      'd.compare.invite': 'Invite selected',
      'd.empty': 'No results for current filters.',
      'd.legal.privacy': 'Privacy',
      'd.legal.terms': 'Terms',
      'd.toast.comingSoon': 'Coming soon.',
      'd.toast.tryoutsSoon': 'Tryouts are coming soon.',
      'd.toast.messagesSoon': 'Messages are coming soon.',
      'd.toast.maxCompare': 'You can compare at most 2 players.',
      'd.toast.error.generic': 'Something went wrong. Please try again.',
      'd.invite.title': 'Invite to Tryout',
      'd.invite.game': 'Game',
      'd.invite.role': 'Role needed / offered',
      'd.invite.slot': 'Suggested slot',
      'd.invite.notes': 'Notes',
      'd.invite.submit': 'Send tryout request',
      'd.invite.submitting': 'Sending...',
      'd.invite.success': 'Tryout request sent. You\'ll be notified when early access opens.',
      'd.connect.title': 'Connect account',
      'd.connect.lead': 'Choose a provider to confirm ownership and improve trust signals.',
      'd.connect.connecting': 'Connecting...',
      'd.connect.success': 'Connection recorded. Verification expands in early access.',
      'd.modal.close': 'Close',
      'd.card.region': 'Region',
      'd.card.country': 'Country',
      'd.card.availability': 'Availability',
      'd.card.invite': 'Invite',
      'd.card.compare': 'Compare',
      'd.card.remove': 'Remove',
      'd.card.open': 'Open profile',
      'd.card.apply': 'Apply / Request tryout',
      'd.compare.row.role': 'Role',
      'd.compare.row.rank': 'Rank',
      'd.compare.row.proof': 'Proof',
      'd.compare.row.country': 'Country',
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
      'd.proof.tooltip.self': 'Self-declared data, no verification yet.',
      'd.profile.headline': 'Flex DPS focused on team systems, comms discipline and measurable improvement.',
      'd.profile.about': 'Known for calm mid-round communication, role flexibility across metas and consistent VOD review habits.',
      'd.profile.about.short': 'Proof-first gaming identity with references, career history and tryout context.',
      'd.profile.country.label': 'Country',
      'd.experience.title': 'Experience',
      'd.experience.one.role': 'Flex DPS',
      'd.experience.one.org': 'FaZe Academy · Active Roster',
      'd.experience.one.date': '2025 - Present',
      'd.experience.two.role': 'Starter Support',
      'd.experience.two.org': 'Team Liquid Community Division',
      'd.experience.two.date': '2023 - 2025',
      'd.experience.three.role': 'Scrim Captain',
      'd.experience.three.org': 'EU Contenders Mix',
      'd.experience.three.date': '2022 - 2023',
      'd.references.title': 'References',
      'd.references.one.name': 'Kai "Vector" Neumann',
      'd.references.one.meta': 'Head Coach · Vienna Ascend',
      'd.references.one.text': 'Reliable in review cycles and adapts quickly to strategic feedback.',
      'd.references.two.name': 'Mila "Astra" Hoffmann',
      'd.references.two.meta': 'Team Manager · FaZe Academy',
      'd.references.two.text': 'Strong teammate with consistent attendance and clear match communication.',
      'd.network.open.intro': 'Request Intro',
      'd.network.open.reference': 'Add Reference',
      'd.network.title': 'Professional Networking',
      'd.network.tab.intro': 'Request Intro',
      'd.network.tab.reference': 'Add Reference',
      'd.network.intro.org.label': 'Team / Organization',
      'd.network.intro.org.placeholder': 'e.g. Team Liquid Academy',
      'd.network.intro.role.label': 'Role needed',
      'd.network.intro.role.placeholder': 'e.g. Flex DPS for evening scrims',
      'd.network.intro.message.label': 'Message',
      'd.network.intro.message.placeholder': 'Share context for the introduction.',
      'd.network.reference.role.label': 'Your role',
      'd.network.reference.role.placeholder': 'e.g. Coach, Team Lead, Analyst',
      'd.network.reference.relationship.label': 'Relationship',
      'd.network.reference.relationship.placeholder': 'e.g. Worked together for one season',
      'd.network.reference.text.label': 'Reference text',
      'd.network.reference.text.placeholder': 'Write a short reference.',
      'd.network.submit.intro': 'Send intro request',
      'd.network.submit.reference': 'Submit reference',
      'd.network.submitting': 'Sending...',
      'd.network.success': 'Request sent. You\'ll be notified when early access opens.',
      'd.toast.networkCaptured': 'Request sent.',
      'd.auth.open.register': 'Register',
      'd.auth.open.login': 'Login',
      'd.auth.entry.online': 'Shinobi · Online',
      'd.auth.status.online': 'Online',
      'd.auth.entry.logoutHint': 'Open account menu',
      'd.auth.loggedOut': 'Logged out.',
      'd.account.menu.title': 'Shinobi',
      'd.account.menu.manageAccount': 'Manage account',
      'd.account.menu.manageProfile': 'Manage profile',
      'd.account.menu.logout': 'Log out',
      'd.account.manage.coming': 'Account settings are coming soon.',
      'd.account.profile.coming': 'Profile management opens in your profile section.',
      'd.account.logout.confirm': 'Do you want to log out now?',
      'd.auth.title.register': 'Create your account',
      'd.auth.title.login': 'Log in to your account',
      'd.auth.lead': 'Log in for full access. Register continues to waitlist.',
      'd.auth.tab.register': 'Register',
      'd.auth.tab.login': 'Login',
      'd.auth.field.email': 'Email',
      'd.auth.field.loginId': 'Email or username',
      'd.auth.field.password': 'Password',
      'd.auth.placeholder.email': 'you@example.com',
      'd.auth.placeholder.loginId': 'Enter email or username',
      'd.auth.placeholder.password': 'At least 6 characters',
      'd.auth.submit.register': 'Register and continue',
      'd.auth.submit.login': 'Login',
      'd.auth.submitting': 'Please wait...',
      'd.auth.success': 'Authentication complete.',
      'd.auth.success.login': 'Logged in successfully.',
      'd.auth.error.invalid': 'Invalid email/username or password.',
      'd.auth.error.exists': 'An account with this email already exists.',
      'd.auth.continueWaitlist': 'Continuing to waitlist...',
      'd.edit.tooltip': 'Edit',
      'd.edit.section.public': 'Public Profile',
      'd.edit.section.experience': 'Experience',
      'd.edit.section.career': 'Career',
      'd.edit.section.setup': 'Pro Setup',
      'd.editor.title': 'Edit profile',
      'd.editor.save': 'Save changes',
      'd.editor.saving': 'Saving...',
      'd.editor.cancel': 'Cancel',
      'd.editor.saved': 'Profile saved.',
      'd.editor.public.displayName': 'Display name',
      'd.editor.public.role': 'Role',
      'd.editor.public.country': 'Country',
      'd.editor.public.headline': 'Professional headline',
      'd.editor.public.about': 'About',
      'd.editor.public.proofStatus': 'Proof status',
      'd.editor.public.mainGame': 'Main game',
      'd.editor.public.game.overwatch': 'Overwatch',
      'd.editor.public.game.lol': 'League of Legends',
      'd.editor.public.game.rivals': 'Marvel Rivals',
      'd.editor.public.game.fortnite': 'Fortnite',
      'd.editor.handle': 'Handle',
      'd.editor.tier': 'Tier',
      'd.editor.division': 'Division',
      'd.editor.proof.self': 'Self Declared',
      'd.editor.proof.connected': 'Account Connected',
      'd.editor.proof.verified': 'Rank Verified',
      'd.editor.experience.first': 'Entry 1',
      'd.editor.experience.second': 'Entry 2',
      'd.editor.experience.third': 'Entry 3',
      'd.editor.experience.role': 'Role',
      'd.editor.experience.org': 'Organization',
      'd.editor.experience.date': 'Date range',
      'd.editor.career.current': 'Current team line',
      'd.editor.career.former': 'Former team line',
      'd.editor.setup.dpi': 'DPI',
      'd.editor.setup.sens': 'Mouse sensitivity',
      'd.editor.setup.fov': 'FOV',
      'd.editor.setup.hz': 'Polling rate (Hz)',
      'd.setup.metric.dpi': 'DPI',
      'd.setup.metric.sens': 'Sens',
      'd.setup.metric.fov': 'FOV',
      'd.setup.metric.hz': 'Polling',
      'd.rank.overwatch.bronze': 'Bronze',
      'd.rank.overwatch.silver': 'Silver',
      'd.rank.overwatch.gold': 'Gold',
      'd.rank.overwatch.platinum': 'Platinum',
      'd.rank.overwatch.diamond': 'Diamond',
      'd.rank.overwatch.master': 'Master',
      'd.rank.overwatch.grandmaster': 'Grandmaster',
      'd.rank.overwatch.champion': 'Champion',
      'd.rank.lol.iron': 'Iron',
      'd.rank.lol.bronze': 'Bronze',
      'd.rank.lol.silver': 'Silver',
      'd.rank.lol.gold': 'Gold',
      'd.rank.lol.platinum': 'Platinum',
      'd.rank.lol.emerald': 'Emerald',
      'd.rank.lol.diamond': 'Diamond',
      'd.rank.lol.master': 'Master',
      'd.rank.lol.grandmaster': 'Grandmaster',
      'd.rank.lol.challenger': 'Challenger',
      'd.rank.fortnite.bronze': 'Bronze',
      'd.rank.fortnite.silver': 'Silver',
      'd.rank.fortnite.gold': 'Gold',
      'd.rank.fortnite.platinum': 'Platinum',
      'd.rank.fortnite.diamond': 'Diamond',
      'd.rank.fortnite.elite': 'Elite',
      'd.rank.fortnite.champion': 'Champion',
      'd.rank.fortnite.unreal': 'Unreal',
      'd.rank.rivals.bronze': 'Bronze',
      'd.rank.rivals.silver': 'Silver',
      'd.rank.rivals.gold': 'Gold',
      'd.rank.rivals.platinum': 'Platinum',
      'd.rank.rivals.diamond': 'Diamond',
      'd.rank.rivals.grandmaster': 'Grandmaster',
      'd.rank.rivals.celestial': 'Celestial',
      'd.rank.rivals.eternity': 'Eternity',
      'd.rank.rivals.oneAboveAll': 'One Above All',
      'd.rank.division.5': '5',
      'd.rank.division.4': '4',
      'd.rank.division.3': '3',
      'd.rank.division.2': '2',
      'd.rank.division.1': '1',
      'd.rank.division.iv': 'IV',
      'd.rank.division.iii': 'III',
      'd.rank.division.ii': 'II',
      'd.rank.division.i': 'I'
    },
    de: {
      'd.a11y.skip': 'Zum Inhalt springen',
      'd.nav.start': 'Start',
      'd.nav.network': 'Netzwerk',
      'd.nav.requests': 'Anfragen',
      'd.nav.explore': 'Explore',
      'd.nav.matches': 'Matches',
      'd.nav.tryouts': 'Tryouts',
      'd.nav.messages': 'Nachrichten',
      'd.nav.notifications': 'Mitteilungen',
      'd.nav.profile': 'Profil',
      'd.toggle.themeDark': 'Theme: Dunkel',
      'd.toggle.themeLight': 'Theme: Hell',
      'd.toggle.motionOn': 'Motion: An',
      'd.toggle.motionOff': 'Motion: Reduziert',
      'd.preview.tag': 'Shinobi Profil',
      'd.preview.tag.live': 'Shinobi Live',
      'd.preview.lock.note': 'Shinobi-Profil ist sichtbar. Für volle Aktionen bitte einloggen.',
      'd.preview.lock.cta': 'Login für vollen Zugriff',
      'd.page.network.title': 'Netzwerk',
      'd.page.network.lead': 'Sieh, wie Shinobi Kontakte, Intros und Beziehungs-Kontext in GameIn organisiert.',
      'd.page.requests.title': 'Anfragen',
      'd.page.requests.lead': 'Durchsuche offene Tryout-Anfragen, empfohlene Fits und gespeicherte Chancen im professionellen Flow.',
      'd.page.messages.title': 'Nachrichten',
      'd.page.messages.lead': 'Thread-Kommunikation, Kontext-Zusammenfassungen und rollenbasierte Zusammenarbeit.',
      'd.page.notifications.title': 'Mitteilungen',
      'd.page.notifications.lead': 'Verfolge Mentions, Request-Updates und Systemhinweise in einer Timeline.',
      'd.module.network.your': 'Dein Netzwerk',
      'd.module.network.pending': 'Offene Einladungen',
      'd.module.network.suggested': 'Personen, die du kennen könntest',
      'd.module.requests.open': 'Offene Anfragen',
      'd.module.requests.recommended': 'Empfohlene Fits',
      'd.module.requests.saved': 'Gespeicherte Chancen',
      'd.module.messages.threads': 'Thread-Liste',
      'd.module.messages.preview': 'Konversation',
      'd.module.messages.compose': 'Verfassen',
      'd.module.notifications.mentions': 'Mentions',
      'd.module.notifications.updates': 'Request-Updates',
      'd.module.notifications.system': 'Systemhinweise',
      'd.action.addConnection': 'Kontakt hinzufügen',
      'd.action.accept': 'Einladung annehmen',
      'd.action.message': 'Nachricht senden',
      'd.action.apply': 'Bewerben',
      'd.action.createRequest': 'Anfrage erstellen',
      'd.action.unlockContact': 'Kontakt freischalten',
      'd.action.send': 'Nachricht senden',
      'd.action.attach': 'Datei anhängen',
      'd.action.startThread': 'Neuen Thread starten',
      'd.action.markAllRead': 'Alle als gelesen markieren',
      'd.action.openThread': 'Vollen Thread öffnen',
      'd.action.managePrefs': 'Einstellungen verwalten',
      'd.messages.sample.one': 'Shinobi, kannst du heute um 20:00 CET beim Rollen-Tryout dabei sein?',
      'd.messages.sample.two': 'Bestätigt. Ich bringe zwei VOD-Clips aus den Scrims der letzten Woche mit.',
      'd.messages.sample.three': 'Perfekt. Lobby-Details sende ich nach dem Captain-Review.',
      'd.messages.compose.placeholder': 'Nachrichtenentwurf für den Vorschau-Thread schreiben.',
      'd.notifications.item.one': 'Dein Profil wurde im Anfrage-Thread von Vienna Ascend erwähnt.',
      'd.notifications.item.two': 'FaZe Academy hat den benötigten Rank von Diamond auf Master erhöht.',
      'd.notifications.item.three': 'Vorschau-Modus aktiv: Login schaltet Nachrichten, Einladungen und Workflows frei.',
      'd.network.meta.self': 'EU · Flex DPS · Overwatch',
      'd.network.meta.valk': 'Support · Master 3 · 42 gemeinsame Scrims',
      'd.network.meta.arc': 'Scout · Marvel Rivals · Wochenende verfügbar',
      'd.network.meta.pending.one': 'Eingehend · Tank + Support Trial-Squad · 19:00 CET',
      'd.network.meta.pending.two': 'Eingehend · Marvel Rivals Scrim-Cluster · Di/Do',
      'd.network.meta.pending.three': 'Ausgehend · Follow-up Intro angefragt',
      'd.network.meta.suggested.one': 'Team Managerin · FaZe Academy · Gemeinsamer Org-Kontext',
      'd.network.meta.suggested.two': 'Head Coach · Vienna Ascend · Sucht Shot-Calling-Struktur',
      'd.network.meta.suggested.three': 'Overwatch · Grandmaster · Team Liquid Alumni Circuit',
      'd.requests.meta.open.one': 'Gesucht: Support + Tank · Mindest-Rank: Master · Di 20:00 CET',
      'd.requests.meta.open.two': 'Gesucht: Scout · Regionales Scrim-Cluster · Do 19:30 CET',
      'd.requests.meta.open.three': 'Gesucht: Jungle · Mindest-Rank: Diamond · Wochenend-Block',
      'd.requests.meta.reco.one': 'Shinobis Profil passt zu Overwatch Flex-DPS-Tryout-Anforderungen.',
      'd.requests.meta.reco.two': 'Abendliche Verfügbarkeit passt zu Mo/Mi/Fr Trainingsblöcken.',
      'd.requests.meta.reco.titleOne': 'Rollen-Fit: 92%',
      'd.requests.meta.reco.titleTwo': 'Zeitplan-Fit: 88%',
      'd.requests.meta.saved.one': 'Vor zwei Tagen gespeichert · Follow-up ausstehend',
      'd.requests.meta.saved.two': 'Gestern gespeichert · Kontakt noch gesperrt',
      'd.messages.meta.thread.one': 'Tryout-Vorbereitung · 4 ungelesen · Aktualisiert 08:42',
      'd.messages.meta.thread.two': 'Roster-Review · 2 ungelesen · Aktualisiert gestern',
      'd.messages.meta.thread.three': 'Intro-Thread · 1 ungelesen · Aktualisiert vor 2 Tagen',
      'd.messages.field.to': 'An',
      'd.messages.field.draft': 'Entwurf',
      'd.notifications.meta.mentions.two': '3 Profilaufrufe · 1 direkte Mention · Letzte 24h',
      'd.notifications.meta.updates.oneTitle': 'Rank-Anforderung aktualisiert',
      'd.notifications.meta.updates.twoTitle': 'Tryout-Slot verschoben',
      'd.notifications.meta.updates.twoText': 'Cloud 25 hat den Donnerstag-Block auf 20:30 CET verschoben',
      'd.notifications.meta.system.oneTitle': 'Vorschau-Modus',
      'd.notifications.meta.system.twoTitle': 'Profil-Proof-Status',
      'd.notifications.meta.system.twoText': 'Connected-Account-Badges sind sichtbar, Rank-Verifikation wird im Early Access ausgebaut.',
      'd.hero.badge': 'GameIn',
      'd.hero.title': 'Von Solo-Queue zu einem echten Team.',
      'd.hero.lead': 'Finde verifizierte Spieler und Teams in Overwatch, LoL, Fortnite und Marvel Rivals. Schnell vergleichen. Tryouts einfach machen.',
      'd.hero.ctaPlayer': 'Ich bin ein Spieler',
      'd.hero.ctaTeam': 'Ich bin ein Team',
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
      'd.game.rivals': 'Marvel Rivals',
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
      'd.country.de': 'Deutschland',
      'd.country.at': 'Österreich',
      'd.country.ch': 'Schweiz',
      'd.country.us': 'Vereinigte Staaten',
      'd.country.ca': 'Kanada',
      'd.country.gb': 'Vereinigtes Königreich',
      'd.country.fr': 'Frankreich',
      'd.country.es': 'Spanien',
      'd.country.it': 'Italien',
      'd.country.nl': 'Niederlande',
      'd.country.be': 'Belgien',
      'd.country.pl': 'Polen',
      'd.country.cz': 'Tschechien',
      'd.country.ro': 'Rumänien',
      'd.country.tr': 'Türkei',
      'd.country.ua': 'Ukraine',
      'd.country.se': 'Schweden',
      'd.country.no': 'Norwegen',
      'd.country.dk': 'Dänemark',
      'd.country.fi': 'Finnland',
      'd.country.pt': 'Portugal',
      'd.country.br': 'Brasilien',
      'd.country.ar': 'Argentinien',
      'd.country.mx': 'Mexiko',
      'd.country.jp': 'Japan',
      'd.country.kr': 'Südkorea',
      'd.country.cn': 'China',
      'd.country.in': 'Indien',
      'd.country.au': 'Australien',
      'd.country.nz': 'Neuseeland',
      'd.country.za': 'Südafrika',
      'd.schedule.monWedFri': 'Mo/Mi/Fr',
      'd.schedule.tueThu': 'Di/Do',
      'd.proof.rankVerified': 'Rank verifiziert',
      'd.proof.accountConnected': 'Account verbunden',
      'd.proof.selfDeclared': 'Selbst angegeben',
      'd.compare.title': 'Vergleich (max 2)',
      'd.compare.clear': 'Leeren',
      'd.compare.empty': 'Wähle bis zu 2 Spieler für Rollen-, Rank-, Proof-, Herkunftsland- und Verfügbarkeitsvergleich.',
      'd.compare.invite': 'Ausgewählte einladen',
      'd.empty': 'Keine Ergebnisse für diese Filter.',
      'd.legal.privacy': 'Datenschutz',
      'd.legal.terms': 'AGB',
      'd.toast.comingSoon': 'Bald verfügbar.',
      'd.toast.tryoutsSoon': 'Tryouts kommen bald.',
      'd.toast.messagesSoon': 'Nachrichten kommen bald.',
      'd.toast.maxCompare': 'Du kannst maximal 2 Spieler vergleichen.',
      'd.toast.error.generic': 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',
      'd.invite.title': 'Zum Tryout einladen',
      'd.invite.game': 'Spiel',
      'd.invite.role': 'Gesuchte / angebotene Rolle',
      'd.invite.slot': 'Vorgeschlagener Slot',
      'd.invite.notes': 'Notizen',
      'd.invite.submit': 'Tryout-Anfrage senden',
      'd.invite.submitting': 'Wird gesendet...',
      'd.invite.success': 'Tryout-Anfrage gesendet. Du wirst benachrichtigt, sobald Early Access startet.',
      'd.connect.title': 'Account verbinden',
      'd.connect.lead': 'Wähle einen Provider, um Ownership zu bestätigen und Trust-Signale zu verbessern.',
      'd.connect.connecting': 'Verbinde...',
      'd.connect.success': 'Verbindung gespeichert. Verifikation wird im Early Access erweitert.',
      'd.modal.close': 'Schließen',
      'd.card.region': 'Region',
      'd.card.country': 'Herkunftsland',
      'd.card.availability': 'Verfügbarkeit',
      'd.card.invite': 'Einladen',
      'd.card.compare': 'Vergleichen',
      'd.card.remove': 'Entfernen',
      'd.card.open': 'Profil öffnen',
      'd.card.apply': 'Bewerben / Tryout anfragen',
      'd.compare.row.role': 'Rolle',
      'd.compare.row.rank': 'Rank',
      'd.compare.row.proof': 'Proof',
      'd.compare.row.country': 'Herkunftsland',
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
      'd.proof.tooltip.self': 'Selbst angegebene Daten, noch nicht verifiziert.',
      'd.profile.headline': 'Flex DPS mit Fokus auf Teamstrukturen, klare Comms und messbare Verbesserung.',
      'd.profile.about': 'Bekannt für ruhige Mid-Round-Kommunikation, Rollenflexibilität über Meta-Wechsel hinweg und konstante VOD-Reviews.',
      'd.profile.about.short': 'Proof-first Gaming-Identität mit Referenzen, Karriereverlauf und Tryout-Kontext.',
      'd.profile.country.label': 'Herkunftsland',
      'd.experience.title': 'Erfahrung',
      'd.experience.one.role': 'Flex DPS',
      'd.experience.one.org': 'FaZe Academy · Aktives Roster',
      'd.experience.one.date': '2025 - Heute',
      'd.experience.two.role': 'Starter Support',
      'd.experience.two.org': 'Team Liquid Community Division',
      'd.experience.two.date': '2023 - 2025',
      'd.experience.three.role': 'Scrim Captain',
      'd.experience.three.org': 'EU Contenders Mix',
      'd.experience.three.date': '2022 - 2023',
      'd.references.title': 'Referenzen',
      'd.references.one.name': 'Kai "Vector" Neumann',
      'd.references.one.meta': 'Head Coach · Vienna Ascend',
      'd.references.one.text': 'Zuverlässig in Review-Zyklen und passt sich schnell an strategisches Feedback an.',
      'd.references.two.name': 'Mila "Astra" Hoffmann',
      'd.references.two.meta': 'Team Managerin · FaZe Academy',
      'd.references.two.text': 'Starker Teammate mit konstanter Verfügbarkeit und klarer Match-Kommunikation.',
      'd.network.open.intro': 'Intro anfragen',
      'd.network.open.reference': 'Referenz hinzufügen',
      'd.network.title': 'Professionelles Networking',
      'd.network.tab.intro': 'Intro anfragen',
      'd.network.tab.reference': 'Referenz hinzufügen',
      'd.network.intro.org.label': 'Team / Organisation',
      'd.network.intro.org.placeholder': 'z. B. Team Liquid Academy',
      'd.network.intro.role.label': 'Gesuchte Rolle',
      'd.network.intro.role.placeholder': 'z. B. Flex DPS für Abend-Scrims',
      'd.network.intro.message.label': 'Nachricht',
      'd.network.intro.message.placeholder': 'Teile den Kontext für die Intro-Anfrage.',
      'd.network.reference.role.label': 'Deine Rolle',
      'd.network.reference.role.placeholder': 'z. B. Coach, Teamleitung, Analyst',
      'd.network.reference.relationship.label': 'Beziehung',
      'd.network.reference.relationship.placeholder': 'z. B. Eine Season zusammen gespielt',
      'd.network.reference.text.label': 'Referenztext',
      'd.network.reference.text.placeholder': 'Schreibe eine kurze Referenz.',
      'd.network.submit.intro': 'Intro-Anfrage senden',
      'd.network.submit.reference': 'Referenz übermitteln',
      'd.network.submitting': 'Wird gesendet...',
      'd.network.success': 'Anfrage gesendet. Du wirst benachrichtigt, sobald Early Access startet.',
      'd.toast.networkCaptured': 'Anfrage gesendet.',
      'd.auth.open.register': 'Registrieren',
      'd.auth.open.login': 'Login',
      'd.auth.entry.online': 'Shinobi · Online',
      'd.auth.status.online': 'Online',
      'd.auth.entry.logoutHint': 'Account-Menü öffnen',
      'd.auth.loggedOut': 'Ausgeloggt.',
      'd.account.menu.title': 'Shinobi',
      'd.account.menu.manageAccount': 'Konto verwalten',
      'd.account.menu.manageProfile': 'Profil verwalten',
      'd.account.menu.logout': 'Ausloggen',
      'd.account.manage.coming': 'Konto-Einstellungen kommen bald.',
      'd.account.profile.coming': 'Profilverwaltung öffnet im Profilbereich.',
      'd.account.logout.confirm': 'Möchtest du dich jetzt abmelden?',
      'd.auth.title.register': 'Konto erstellen',
      'd.auth.title.login': 'In dein Konto einloggen',
      'd.auth.lead': 'Login gibt vollen Zugriff. Registrierung führt weiter zur Warteliste.',
      'd.auth.tab.register': 'Registrieren',
      'd.auth.tab.login': 'Login',
      'd.auth.field.email': 'E-Mail',
      'd.auth.field.loginId': 'E-Mail oder Benutzername',
      'd.auth.field.password': 'Passwort',
      'd.auth.placeholder.email': 'du@beispiel.de',
      'd.auth.placeholder.loginId': 'E-Mail oder Benutzernamen eingeben',
      'd.auth.placeholder.password': 'Mindestens 6 Zeichen',
      'd.auth.submit.register': 'Registrieren und fortfahren',
      'd.auth.submit.login': 'Einloggen',
      'd.auth.submitting': 'Bitte warten...',
      'd.auth.success': 'Authentifizierung abgeschlossen.',
      'd.auth.success.login': 'Erfolgreich eingeloggt.',
      'd.auth.error.invalid': 'E-Mail/Benutzername oder Passwort ist ungültig.',
      'd.auth.error.exists': 'Ein Konto mit dieser E-Mail existiert bereits.',
      'd.auth.continueWaitlist': 'Weiter zur Warteliste...',
      'd.edit.tooltip': 'Bearbeiten',
      'd.edit.section.public': 'Public Profile',
      'd.edit.section.experience': 'Erfahrung',
      'd.edit.section.career': 'Karriere',
      'd.edit.section.setup': 'Pro Setup',
      'd.editor.title': 'Profil bearbeiten',
      'd.editor.save': 'Änderungen speichern',
      'd.editor.saving': 'Speichert...',
      'd.editor.cancel': 'Abbrechen',
      'd.editor.saved': 'Profil gespeichert.',
      'd.editor.public.displayName': 'Anzeigename',
      'd.editor.public.role': 'Rolle',
      'd.editor.public.country': 'Herkunftsland',
      'd.editor.public.headline': 'Professional Headline',
      'd.editor.public.about': 'Über mich',
      'd.editor.public.proofStatus': 'Proof-Status',
      'd.editor.public.mainGame': 'Hauptspiel',
      'd.editor.public.game.overwatch': 'Overwatch',
      'd.editor.public.game.lol': 'League of Legends',
      'd.editor.public.game.rivals': 'Marvel Rivals',
      'd.editor.public.game.fortnite': 'Fortnite',
      'd.editor.handle': 'Handle',
      'd.editor.tier': 'Tier',
      'd.editor.division': 'Division',
      'd.editor.proof.self': 'Selbst angegeben',
      'd.editor.proof.connected': 'Account verbunden',
      'd.editor.proof.verified': 'Rank verifiziert',
      'd.editor.experience.first': 'Eintrag 1',
      'd.editor.experience.second': 'Eintrag 2',
      'd.editor.experience.third': 'Eintrag 3',
      'd.editor.experience.role': 'Rolle',
      'd.editor.experience.org': 'Organisation',
      'd.editor.experience.date': 'Zeitraum',
      'd.editor.career.current': 'Aktuelles Team',
      'd.editor.career.former': 'Ehemaliges Team',
      'd.editor.setup.dpi': 'DPI',
      'd.editor.setup.sens': 'Mouse-Sensitivität',
      'd.editor.setup.fov': 'FOV',
      'd.editor.setup.hz': 'Polling-Rate (Hz)',
      'd.setup.metric.dpi': 'DPI',
      'd.setup.metric.sens': 'Sens',
      'd.setup.metric.fov': 'FOV',
      'd.setup.metric.hz': 'Polling',
      'd.rank.overwatch.bronze': 'Bronze',
      'd.rank.overwatch.silver': 'Silber',
      'd.rank.overwatch.gold': 'Gold',
      'd.rank.overwatch.platinum': 'Platin',
      'd.rank.overwatch.diamond': 'Diamant',
      'd.rank.overwatch.master': 'Master',
      'd.rank.overwatch.grandmaster': 'Grandmaster',
      'd.rank.overwatch.champion': 'Champion',
      'd.rank.lol.iron': 'Eisen',
      'd.rank.lol.bronze': 'Bronze',
      'd.rank.lol.silver': 'Silber',
      'd.rank.lol.gold': 'Gold',
      'd.rank.lol.platinum': 'Platin',
      'd.rank.lol.emerald': 'Smaragd',
      'd.rank.lol.diamond': 'Diamant',
      'd.rank.lol.master': 'Master',
      'd.rank.lol.grandmaster': 'Grandmaster',
      'd.rank.lol.challenger': 'Challenger',
      'd.rank.fortnite.bronze': 'Bronze',
      'd.rank.fortnite.silver': 'Silber',
      'd.rank.fortnite.gold': 'Gold',
      'd.rank.fortnite.platinum': 'Platin',
      'd.rank.fortnite.diamond': 'Diamant',
      'd.rank.fortnite.elite': 'Elite',
      'd.rank.fortnite.champion': 'Champion',
      'd.rank.fortnite.unreal': 'Unreal',
      'd.rank.rivals.bronze': 'Bronze',
      'd.rank.rivals.silver': 'Silber',
      'd.rank.rivals.gold': 'Gold',
      'd.rank.rivals.platinum': 'Platin',
      'd.rank.rivals.diamond': 'Diamant',
      'd.rank.rivals.grandmaster': 'Grandmaster',
      'd.rank.rivals.celestial': 'Celestial',
      'd.rank.rivals.eternity': 'Eternity',
      'd.rank.rivals.oneAboveAll': 'One Above All',
      'd.rank.division.5': '5',
      'd.rank.division.4': '4',
      'd.rank.division.3': '3',
      'd.rank.division.2': '2',
      'd.rank.division.1': '1',
      'd.rank.division.iv': 'IV',
      'd.rank.division.iii': 'III',
      'd.rank.division.ii': 'II',
      'd.rank.division.i': 'I'
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

  function renderAuthEntry() {
    document.querySelectorAll('.auth-entry').forEach((button) => {
      if (state.isAuthenticated && state.authUser) {
        button.textContent = getAuthOnlineLabel(state.authUser);
        button.removeAttribute('data-d18n');
        button.setAttribute('title', t('d.auth.entry.logoutHint'));
        button.dataset.authState = 'online';
        return;
      }

      button.dataset.d18n = 'd.auth.open.login';
      button.textContent = t('d.auth.open.login');
      button.removeAttribute('title');
      button.dataset.authState = 'guest';
    });
  }

  function renderPreviewStateTags() {
    const key = state.isAuthenticated ? 'd.preview.tag.live' : 'd.preview.tag';
    document.querySelectorAll('.preview-tag').forEach((node) => {
      node.dataset.d18n = key;
      node.textContent = t(key);
    });
  }

  function getAccountMenu() {
    return document.getElementById('accountMenu');
  }

  function closeAccountMenu() {
    const menu = getAccountMenu();
    if (!menu) {
      return;
    }
    menu.classList.add('hidden');
    menu.setAttribute('aria-hidden', 'true');
  }

  function renderAccountMenuContent() {
    const menu = getAccountMenu();
    if (!menu) {
      return;
    }

    const title = menu.querySelector('[data-account-menu="title"]');
    const manageAccount = menu.querySelector('[data-account-action="manage-account"]');
    const manageProfile = menu.querySelector('[data-account-action="manage-profile"]');
    const logout = menu.querySelector('[data-account-action="logout"]');

    if (title) title.textContent = (state.authUser && state.authUser.handle) ? state.authUser.handle : t('d.account.menu.title');
    if (manageAccount) manageAccount.textContent = t('d.account.menu.manageAccount');
    if (manageProfile) manageProfile.textContent = t('d.account.menu.manageProfile');
    if (logout) logout.textContent = t('d.account.menu.logout');
  }

  function ensureAccountMenu() {
    let menu = getAccountMenu();
    if (menu) {
      return menu;
    }

    menu = document.createElement('div');
    menu.id = 'accountMenu';
    menu.className = 'account-menu hidden';
    menu.setAttribute('role', 'menu');
    menu.setAttribute('aria-hidden', 'true');
    menu.innerHTML = [
      '<div class="account-menu-title" data-account-menu="title"></div>',
      '<button type="button" class="account-menu-item" data-account-action="manage-account"></button>',
      '<button type="button" class="account-menu-item" data-account-action="manage-profile"></button>',
      '<div class="account-menu-divider"></div>',
      '<button type="button" class="account-menu-item danger" data-account-action="logout"></button>'
    ].join('');

    document.body.appendChild(menu);
    renderAccountMenuContent();

    menu.querySelectorAll('[data-account-action]').forEach((button) => {
      button.addEventListener('click', () => {
        const action = button.dataset.accountAction;
        if (action === 'manage-account') {
          closeAccountMenu();
          showToast('d.account.manage.coming');
          return;
        }

        if (action === 'manage-profile') {
          closeAccountMenu();
          const profile = document.getElementById('profile');
          if (profile) {
            profile.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (state.isAuthenticated) {
              window.setTimeout(() => {
                openProfileEditorModal('public');
              }, 180);
            }
            return;
          }
          window.location.href = 'index.html#profile';
          return;
        }

        if (action === 'logout') {
          const shouldLogout = window.confirm(t('d.account.logout.confirm'));
          if (!shouldLogout) {
            return;
          }
          const currentUser = state.authUser;
          closeAccountMenu();
          clearAuthenticatedUser();
          track('logout', { username: currentUser ? currentUser.username : '' });
          showToast('d.auth.loggedOut');
        }
      });
    });

    document.addEventListener('pointerdown', (event) => {
      const authButton = event.target.closest('.auth-entry');
      if (authButton && authButton.dataset.authState === 'online') {
        return;
      }
      if (!menu.contains(event.target)) {
        closeAccountMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeAccountMenu();
      }
    });

    window.addEventListener('resize', closeAccountMenu);
    window.addEventListener('scroll', closeAccountMenu, true);

    return menu;
  }

  function openAccountMenu(anchor) {
    const menu = ensureAccountMenu();
    const rect = anchor.getBoundingClientRect();
    const width = 240;
    const left = Math.max(10, Math.min(window.innerWidth - width - 10, rect.right - width));
    const top = rect.bottom + 8;

    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
    menu.classList.remove('hidden');
    menu.setAttribute('aria-hidden', 'false');
  }

  function toggleAccountMenu(anchor) {
    const menu = ensureAccountMenu();
    const isOpen = !menu.classList.contains('hidden');
    if (isOpen) {
      closeAccountMenu();
      return;
    }
    openAccountMenu(anchor);
  }

  function applyAuthVisualState() {
    if (!document.body) {
      return;
    }
    document.body.classList.toggle('is-authenticated', state.isAuthenticated);
    document.body.dataset.previewState = state.isAuthenticated ? 'live' : 'preview';
    if (!state.isAuthenticated) {
      closeAccountMenu();
      closeProfileEditorModal();
    } else {
      ensureAccountMenu();
      renderAccountMenuContent();
    }
    renderProfileEditorControls();
    renderAuthEntry();
    renderPreviewStateTags();
  }

  function isValidLogin(username, password) {
    return Boolean(findAuthUserByCredentials(username, password));
  }

  function setAuthenticatedUser(user) {
    const resolvedUser = user || findAuthUserByIdentity(DEFAULT_AUTH_USER.username);
    if (!resolvedUser) {
      return;
    }
    state.isAuthenticated = true;
    state.authUser = toPublicAuthUser(resolvedUser);
    persistAuthSession();
    applyAuthVisualState();
  }

  function clearAuthenticatedUser() {
    state.isAuthenticated = false;
    state.authUser = null;
    persistAuthSession();
    applyAuthVisualState();
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

    syncExploreRoleFilterOptions();
    syncExploreRankFilterOptions();

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

    applyAuthVisualState();
    applyProfileEditorI18n();
    applyProfileStateToDOM();
  }

  function showToast(messageKeyOrText, tone) {
    const node = document.getElementById('uiNotice');
    if (!node) {
      return;
    }

    const text = messageKeyOrText && messageKeyOrText.startsWith && messageKeyOrText.startsWith('d.') ? t(messageKeyOrText) : messageKeyOrText;
    const normalizedTone = tone === 'error' ? 'error' : tone === 'success' ? 'success' : 'success';
    node.textContent = text || '';
    node.classList.remove('success', 'error');
    node.classList.add(normalizedTone);
    node.classList.remove('hidden');

    window.clearTimeout(showToast._timer);
    showToast._timer = window.setTimeout(() => {
      node.classList.add('hidden');
    }, 1800);
  }

  function setButtonLoading(button, isLoading, loadingLabel) {
    if (!button) {
      return;
    }

    if (isLoading) {
      if (!button.dataset.defaultLabel) {
        button.dataset.defaultLabel = button.textContent;
      }
      if (!button.dataset.defaultDisabled) {
        button.dataset.defaultDisabled = button.disabled ? '1' : '0';
      }
      button.classList.add('is-loading');
      button.disabled = true;
      button.setAttribute('aria-busy', 'true');
      if (loadingLabel) {
        button.textContent = loadingLabel;
      }
      return;
    }

    button.classList.remove('is-loading');
    button.removeAttribute('aria-busy');
    if (button.dataset.defaultLabel) {
      button.textContent = button.dataset.defaultLabel;
      delete button.dataset.defaultLabel;
    }
    const wasDisabled = button.dataset.defaultDisabled === '1';
    button.disabled = wasDisabled;
    delete button.dataset.defaultDisabled;
  }

  function getCurrentPage() {
    const page = document.body ? document.body.dataset.page : '';
    if (!page) {
      return 'start';
    }
    return page;
  }

  function initNavigationState() {
    const activePage = getCurrentPage();
    document.querySelectorAll('[data-nav]').forEach((node) => {
      const isActive = node.dataset.nav === activePage;
      node.classList.toggle('active', isActive);
      if (isActive) {
        node.setAttribute('aria-current', 'page');
      } else {
        node.removeAttribute('aria-current');
      }
    });
  }

  function trackPageView() {
    const page = getCurrentPage();
    const eventByPage = {
      start: 'view_landing',
      network: 'view_network_page',
      requests: 'view_requests_page',
      messages: 'view_messages_page',
      notifications: 'view_notifications_page'
    };
    const event = eventByPage[page] || 'view_landing';
    track(event, { page });

    if (page === 'start' && document.getElementById('resultList')) {
      track('view_explore_players', {});
    }
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

  function getCountryI18nKey(countryCode) {
    const normalized = String(countryCode || '').trim().toUpperCase();
    return COUNTRY_I18N_KEYS[normalized] || '';
  }

  function formatCountry(countryCode) {
    const normalized = String(countryCode || '').trim().toUpperCase();
    const key = getCountryI18nKey(normalized);
    if (key) {
      return t(key);
    }
    return normalized || '-';
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

  function getExploreRoleOptions() {
    if (state.game === GAME_IDS.OVERWATCH) {
      return ['Any', 'Tank', 'DPS', 'Support'];
    }
    return ['Any'].concat(EXPLORE_ROLE_OPTIONS);
  }

  function syncExploreRoleFilterOptions() {
    const roleFilter = document.getElementById('roleFilter');
    if (!roleFilter) {
      return;
    }

    const options = getExploreRoleOptions();
    setSelectOptions(roleFilter, options, (value) => {
      if (value === 'Any') {
        return t('d.filter.any');
      }
      return formatRole(value);
    });

    const isValidSelection = options.includes(state.role);
    state.role = isValidSelection ? state.role : 'Any';
    roleFilter.value = state.role;

    if (typeof roleFilter._uspecRebuildMenu === 'function') {
      roleFilter._uspecRebuildMenu();
    }
  }

  function getProfileGameKeyFromExploreGame(gameName) {
    const normalized = normalizeGameId(gameName, '');
    return ALLOWED_GAME_IDS.includes(normalized) ? normalized : '';
  }

  function extractTierFromExploreRank(gameKey, rankValue) {
    const rankConfig = PROFILE_RANKS[gameKey];
    if (!rankConfig) {
      return '';
    }
    const normalizedRank = String(rankValue || '').toLowerCase();
    if (!normalizedRank || normalizedRank === 'n/a') {
      return '';
    }

    const sortedTiers = rankConfig.tiers.slice().sort((a, b) => b.length - a.length);
    const matchedTier = sortedTiers.find((tier) => normalizedRank.includes(tier.toLowerCase()));
    return matchedTier || '';
  }

  function getExploreRankFilterGameKey() {
    if (state.game === GAME_IDS.ANY) {
      return '';
    }
    return getProfileGameKeyFromExploreGame(state.game);
  }

  function syncExploreRankFilterOptions() {
    const rankFilter = document.getElementById('rankFilter');
    if (!rankFilter) {
      return;
    }

    const gameKey = getExploreRankFilterGameKey();
    const supportsRankCatalog = Boolean(gameKey && PROFILE_RANKS[gameKey]);
    const options = supportsRankCatalog ? ['Any'].concat(PROFILE_RANKS[gameKey].tiers) : ['Any'];

    setSelectOptions(rankFilter, options, (value) => {
      if (value === 'Any') {
        return t('d.filter.any');
      }
      const tierKey = getRankTierKey(gameKey, value);
      return tierKey ? t(tierKey) : value;
    });

    rankFilter.disabled = !supportsRankCatalog;
    const isValidSelection = options.includes(state.rank);
    state.rank = isValidSelection ? state.rank : 'Any';
    rankFilter.value = state.rank;

    const wrap = rankFilter.closest('.select-wrap');
    if (wrap) {
      wrap.classList.toggle('is-disabled', rankFilter.disabled);
    }
    const arrow = wrap ? wrap.querySelector(`[data-select-toggle="${rankFilter.id}"]`) : null;
    if (arrow) {
      arrow.disabled = rankFilter.disabled;
      arrow.setAttribute('aria-disabled', String(rankFilter.disabled));
    }

    if (typeof rankFilter._uspecRebuildMenu === 'function') {
      rankFilter._uspecRebuildMenu();
    }
  }

  function getRankTierKey(gameKey, tier) {
    const raw = String(tier || '').trim();
    if (!raw) {
      return '';
    }
    if (raw === 'One Above All') {
      return `d.rank.${gameKey}.oneAboveAll`;
    }
    return `d.rank.${gameKey}.${raw.toLowerCase()}`;
  }

  function getDivisionKey(division) {
    const normalized = String(division || '').trim();
    if (!normalized) {
      return '';
    }
    return `d.rank.division.${normalized.toLowerCase()}`;
  }

  function formatRankDisplay(gameKey, gameState) {
    const rankConfig = PROFILE_RANKS[gameKey];
    if (!rankConfig || !gameState) {
      return '-';
    }

    const tierKey = getRankTierKey(gameKey, gameState.tier);
    const tierLabel = tierKey ? t(tierKey) : String(gameState.tier || '-');
    const supportsDivision = rankConfig.allowsDivision(gameState.tier);
    if (!supportsDivision) {
      return tierLabel;
    }

    const division = String(gameState.division || '').trim();
    if (!division) {
      return tierLabel;
    }

    const divisionKey = getDivisionKey(division);
    const divisionLabel = divisionKey ? t(divisionKey) : division;
    return `${tierLabel} ${divisionLabel}`;
  }

  function formatGameLine(gameKey, handle) {
    const normalizedHandle = sanitizeTextValue(handle, '-', 64);
    if (gameKey === 'overwatch') {
      return `${t('d.game.overwatch')} · ${normalizedHandle}`;
    }
    if (gameKey === 'lol') {
      return `${t('d.editor.public.game.lol')} · ${normalizedHandle}`;
    }
    if (gameKey === 'rivals') {
      return `${t('d.editor.public.game.rivals')} · ${normalizedHandle}`;
    }
    if (gameKey === 'fortnite') {
      return `${t('d.game.fortnite')} · ${normalizedHandle}`;
    }
    return normalizedHandle;
  }

  function getOrderedGameKeys(mainGame) {
    const all = ['overwatch', 'lol', 'rivals', 'fortnite'];
    const selected = all.includes(mainGame) ? mainGame : 'overwatch';
    return [selected].concat(all.filter((entry) => entry !== selected));
  }

  function applyGameRowOrder(scope, mainGame) {
    const container = document.querySelector(`[data-profile-games="${scope}"]`);
    if (!container) {
      return;
    }

    const rowsByGame = {};
    container.querySelectorAll('[data-profile-game-row]').forEach((row) => {
      rowsByGame[row.dataset.profileGameRow] = row;
    });

    getOrderedGameKeys(mainGame).forEach((gameKey) => {
      const row = rowsByGame[gameKey];
      if (row) {
        container.appendChild(row);
      }
    });
  }

  function setProfileField(field, value) {
    document.querySelectorAll(`[data-profile-field="${field}"]`).forEach((node) => {
      node.textContent = value;
    });
  }

  function applyProfileStateToDOM() {
    const normalized = normalizeProfileState(state.profile);
    state.profile = normalized;

    const profile = normalized.publicProfile;
    setProfileField('public.displayName', profile.displayName);
    setProfileField('public.role', profile.role);
    setProfileField('public.country', formatCountry(profile.country));
    setProfileField('public.headline', profile.headline);
    setProfileField('public.about', profile.about);
    setProfileField('hero.displayName', profile.displayName);
    setProfileField('hero.role', profile.role);
    setProfileField('hero.country', formatCountry(profile.country));

    setProfileField('public.game.overwatch', formatGameLine('overwatch', profile.games.overwatch.handle));
    setProfileField('public.game.lol', formatGameLine('lol', profile.games.lol.handle));
    setProfileField('public.game.rivals', formatGameLine('rivals', profile.games.rivals.handle));
    setProfileField('public.game.fortnite', formatGameLine('fortnite', profile.games.fortnite.handle));
    setProfileField('hero.game.overwatch', formatGameLine('overwatch', profile.games.overwatch.handle));
    setProfileField('hero.game.lol', formatGameLine('lol', profile.games.lol.handle));
    setProfileField('hero.game.rivals', formatGameLine('rivals', profile.games.rivals.handle));
    setProfileField('hero.game.fortnite', formatGameLine('fortnite', profile.games.fortnite.handle));

    setProfileField('public.rank.overwatch', formatRankDisplay('overwatch', profile.games.overwatch));
    setProfileField('public.rank.lol', formatRankDisplay('lol', profile.games.lol));
    setProfileField('public.rank.rivals', formatRankDisplay('rivals', profile.games.rivals));
    setProfileField('public.rank.fortnite', formatRankDisplay('fortnite', profile.games.fortnite));
    applyGameRowOrder('public', profile.mainGame);
    applyGameRowOrder('hero', profile.mainGame);

    setProfileField('career.current', normalized.career.currentTeamText);
    setProfileField('career.former', normalized.career.formerTeamText);
    setProfileField('hero.career.current', normalized.career.currentTeamText);
    setProfileField('hero.career.former', normalized.career.formerTeamText);

    normalized.experience.forEach((entry, index) => {
      const row = index + 1;
      setProfileField(`experience.${row}.role`, entry.role);
      setProfileField(`experience.${row}.org`, entry.org);
      setProfileField(`experience.${row}.date`, entry.date);
    });

    setProfileField('setup.dpi', `${t('d.setup.metric.dpi')} ${normalized.setup.dpi}`);
    setProfileField('setup.sens', `${t('d.setup.metric.sens')} ${normalized.setup.sens}`);
    setProfileField('setup.hz', `${t('d.setup.metric.hz')} ${normalized.setup.hz} Hz`);
    setProfileField('setup.fov', `${t('d.setup.metric.fov')} ${normalized.setup.fov}`);

    const proof = mapProof(profile.proofStatus);
    setProfileField('public.proof', proof.label);
    setProfileField('hero.proof', proof.label);
    document.querySelectorAll('[data-profile-proof]').forEach((badge) => {
      badge.classList.remove('rank', 'connected', 'self');
      badge.classList.add(proof.cls);
      badge.setAttribute('title', proof.tooltip);
    });
  }

  function getProfileEditorInputs() {
    return {
      displayName: document.getElementById('editorDisplayName'),
      role: document.getElementById('editorRole'),
      country: document.getElementById('editorCountry'),
      headline: document.getElementById('editorHeadline'),
      about: document.getElementById('editorAbout'),
      proofStatus: document.getElementById('editorProofStatus'),
      mainGame: document.getElementById('editorMainGame'),
      owHandle: document.getElementById('editorOwHandle'),
      owTier: document.getElementById('editorOwTier'),
      owDivision: document.getElementById('editorOwDivision'),
      owDivisionWrap: document.getElementById('editorOwDivisionWrap'),
      lolHandle: document.getElementById('editorLolHandle'),
      lolTier: document.getElementById('editorLolTier'),
      lolDivision: document.getElementById('editorLolDivision'),
      lolDivisionWrap: document.getElementById('editorLolDivisionWrap'),
      rivalsHandle: document.getElementById('editorRivalsHandle'),
      rivalsTier: document.getElementById('editorRivalsTier'),
      fortniteHandle: document.getElementById('editorFortniteHandle'),
      fortniteTier: document.getElementById('editorFortniteTier'),
      fortniteDivision: document.getElementById('editorFortniteDivision'),
      fortniteDivisionWrap: document.getElementById('editorFortniteDivisionWrap'),
      exp1Role: document.getElementById('editorExperience1Role'),
      exp1Org: document.getElementById('editorExperience1Org'),
      exp1Date: document.getElementById('editorExperience1Date'),
      exp2Role: document.getElementById('editorExperience2Role'),
      exp2Org: document.getElementById('editorExperience2Org'),
      exp2Date: document.getElementById('editorExperience2Date'),
      exp3Role: document.getElementById('editorExperience3Role'),
      exp3Org: document.getElementById('editorExperience3Org'),
      exp3Date: document.getElementById('editorExperience3Date'),
      careerCurrent: document.getElementById('editorCareerCurrent'),
      careerFormer: document.getElementById('editorCareerFormer'),
      setupDpi: document.getElementById('editorSetupDpi'),
      setupSens: document.getElementById('editorSetupSens'),
      setupFov: document.getElementById('editorSetupFov'),
      setupHz: document.getElementById('editorSetupHz')
    };
  }

  function setSelectOptions(select, values, labelFactory) {
    if (!select) {
      return;
    }
    const selected = select.value;
    select.innerHTML = '';
    values.forEach((value) => {
      const option = document.createElement('option');
      option.value = value;
      option.textContent = labelFactory(value);
      select.append(option);
    });
    if (values.includes(selected)) {
      select.value = selected;
    } else if (values.length) {
      select.value = values[0];
    }
    if (typeof select._uspecRebuildMenu === 'function') {
      select._uspecRebuildMenu();
    }
  }

  function updateDivisionControlVisibility(gameKey, tier, select, wrap) {
    const rankConfig = PROFILE_RANKS[gameKey];
    if (!rankConfig || !select || !wrap) {
      return;
    }

    const showDivision = rankConfig.allowsDivision(tier);
    wrap.classList.toggle('hidden', !showDivision);
    select.disabled = !showDivision;
    select.required = showDivision;
  }

  function populateProfileRankOptions() {
    const inputs = getProfileEditorInputs();
    if (!inputs.owTier || !inputs.lolTier || !inputs.rivalsTier || !inputs.fortniteTier) {
      return;
    }

    setSelectOptions(inputs.owTier, PROFILE_RANKS.overwatch.tiers, (value) => t(getRankTierKey('overwatch', value)));
    setSelectOptions(inputs.lolTier, PROFILE_RANKS.lol.tiers, (value) => t(getRankTierKey('lol', value)));
    setSelectOptions(inputs.rivalsTier, PROFILE_RANKS.rivals.tiers, (value) => t(getRankTierKey('rivals', value)));
    setSelectOptions(inputs.fortniteTier, PROFILE_RANKS.fortnite.tiers, (value) => t(getRankTierKey('fortnite', value)));

    setSelectOptions(inputs.owDivision, PROFILE_RANKS.overwatch.divisions, (value) => t(getDivisionKey(value)));
    setSelectOptions(inputs.lolDivision, PROFILE_RANKS.lol.divisions, (value) => t(getDivisionKey(value)));
    setSelectOptions(inputs.fortniteDivision, PROFILE_RANKS.fortnite.divisions, (value) => t(getDivisionKey(value)));

    updateDivisionControlVisibility('overwatch', inputs.owTier.value, inputs.owDivision, inputs.owDivisionWrap);
    updateDivisionControlVisibility('lol', inputs.lolTier.value, inputs.lolDivision, inputs.lolDivisionWrap);
    updateDivisionControlVisibility('fortnite', inputs.fortniteTier.value, inputs.fortniteDivision, inputs.fortniteDivisionWrap);
  }

  function populateProfileCountryOptions() {
    const inputs = getProfileEditorInputs();
    if (!inputs.country) {
      return;
    }
    setSelectOptions(inputs.country, PROFILE_COUNTRY_CODES, (value) => formatCountry(value));
  }

  function fillProfileEditorForm() {
    const inputs = getProfileEditorInputs();
    if (!inputs.displayName) {
      return;
    }

    const profile = normalizeProfileState(state.profile);
    state.profile = profile;
    const data = profile.publicProfile;

    inputs.displayName.value = data.displayName;
    inputs.role.value = data.role;
    populateProfileCountryOptions();
    if (inputs.country) {
      inputs.country.value = data.country;
      if (typeof inputs.country._uspecRebuildMenu === 'function') {
        inputs.country._uspecRebuildMenu();
      }
    }
    inputs.headline.value = data.headline;
    inputs.about.value = data.about;
    inputs.proofStatus.value = data.proofStatus;
    if (inputs.mainGame) {
      inputs.mainGame.value = data.mainGame;
    }

    populateProfileRankOptions();

    inputs.owHandle.value = data.games.overwatch.handle;
    inputs.owTier.value = data.games.overwatch.tier;
    inputs.owDivision.value = data.games.overwatch.division;
    inputs.lolHandle.value = data.games.lol.handle;
    inputs.lolTier.value = data.games.lol.tier;
    inputs.lolDivision.value = data.games.lol.division;
    inputs.rivalsHandle.value = data.games.rivals.handle;
    inputs.rivalsTier.value = data.games.rivals.tier;
    inputs.fortniteHandle.value = data.games.fortnite.handle;
    inputs.fortniteTier.value = data.games.fortnite.tier;
    inputs.fortniteDivision.value = data.games.fortnite.division;

    updateDivisionControlVisibility('overwatch', inputs.owTier.value, inputs.owDivision, inputs.owDivisionWrap);
    updateDivisionControlVisibility('lol', inputs.lolTier.value, inputs.lolDivision, inputs.lolDivisionWrap);
    updateDivisionControlVisibility('fortnite', inputs.fortniteTier.value, inputs.fortniteDivision, inputs.fortniteDivisionWrap);

    const entries = profile.experience;
    inputs.exp1Role.value = entries[0].role;
    inputs.exp1Org.value = entries[0].org;
    inputs.exp1Date.value = entries[0].date;
    inputs.exp2Role.value = entries[1].role;
    inputs.exp2Org.value = entries[1].org;
    inputs.exp2Date.value = entries[1].date;
    inputs.exp3Role.value = entries[2].role;
    inputs.exp3Org.value = entries[2].org;
    inputs.exp3Date.value = entries[2].date;

    inputs.careerCurrent.value = profile.career.currentTeamText;
    inputs.careerFormer.value = profile.career.formerTeamText;

    inputs.setupDpi.value = profile.setup.dpi;
    inputs.setupSens.value = profile.setup.sens;
    inputs.setupFov.value = profile.setup.fov;
    inputs.setupHz.value = profile.setup.hz;
  }

  function getProfileEditorModal() {
    return document.getElementById('profileEditorModal');
  }

  function setProfileEditorSection(section) {
    const normalized = ['public', 'experience', 'career', 'setup'].includes(section) ? section : 'public';
    state.profileEditorSection = normalized;

    document.querySelectorAll('#profileEditorTabs [data-profile-editor-tab]').forEach((button) => {
      const active = button.dataset.profileEditorTab === normalized;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });

    document.querySelectorAll('[data-profile-editor-section]').forEach((node) => {
      node.classList.toggle('hidden', node.dataset.profileEditorSection !== normalized);
    });
  }

  function closeProfileEditorModal() {
    const modal = getProfileEditorModal();
    if (!modal) {
      return;
    }
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  function openProfileEditorModal(section) {
    if (!state.isAuthenticated) {
      openAuthModal('login');
      return;
    }

    const modal = getProfileEditorModal();
    if (!modal) {
      return;
    }

    fillProfileEditorForm();
    setProfileEditorSection(section || 'public');

    const saved = document.getElementById('profileEditorSaved');
    if (saved) {
      saved.classList.add('hidden');
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  async function saveProfileFromEditor(form) {
    const inputs = getProfileEditorInputs();
    if (!form || !inputs.displayName || !form.reportValidity()) {
      return;
    }

    const saveButton = document.querySelector('button[form="profileEditorForm"][type="submit"]');
    setButtonLoading(saveButton, true, t('d.editor.saving'));
    persistUiSubmitMeta('profileEditor', { status: 'pending', section: state.profileEditorSection });

    const draft = {
      version: PROFILE_VERSION,
      publicProfile: {
        displayName: inputs.displayName.value,
        role: inputs.role.value,
        country: inputs.country ? inputs.country.value : 'DE',
        headline: inputs.headline.value,
        about: inputs.about.value,
        proofStatus: inputs.proofStatus.value,
        mainGame: inputs.mainGame ? inputs.mainGame.value : 'overwatch',
        games: {
          overwatch: {
            handle: inputs.owHandle.value,
            tier: inputs.owTier.value,
            division: inputs.owDivision.value
          },
          lol: {
            handle: inputs.lolHandle.value,
            tier: inputs.lolTier.value,
            division: inputs.lolDivision.value
          },
          rivals: {
            handle: inputs.rivalsHandle.value,
            tier: inputs.rivalsTier.value
          },
          fortnite: {
            handle: inputs.fortniteHandle.value,
            tier: inputs.fortniteTier.value,
            division: inputs.fortniteDivision.value
          }
        }
      },
      experience: [
        { role: inputs.exp1Role.value, org: inputs.exp1Org.value, date: inputs.exp1Date.value },
        { role: inputs.exp2Role.value, org: inputs.exp2Org.value, date: inputs.exp2Date.value },
        { role: inputs.exp3Role.value, org: inputs.exp3Org.value, date: inputs.exp3Date.value }
      ],
      career: {
        currentTeamText: inputs.careerCurrent.value,
        formerTeamText: inputs.careerFormer.value
      },
      setup: {
        dpi: String(inputs.setupDpi.value),
        sens: String(inputs.setupSens.value),
        fov: String(inputs.setupFov.value),
        hz: String(inputs.setupHz.value)
      }
    };

    try {
      await callMockApi('profile_editor_save', { section: state.profileEditorSection });
      state.profile = normalizeProfileState(draft);
      persistProfileState();
      applyProfileStateToDOM();

      const saved = document.getElementById('profileEditorSaved');
      if (saved) {
        saved.classList.remove('hidden');
      }
      persistUiSubmitMeta('profileEditor', {
        status: 'success',
        section: state.profileEditorSection,
        requestId: makeUnifiedId('profile')
      });
      showToast('d.editor.saved', 'success');
    } catch (_err) {
      persistUiSubmitMeta('profileEditor', {
        status: 'error',
        section: state.profileEditorSection
      });
      showToast('d.toast.error.generic', 'error');
    } finally {
      setButtonLoading(saveButton, false);
    }
  }

  function applyProfileEditorI18n() {
    document.querySelectorAll('[data-edit-tooltip]').forEach((button) => {
      const section = button.dataset.editSection || 'public';
      const sectionKey = `d.edit.section.${section}`;
      button.dataset.tooltip = t('d.edit.tooltip');
      button.setAttribute('aria-label', `${t('d.edit.tooltip')} ${t(sectionKey)}`);
    });
    populateProfileRankOptions();
    populateProfileCountryOptions();
  }

  function renderProfileEditorControls() {
    const visible = state.isAuthenticated;
    document.querySelectorAll('[data-open-profile-editor]').forEach((button) => {
      button.hidden = !visible;
      button.tabIndex = visible ? 0 : -1;
    });
  }

  function getPrimaryGame(player) {
    const game = state.game;
    if (game !== GAME_IDS.ANY) {
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

    const games = player.games.filter((entry) => state.game === GAME_IDS.ANY || entry.game === state.game);
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
        const gameKey = getProfileGameKeyFromExploreGame(entry.game);
        const tier = extractTierFromExploreRank(gameKey, entry.rank);
        return tier === state.rank;
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

    if (state.game !== GAME_IDS.ANY && !team.games.some((entry) => entry.game === state.game)) {
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
      `<span class="primary-chip">${getGameLabel(game.game)}</span>`,
      '</div>',
      '<div class="result-main">',
      `<strong>${formatRole(game.role) || '-'}</strong>`,
      `<span>${game.rank || '-'} · ${t('d.card.peak')} ${game.peak || '-'}</span>`,
      '</div>',
      `<span class="proof-badge ${proof.cls}" title="${proof.tooltip}">${proof.label}</span>`,
      '<div class="result-meta">',
      `<span>${t('d.card.region')}: ${player.region}</span>`,
      `<span>${t('d.card.country')}: ${formatCountry(player.country)}</span>`,
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
      .filter((entry) => state.game === GAME_IDS.ANY || entry.game === state.game)
      .flatMap((entry) => entry.needs.map((need) => `${getGameLabel(entry.game)}: ${formatRole(need.role)} (${need.rankMin}+)`));

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
      const hasResults = filteredPlayers.length > 0;
      empty.classList.toggle('hidden', hasResults);
    } else {
      const filteredTeams = teams.filter(passesTeamFilters);
      list.innerHTML = filteredTeams.map(renderTeamCard).join('');
      const hasResults = filteredTeams.length > 0;
      empty.classList.toggle('hidden', hasResults);
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
      { key: t('d.compare.row.country'), value: (p) => formatCountry(p.country) },
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
    const playersTab = document.getElementById('modePlayers');
    const teamsTab = document.getElementById('modeTeams');

    if (playersTab) {
      playersTab.classList.toggle('active', mode === 'players');
      playersTab.setAttribute('aria-selected', String(mode === 'players'));
    }
    if (teamsTab) {
      teamsTab.classList.toggle('active', mode === 'teams');
      teamsTab.setAttribute('aria-selected', String(mode === 'teams'));
    }

    if (mode === 'players') {
      track('view_explore_players', {});
    }

    persistExploreFilters();
    applyCustomI18n();
    renderResults();
    renderCompareDrawer();
  }

  function syncMetrics() {
    const payload = getMetricsPayload();
    state.metrics.connect = payload.connect;
    state.metrics.tryouts = payload.tryouts;
    state.metrics.waitlist = payload.waitlist;
    state.metrics.compareAdds = payload.compareAdds;

    const connect = document.getElementById('metricConnect');
    const tryouts = document.getElementById('metricTryouts');
    const waitlist = document.getElementById('metricWaitlist');
    const compare = document.getElementById('metricCompare');

    if (connect) connect.textContent = String(payload.connect);
    if (tryouts) tryouts.textContent = String(payload.tryouts);
    if (waitlist) waitlist.textContent = String(payload.waitlist);
    if (compare) compare.textContent = String(payload.compareAdds);

    persistMetrics();
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
      gameSelect.value = normalizeGameId(context.game, context.game);
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
        const successTitle = success.querySelector('strong');
        const successHint = success.querySelector('p');
        if (successTitle) {
          successTitle.dataset.d18n = 'd.auth.success';
          successTitle.textContent = t('d.auth.success');
        }
        if (successHint) {
          successHint.classList.remove('hidden');
          successHint.dataset.d18n = 'd.auth.continueWaitlist';
          successHint.textContent = t('d.auth.continueWaitlist');
        }
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

  function setNetworkMode(mode, trackSwitch) {
    const nextMode = mode === 'reference' ? 'reference' : 'intro';
    state.networkMode = nextMode;

    const introForm = document.getElementById('networkIntroForm');
    const referenceForm = document.getElementById('networkReferenceForm');
    const success = document.getElementById('networkSuccess');

    if (introForm) {
      introForm.classList.toggle('hidden', nextMode !== 'intro');
    }
    if (referenceForm) {
      referenceForm.classList.toggle('hidden', nextMode !== 'reference');
    }
    if (success) {
      success.classList.add('hidden');
    }

    document.querySelectorAll('#networkTabs [data-network-mode]').forEach((button) => {
      const active = button.dataset.networkMode === nextMode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });

    if (trackSwitch) {
      track('switch_network_mode', { mode: nextMode });
    }
  }

  function openNetworkModal(mode) {
    const modal = document.getElementById('networkModal');
    if (!modal) {
      return;
    }
    setNetworkMode(mode || state.networkMode, false);
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    track('open_network_modal', { mode: state.networkMode });
  }

  function closeNetworkModal() {
    const modal = document.getElementById('networkModal');
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

  function initFilterSelectToggles(selectNodes) {
    const controls = [];

    const closeAll = (exceptWrap = null) => {
      controls.forEach((control) => {
        if (exceptWrap && control.wrap === exceptWrap) {
          return;
        }
        control.close();
      });
    };

    (selectNodes || []).forEach((select) => {
      if (!select) return;
      const wrap = select.closest('.select-wrap');
      const arrow = wrap ? wrap.querySelector(`[data-select-toggle="${select.id}"]`) : null;
      if (!wrap || !arrow) return;

      let menu = wrap.querySelector(`[data-select-menu="${select.id}"]`);
      if (!menu) {
        menu = document.createElement('div');
        menu.className = 'select-menu hidden';
        menu.dataset.selectMenu = select.id;
        menu.setAttribute('role', 'listbox');
        wrap.append(menu);
      }

      const setOpenState = (isOpen) => {
        wrap.classList.toggle('is-open', isOpen);
        arrow.setAttribute('aria-expanded', String(isOpen));
        menu.classList.toggle('hidden', !isOpen);
      };

      const close = () => {
        setOpenState(false);
      };

      const open = () => {
        if (select.disabled) {
          return;
        }
        closeAll(wrap);
        setOpenState(true);
      };

      const toggle = () => {
        if (select.disabled) {
          close();
          return;
        }
        const isOpen = wrap.classList.contains('is-open');
        if (isOpen) {
          close();
          return;
        }
        open();
      };

      const syncActiveOption = () => {
        menu.querySelectorAll('.select-option').forEach((optionButton) => {
          const isActive = optionButton.dataset.value === select.value;
          optionButton.classList.toggle('active', isActive);
          optionButton.setAttribute('aria-selected', String(isActive));
        });
      };

      const buildMenu = () => {
        menu.innerHTML = '';
        Array.from(select.options).forEach((option) => {
          const optionButton = document.createElement('button');
          optionButton.type = 'button';
          optionButton.className = 'select-option';
          optionButton.dataset.value = option.value;
          optionButton.setAttribute('role', 'option');
          optionButton.textContent = option.textContent;
          optionButton.addEventListener('click', (event) => {
            event.preventDefault();
            event.stopPropagation();
            if (select.value !== option.value) {
              select.value = option.value;
              select.dispatchEvent(new Event('change', { bubbles: true }));
            }
            close();
          });
          menu.append(optionButton);
        });
        syncActiveOption();
      };

      select._uspecRebuildMenu = buildMenu;

      arrow.setAttribute('aria-haspopup', 'listbox');
      setOpenState(false);
      buildMenu();

      arrow.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle();
      });

      wrap.addEventListener('click', (event) => {
        if (select.disabled) {
          return;
        }
        if (event.target.closest('.select-menu')) {
          return;
        }
        if (event.target.closest('.select-arrow')) {
          return;
        }
        event.preventDefault();
        toggle();
      });

      select.addEventListener('change', syncActiveOption);

      controls.push({ wrap, close, buildMenu });
    });

    if (!controls.length) {
      return;
    }

    document.addEventListener('pointerdown', (event) => {
      controls.forEach(({ wrap, close }) => {
        if (!wrap.contains(event.target)) {
          close();
        }
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      closeAll();
    });

    document.addEventListener('uspecme:langchange', () => {
      controls.forEach(({ buildMenu }) => buildMenu());
    });
  }

  function initExplore() {
    const hasExplore = document.getElementById('resultList') && document.getElementById('emptyState');
    if (!hasExplore) {
      return;
    }

    const searchInput = document.getElementById('searchInput');
    const roleFilter = document.getElementById('roleFilter');
    const rankFilter = document.getElementById('rankFilter');
    const regionFilter = document.getElementById('regionFilter');
    const availabilityFilter = document.getElementById('availabilityFilter');
    const proofFilter = document.getElementById('proofFilter');
    const selectNodes = [roleFilter, rankFilter, regionFilter, availabilityFilter, proofFilter];

    applyPersistedExploreFilters();
    initFilterSelectToggles(selectNodes);
    syncExploreRoleFilterOptions();
    syncExploreRankFilterOptions();

    if (searchInput) {
      searchInput.value = state.search;
    }

    document.querySelectorAll('#gameChips .chip').forEach((chip) => {
      const gameId = chip.dataset.game || GAME_IDS.ANY;
      chip.classList.toggle('active', gameId === state.game);
    });

    if (searchInput) {
      searchInput.addEventListener('input', () => {
        state.search = searchInput.value.trim();
        persistExploreFilters();
        renderResults();
      });
    }

    const filterBindings = [
      [roleFilter, 'role'],
      [rankFilter, 'rank'],
      [regionFilter, 'region'],
      [availabilityFilter, 'availability'],
      [proofFilter, 'proof']
    ];

    filterBindings.forEach(([node, key]) => {
      if (!node) return;
      node.addEventListener('change', () => {
        state[key] = node.value;
        persistExploreFilters();
        applyFiltersTracking();
        renderResults();
      });
    });

    document.querySelectorAll('#gameChips .chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('#gameChips .chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        state.game = chip.dataset.game || GAME_IDS.ANY;
        persistExploreFilters();
        syncExploreRoleFilterOptions();
        syncExploreRankFilterOptions();
        applyFiltersTracking();
        renderResults();
      });
    });

    const modePlayers = document.getElementById('modePlayers');
    const modeTeams = document.getElementById('modeTeams');
    if (modePlayers) {
      modePlayers.addEventListener('click', () => setMode('players'));
    }
    if (modeTeams) {
      modeTeams.addEventListener('click', () => setMode('teams'));
    }

    if (modePlayers) {
      modePlayers.classList.toggle('active', state.mode === 'players');
      modePlayers.setAttribute('aria-selected', String(state.mode === 'players'));
    }
    if (modeTeams) {
      modeTeams.classList.toggle('active', state.mode === 'teams');
      modeTeams.setAttribute('aria-selected', String(state.mode === 'teams'));
    }

    const clearCompare = document.getElementById('clearCompare');
    if (clearCompare) {
      clearCompare.addEventListener('click', () => {
        state.compare = [];
        renderResults();
        renderCompareDrawer();
      });
    }

    const inviteSelected = document.getElementById('inviteSelected');
    if (inviteSelected) {
      inviteSelected.addEventListener('click', () => {
        if (!state.compare.length) {
          return;
        }
        track('click_invite_tryout', { handle: state.compare.join(','), game: state.game === GAME_IDS.ANY ? 'mixed' : state.game });
        state.metrics.tryouts += 1;
        syncMetrics();
        openInviteModal({ type: 'multi', game: state.game === GAME_IDS.ANY ? GAME_IDS.OVERWATCH : state.game });
      });
    }

    persistExploreFilters();
    renderResults();
    renderCompareDrawer();
  }

  function initInviteModal() {
    document.querySelectorAll('[data-close-invite]').forEach((button) => {
      button.addEventListener('click', closeInviteModal);
    });

    const form = document.getElementById('inviteForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) {
        return;
      }

      const submit = form.querySelector('button[type="submit"]');
      setButtonLoading(submit, true, t('d.invite.submitting'));
      persistUiSubmitMeta('invite', { status: 'pending' });

      const game = form.querySelector('#inviteGame').value;
      const role = form.querySelector('#inviteRole').value;
      const slot = form.querySelector('#inviteSlot').value;
      const success = document.getElementById('inviteSuccess');

      try {
        await callMockApi('invite_submit', { game, role, slot, region: state.region });
        track('submit_invite_request', { game, role, region: state.region });

        if (success) {
          success.classList.remove('hidden');
        }

        persistUiSubmitMeta('invite', {
          status: 'success',
          requestId: makeUnifiedId('invite')
        });
        showToast('d.invite.success', 'success');
      } catch (_err) {
        if (success) {
          success.classList.add('hidden');
        }
        persistUiSubmitMeta('invite', { status: 'error' });
        showToast('d.toast.error.generic', 'error');
      } finally {
        setButtonLoading(submit, false);
      }
    });
  }

  function initConnectModal() {
    document.querySelectorAll('[data-close-connect]').forEach((button) => {
      button.addEventListener('click', closeConnectModal);
    });

    const openConnectFromHero = document.getElementById('openConnectFromHero');
    if (openConnectFromHero) {
      openConnectFromHero.addEventListener('click', openConnectModal);
    }

    document.querySelectorAll('#connectModal [data-provider]').forEach((button) => {
      button.addEventListener('click', async () => {
        const provider = button.dataset.provider;
        setButtonLoading(button, true, t('d.connect.connecting'));
        persistUiSubmitMeta('connect', { status: 'pending', provider });

        try {
          await callMockApi('connect_provider', { provider });
          track('click_connect_provider', { provider });
          track('complete_connect_fake', { provider });

          const success = document.getElementById('connectSuccess');
          if (success) {
            success.classList.remove('hidden');
          }
          persistUiSubmitMeta('connect', {
            status: 'success',
            provider,
            requestId: makeUnifiedId('connect')
          });
          showToast('d.connect.success', 'success');
        } catch (_err) {
          persistUiSubmitMeta('connect', { status: 'error', provider });
          showToast('d.toast.error.generic', 'error');
        } finally {
          setButtonLoading(button, false);
        }
      });
    });
  }

  function initAuthModal() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');

    const loginIdentityInput = loginForm ? loginForm.querySelector('input[name="email"]') : null;
    const loginIdentityLabel = loginForm ? loginForm.querySelector('label span[data-d18n="d.auth.field.email"]') : null;
    if (loginIdentityInput) {
      loginIdentityInput.type = 'text';
      loginIdentityInput.setAttribute('autocomplete', 'username');
      loginIdentityInput.removeAttribute('inputmode');
      loginIdentityInput.removeAttribute('pattern');
      loginIdentityInput.dataset.d18nPlaceholder = 'd.auth.placeholder.loginId';
      loginIdentityInput.setAttribute('placeholder', t('d.auth.placeholder.loginId'));
    }
    if (loginIdentityLabel) {
      loginIdentityLabel.dataset.d18n = 'd.auth.field.loginId';
      loginIdentityLabel.textContent = t('d.auth.field.loginId');
    }

    function showAuthSuccess(mode) {
      const success = document.getElementById('authSuccess');
      if (!success) {
        return;
      }

      const successTitle = success.querySelector('strong');
      const successHint = success.querySelector('p');

      if (mode === 'login') {
        if (successTitle) {
          successTitle.dataset.d18n = 'd.auth.success.login';
          successTitle.textContent = t('d.auth.success.login');
        }
        if (successHint) {
          successHint.classList.add('hidden');
        }
      } else {
        if (successTitle) {
          successTitle.dataset.d18n = 'd.auth.success';
          successTitle.textContent = t('d.auth.success');
        }
        if (successHint) {
          successHint.classList.remove('hidden');
          successHint.dataset.d18n = 'd.auth.continueWaitlist';
          successHint.textContent = t('d.auth.continueWaitlist');
        }
      }

      success.classList.remove('hidden');
    }

    document.querySelectorAll('[data-open-auth]').forEach((trigger) => {
      trigger.addEventListener('click', () => {
        if (state.isAuthenticated && trigger.classList.contains('auth-entry') && !trigger.dataset.lockAction) {
          toggleAccountMenu(trigger);
          return;
        }

        const mode = trigger.dataset.authMode || 'register';
        if (trigger.dataset.lockAction) {
          track('click_preview_locked_cta', {
            page: getCurrentPage(),
            module: trigger.dataset.lockModule || 'unknown',
            action: trigger.dataset.lockAction
          });
          if (state.isAuthenticated) {
            showToast(getAuthOnlineLabel(state.authUser));
            return;
          }
        }
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

    function handleAuthSubmit(form, mode) {
      if (!form) {
        return;
      }

      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!form.reportValidity()) {
          return;
        }

        const submitButton = form.querySelector('button[type="submit"]');

        if (mode === 'login') {
          const usernameField = form.querySelector('input[name="email"]');
          const passwordField = form.querySelector('input[name="password"]');
          const username = usernameField ? usernameField.value.trim() : '';
          const password = passwordField ? passwordField.value : '';
          const user = findAuthUserByCredentials(username, password);

          if (!user) {
            track('submit_login_fake', { status: 'invalid' });
            showToast('d.auth.error.invalid', 'error');
            return;
          }

          setButtonLoading(submitButton, true, t('d.auth.submitting'));
          persistUiSubmitMeta('authLogin', { status: 'pending', identity: username });
          try {
            await callMockApi('auth_login', { identity: username });
            setAuthenticatedUser(user);
            state.authEmail = user.email;
            track('submit_login_fake', { status: 'success', username: user.username });
            showAuthSuccess('login');
            persistUiSubmitMeta('authLogin', {
              status: 'success',
              identity: username,
              requestId: makeUnifiedId('auth')
            });

            window.setTimeout(() => {
              closeAuthModal();
            }, 280);
          } catch (_err) {
            persistUiSubmitMeta('authLogin', { status: 'error', identity: username });
            showToast('d.toast.error.generic', 'error');
          } finally {
            setButtonLoading(submitButton, false);
          }
          return;
        }

        const emailField = form.querySelector('input[name="email"]');
        const passwordField = form.querySelector('input[name="password"]');
        const email = emailField ? emailField.value.trim() : '';
        const password = passwordField ? passwordField.value : '';

        const normalizedEmail = normalizeIdentity(email);
        const emailExists = (state.authUsers || []).some((user) => normalizeIdentity(user.email) === normalizedEmail);
        if (!normalizedEmail || emailExists) {
          track('submit_register_fake', { status: emailExists ? 'exists' : 'invalid' });
          showToast(emailExists ? 'd.auth.error.exists' : 'd.auth.error.invalid', 'error');
          return;
        }

        setButtonLoading(submitButton, true, t('d.auth.submitting'));
        persistUiSubmitMeta('authRegister', { status: 'pending', email: normalizedEmail });
        try {
          await callMockApi('auth_register', { email: normalizedEmail });
          const created = registerAuthUser(email, password);
          if (!created.ok) {
            track('submit_register_fake', { status: created.reason || 'error' });
            showToast(created.reason === 'exists' ? 'd.auth.error.exists' : 'd.auth.error.invalid', 'error');
            persistUiSubmitMeta('authRegister', { status: 'error', email: normalizedEmail });
            return;
          }

          setAuthenticatedUser(created.user);
          state.authEmail = created.user.email;
          track('submit_register_fake', { status: 'success', username: created.user.username });
          showAuthSuccess('register');
          persistUiSubmitMeta('authRegister', {
            status: 'success',
            email: normalizedEmail,
            requestId: makeUnifiedId('auth')
          });

          window.setTimeout(() => {
            track('continue_to_waitlist_after_auth', { mode });
            closeAuthModal();
            openWaitlistAfterAuth(state.authEmail);
          }, 260);
        } catch (_err) {
          persistUiSubmitMeta('authRegister', { status: 'error', email: normalizedEmail });
          showToast('d.toast.error.generic', 'error');
        } finally {
          setButtonLoading(submitButton, false);
        }
      });
    }

    handleAuthSubmit(registerForm, 'register');
    handleAuthSubmit(loginForm, 'login');
  }

  function initNetworkModal() {
    document.querySelectorAll('[data-open-network-modal]').forEach((button) => {
      button.addEventListener('click', () => {
        openNetworkModal(button.dataset.networkMode || 'intro');
      });
    });

    document.querySelectorAll('[data-close-network]').forEach((button) => {
      button.addEventListener('click', closeNetworkModal);
    });

    document.querySelectorAll('#networkTabs [data-network-mode]').forEach((button) => {
      button.addEventListener('click', () => {
        setNetworkMode(button.dataset.networkMode || 'intro', true);
      });
    });

    const introForm = document.getElementById('networkIntroForm');
    if (introForm) {
      introForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!introForm.reportValidity()) {
          return;
        }

        const submit = introForm.querySelector('button[type="submit"]');
        setButtonLoading(submit, true, t('d.network.submitting'));
        persistUiSubmitMeta('networkIntro', { status: 'pending' });

        const organization = introForm.querySelector('input[name="organization"]').value.trim();
        const role = introForm.querySelector('input[name="role"]').value.trim();

        try {
          await callMockApi('network_intro', { organization, role });
          track('submit_intro_fake', { organization, role });

          const success = document.getElementById('networkSuccess');
          if (success) {
            success.classList.remove('hidden');
          }
          persistUiSubmitMeta('networkIntro', {
            status: 'success',
            requestId: makeUnifiedId('network')
          });
          showToast('d.network.success', 'success');
        } catch (_err) {
          persistUiSubmitMeta('networkIntro', { status: 'error' });
          showToast('d.toast.error.generic', 'error');
        } finally {
          setButtonLoading(submit, false);
        }
      });
    }

    const referenceForm = document.getElementById('networkReferenceForm');
    if (referenceForm) {
      referenceForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!referenceForm.reportValidity()) {
          return;
        }

        const submit = referenceForm.querySelector('button[type="submit"]');
        setButtonLoading(submit, true, t('d.network.submitting'));
        persistUiSubmitMeta('networkReference', { status: 'pending' });

        const authorRole = referenceForm.querySelector('input[name="authorRole"]').value.trim();
        const relationship = referenceForm.querySelector('input[name="relationship"]').value.trim();

        try {
          await callMockApi('network_reference', { authorRole, relationship });
          track('submit_reference_fake', { authorRole, relationship });

          const success = document.getElementById('networkSuccess');
          if (success) {
            success.classList.remove('hidden');
          }
          persistUiSubmitMeta('networkReference', {
            status: 'success',
            requestId: makeUnifiedId('network')
          });
          showToast('d.network.success', 'success');
        } catch (_err) {
          persistUiSubmitMeta('networkReference', { status: 'error' });
          showToast('d.toast.error.generic', 'error');
        } finally {
          setButtonLoading(submit, false);
        }
      });
    }

    const referencesPanel = document.getElementById('referencesPanel');
    if (referencesPanel) {
      track('view_references_panel', {});
    }

    setNetworkMode(state.networkMode, false);
  }

  function initProfileEditor() {
    renderProfileEditorControls();
    applyProfileEditorI18n();
    applyProfileStateToDOM();

    const modal = getProfileEditorModal();
    if (!modal) {
      return;
    }

    document.querySelectorAll('[data-open-profile-editor]').forEach((button) => {
      button.addEventListener('click', () => {
        openProfileEditorModal(button.dataset.editSection || 'public');
      });
    });

    document.querySelectorAll('[data-close-profile-editor]').forEach((button) => {
      button.addEventListener('click', closeProfileEditorModal);
    });

    document.querySelectorAll('#profileEditorTabs [data-profile-editor-tab]').forEach((tab) => {
      tab.addEventListener('click', () => {
        setProfileEditorSection(tab.dataset.profileEditorTab || 'public');
      });
    });

    const form = document.getElementById('profileEditorForm');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        saveProfileFromEditor(form);
      });
    }

    const inputs = getProfileEditorInputs();
    initFilterSelectToggles([
      inputs.proofStatus,
      inputs.mainGame,
      inputs.country,
      inputs.owTier,
      inputs.owDivision,
      inputs.lolTier,
      inputs.lolDivision,
      inputs.rivalsTier,
      inputs.fortniteTier,
      inputs.fortniteDivision
    ]);

    if (inputs.owTier && inputs.owDivision && inputs.owDivisionWrap) {
      inputs.owTier.addEventListener('change', () => {
        updateDivisionControlVisibility('overwatch', inputs.owTier.value, inputs.owDivision, inputs.owDivisionWrap);
      });
    }
    if (inputs.lolTier && inputs.lolDivision && inputs.lolDivisionWrap) {
      inputs.lolTier.addEventListener('change', () => {
        updateDivisionControlVisibility('lol', inputs.lolTier.value, inputs.lolDivision, inputs.lolDivisionWrap);
      });
    }
    if (inputs.fortniteTier && inputs.fortniteDivision && inputs.fortniteDivisionWrap) {
      inputs.fortniteTier.addEventListener('change', () => {
        updateDivisionControlVisibility('fortnite', inputs.fortniteTier.value, inputs.fortniteDivision, inputs.fortniteDivisionWrap);
      });
    }
  }

  function initTheme() {
    const root = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const motionToggle = document.getElementById('motionToggle');

    const storedTheme = loadUnifiedState('settings.theme', null, () => safeStorageGet(THEME_KEY));
    if (storedTheme === 'light') {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }

    const reducedMotion = loadUnifiedState('settings.motionReduced', null, () => safeStorageGet(MOTION_KEY) === '1') === true;
    root.classList.toggle('reduce-motion', reducedMotion);

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const dark = root.classList.toggle('dark');
        saveUnifiedState('settings.theme', dark ? 'dark' : 'light');
        safeStorageSet(THEME_KEY, dark ? 'dark' : 'light');
        applyCustomI18n();
      });
    }

    if (motionToggle) {
      motionToggle.addEventListener('click', () => {
        const reduced = root.classList.toggle('reduce-motion');
        saveUnifiedState('settings.motionReduced', reduced);
        safeStorageSet(MOTION_KEY, reduced ? '1' : '0');
        applyCustomI18n();
      });
    }
  }

  function initHeroCTAs() {
    const player = document.getElementById('ctaPlayer');
    const team = document.getElementById('ctaTeam');

    if (player) {
      player.addEventListener('click', () => {
        track('click_cta_player', {});
        const modePlayers = document.getElementById('modePlayers');
        if (modePlayers) {
          modePlayers.click();
        }
        const explore = document.getElementById('explore');
        if (explore) {
          explore.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    if (team) {
      team.addEventListener('click', () => {
        track('click_cta_team', {});
        const modeTeams = document.getElementById('modeTeams');
        if (modeTeams) {
          modeTeams.click();
        }
        const explore = document.getElementById('explore');
        if (explore) {
          explore.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }

  function initWaitlistTracking() {
    document.addEventListener('usm:waitlist:success', (event) => {
      const detail = (event && event.detail && typeof event.detail === 'object') ? event.detail : {};
      const role = detail.role || 'unknown';
      const game = detail.game || 'unknown';

      track('submit_waitlist', { persona: role, games: game, region: state.region === 'Any' ? 'unknown' : state.region });
      state.metrics.waitlist += 1;
      syncMetrics();
      persistUiSubmitMeta('waitlist', {
        status: 'success',
        requestId: detail.requestId || makeUnifiedId('waitlist')
      });
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
      closeNetworkModal();
      closeAuthModal();
      closeProfileEditorModal();
    });
  }

  function onLanguageChange() {
    applyCustomI18n();
    initNavigationState();
    renderResults();
    renderCompareDrawer();
  }

  document.addEventListener('uspecme:langchange', onLanguageChange);
  window.usmShowToast = showToast;
  window.usmSetButtonLoading = setButtonLoading;

  document.addEventListener('DOMContentLoaded', () => {
    initNavigationState();
    initTheme();
    initHeroCTAs();
    initExplore();
    initInviteModal();
    initConnectModal();
    initAuthModal();
    initNetworkModal();
    initProfileEditor();
    initWaitlistTracking();
    initGlobalToasts();
    bindGlobalEsc();

    applyCustomI18n();
    syncMetrics();
    trackPageView();
  });
})();
