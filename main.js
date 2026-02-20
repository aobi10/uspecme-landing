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
  const PLATFORM_IDS = {
    PC: 'PC',
    PLAYSTATION: 'PlayStation',
    XBOX: 'Xbox',
    SWITCH: 'Switch'
  };
  const ALLOWED_PLATFORM_IDS = [
    PLATFORM_IDS.PC,
    PLATFORM_IDS.PLAYSTATION,
    PLATFORM_IDS.XBOX,
    PLATFORM_IDS.SWITCH
  ];
  const AVATAR_STYLE_IDS = {
    MONO: 'mono',
    SYMBOL: 'symbol',
    BRAND: 'brand'
  };
  const AVATAR_SHAPE_IDS = {
    CIRCLE: 'circle',
    SHIELD: 'shield',
    HEX: 'hex',
    DIAMOND: 'diamond'
  };
  const AVATAR_ACCENT_IDS = {
    CYAN: 'cyan',
    GOLD: 'gold',
    SILVER: 'silver',
    TEAL: 'teal',
    VIOLET: 'violet'
  };
  const AVATAR_GLYPH_KEYS = ['bolt', 'rune', 'crosshair', 'pulse', 'core', 'wing'];
  const AVATAR_GLYPH_LABELS = {
    bolt: 'B',
    rune: 'R',
    crosshair: '+',
    pulse: 'P',
    core: 'O',
    wing: 'W'
  };
  const ALLOWED_AVATAR_STYLES = [
    AVATAR_STYLE_IDS.MONO,
    AVATAR_STYLE_IDS.SYMBOL,
    AVATAR_STYLE_IDS.BRAND
  ];
  const ALLOWED_AVATAR_SHAPES = [
    AVATAR_SHAPE_IDS.CIRCLE,
    AVATAR_SHAPE_IDS.SHIELD,
    AVATAR_SHAPE_IDS.HEX,
    AVATAR_SHAPE_IDS.DIAMOND
  ];
  const ALLOWED_AVATAR_ACCENTS = [
    AVATAR_ACCENT_IDS.CYAN,
    AVATAR_ACCENT_IDS.GOLD,
    AVATAR_ACCENT_IDS.SILVER,
    AVATAR_ACCENT_IDS.TEAL,
    AVATAR_ACCENT_IDS.VIOLET
  ];

  const ROLE_OPTIONS_BY_GAME = {
    [GAME_IDS.OVERWATCH]: ['Tank', 'DPS', 'Support'],
    [GAME_IDS.LOL]: ['Top', 'Jungle', 'Mid', 'ADC', 'Support'],
    [GAME_IDS.FORTNITE]: ['IGL', 'Fragger', 'Support'],
    [GAME_IDS.RIVALS]: ['Vanguard', 'Duelist', 'Strategist', 'Scout']
  };
  const RANK_OPTIONS_BY_GAME = {
    [GAME_IDS.OVERWATCH]: PROFILE_RANKS.overwatch.tiers.slice(),
    [GAME_IDS.LOL]: PROFILE_RANKS.lol.tiers.slice(),
    [GAME_IDS.FORTNITE]: PROFILE_RANKS.fortnite.tiers.slice(),
    [GAME_IDS.RIVALS]: PROFILE_RANKS.rivals.tiers.slice()
  };
  const SCOUT_HOOK_KEYS = [
    'calm',
    'teamfirst',
    'shotcall',
    'macro',
    'mapaware',
    'anchor',
    'vod',
    'stable',
    'utility',
    'tempo',
    'lateclutch',
    'pathing',
    'entry',
    'structured',
    'system',
    'discipline',
    'clutch'
  ];
  const CONDUCT_REASON_CODES = [
    'NO_SHOW',
    'TOXIC_COMMUNICATION',
    'UNRELIABLE_COMMITMENT',
    'ROLE_MISMATCH'
  ];
  const CONDUCT_RATING_WINDOW_HOURS = 72;
  const CONDUCT_MIN_VERIFIED_FOR_DISPLAY = 3;

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
    compareExpanded: false,
    networkMode: 'intro',
    authMode: 'register',
    authEmail: '',
    isAuthenticated: false,
    authUser: null,
    authUsers: loadAuthUsers(),
    profile: null,
    profileViewMode: 'self',
    profileViewPlayerId: '',
    profileViewHandle: '',
    profileViewSourceGame: '',
    profileEditorSection: 'public',
    uiDemoMode: loadUnifiedState('ui.demoMode', false, () => false) === true,
    metrics: loadMetrics(),
    selectedInviteContext: null,
    inviteTargetContext: null,
    navContext: {
      source: '',
      scrollY: 0,
      compareScrollTarget: false
    },
    compareDockVisible: false,
    lastProfileOpenHandle: '',
    activeThreadId: '',
    activeRatingRequestId: '',
    activeRatingAuthorSide: 'self'
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

  function cloneJson(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function slugifyStableId(value) {
    const normalized = String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return normalized || 'unknown';
  }

  function toIsoOrNull(value) {
    if (!value) {
      return null;
    }
    const date = new Date(value);
    if (!Number.isFinite(date.getTime())) {
      return null;
    }
    return date.toISOString();
  }

  function addHoursIso(baseIso, hours) {
    const base = new Date(baseIso || 0);
    if (!Number.isFinite(base.getTime())) {
      return null;
    }
    const next = new Date(base.getTime() + (hours * 60 * 60 * 1000));
    return next.toISOString();
  }

  function normalizeTargetIdentity(request) {
    if (!request || typeof request !== 'object') {
      return request;
    }

    const source = request.source && typeof request.source === 'object' ? request.source : {};
    let targetType = request.targetType === 'team' || request.targetType === 'player'
      ? request.targetType
      : '';
    let targetId = typeof request.targetId === 'string' ? request.targetId.trim() : '';

    if (!targetType || !targetId) {
      if (source.type === 'team') {
        targetType = 'team';
        targetId = String(source.teamSlug || source.team || '').trim();
      } else if (source.type === 'player') {
        targetType = 'player';
        targetId = String(source.handle || '').trim();
      } else if (source.type === 'multi') {
        targetType = 'player';
        const compareHandles = Array.isArray(source.compareHandles) ? source.compareHandles : [];
        targetId = compareHandles
          .map((entry) => slugifyStableId(entry))
          .filter(Boolean)
          .sort()
          .join('-');
      }
    }

    if (!targetType) {
      targetType = source.type === 'team' ? 'team' : 'player';
    }
    if (!targetId) {
      targetId = String(request.id || 'unknown').trim();
    }

    request.targetType = targetType;
    request.targetId = slugifyStableId(targetId);
    return request;
  }

  function normalizeTryoutState(request) {
    const sourceRequest = request && typeof request === 'object' ? request : {};
    const rawTryout = sourceRequest.tryout && typeof sourceRequest.tryout === 'object'
      ? sourceRequest.tryout
      : {};

    const selfConfirmedAt = toIsoOrNull(rawTryout.selfConfirmedAt);
    const counterpartConfirmedAt = toIsoOrNull(rawTryout.counterpartConfirmedAt);
    let verifiedAt = toIsoOrNull(rawTryout.verifiedAt);

    if (!verifiedAt && selfConfirmedAt && counterpartConfirmedAt) {
      const latest = Math.max(new Date(selfConfirmedAt).getTime(), new Date(counterpartConfirmedAt).getTime());
      verifiedAt = new Date(latest).toISOString();
    }

    let ratingWindowOpenedAt = toIsoOrNull(rawTryout.ratingWindowOpenedAt);
    if (!ratingWindowOpenedAt && verifiedAt) {
      ratingWindowOpenedAt = verifiedAt;
    }

    let ratingWindowExpiresAt = toIsoOrNull(rawTryout.ratingWindowExpiresAt);
    if (!ratingWindowExpiresAt && ratingWindowOpenedAt) {
      ratingWindowExpiresAt = addHoursIso(ratingWindowOpenedAt, CONDUCT_RATING_WINDOW_HOURS);
    }

    const allowedRevealStates = ['pending', 'waiting', 'revealed', 'timeout_partial'];
    let ratingRevealState = allowedRevealStates.includes(rawTryout.ratingRevealState)
      ? rawTryout.ratingRevealState
      : 'pending';

    if (!verifiedAt) {
      ratingRevealState = 'pending';
      ratingWindowOpenedAt = null;
      ratingWindowExpiresAt = null;
    }

    return {
      selfConfirmedAt,
      counterpartConfirmedAt,
      verifiedAt,
      ratingWindowOpenedAt,
      ratingWindowExpiresAt,
      ratingRevealState
    };
  }

  function normalizeRatingEntry(rawEntry) {
    if (!rawEntry || typeof rawEntry !== 'object') {
      return null;
    }

    const stars = Number(rawEntry.stars);
    if (!Number.isFinite(stars) || stars < 1 || stars > 5) {
      return null;
    }

    const reasonCode = CONDUCT_REASON_CODES.includes(rawEntry.reasonCode)
      ? rawEntry.reasonCode
      : null;

    return {
      id: String(rawEntry.id || makeUnifiedId('rat')),
      requestId: String(rawEntry.requestId || ''),
      threadId: String(rawEntry.threadId || ''),
      authorSide: rawEntry.authorSide === 'counterpart' ? 'counterpart' : 'self',
      subjectType: rawEntry.subjectType === 'team' ? 'team' : 'player',
      subjectId: slugifyStableId(rawEntry.subjectId),
      stars: Math.max(1, Math.min(5, Math.round(stars))),
      reasonCode,
      submittedAt: toIsoOrNull(rawEntry.submittedAt) || new Date().toISOString(),
      revealedAt: toIsoOrNull(rawEntry.revealedAt),
      countedAt: toIsoOrNull(rawEntry.countedAt),
      publicEligible: rawEntry.publicEligible === true
    };
  }

  function normalizeRatingsState(entitiesState) {
    const source = entitiesState && typeof entitiesState === 'object' ? entitiesState : {};
    const ratings = Array.isArray(source.ratings)
      ? source.ratings.map(normalizeRatingEntry).filter(Boolean)
      : [];

    const reputationSource = source.reputation && typeof source.reputation === 'object'
      ? source.reputation
      : {};

    const minVerified = Number(reputationSource.minVerifiedForDisplay);
    const bySubjectSource = reputationSource.bySubject && typeof reputationSource.bySubject === 'object'
      ? reputationSource.bySubject
      : {};
    const bySubject = {};
    Object.keys(bySubjectSource).forEach((key) => {
      const item = bySubjectSource[key];
      if (!item || typeof item !== 'object') {
        return;
      }
      const avg = Number(item.avg);
      const countVerified = Number(item.countVerified);
      bySubject[key] = {
        avg: Number.isFinite(avg) ? avg : 0,
        countVerified: Number.isFinite(countVerified) ? Math.max(0, Math.floor(countVerified)) : 0,
        displayMode: item.displayMode === 'score' ? 'score' : 'placeholder',
        updatedAt: toIsoOrNull(item.updatedAt) || ''
      };
    });

    source.ratings = ratings;
    source.reputation = {
      minVerifiedForDisplay: Number.isFinite(minVerified) && minVerified > 0
        ? Math.floor(minVerified)
        : CONDUCT_MIN_VERIFIED_FOR_DISPLAY,
      bySubject,
      updatedAt: toIsoOrNull(reputationSource.updatedAt) || ''
    };
    return source;
  }

  function normalizeRequestEntity(rawRequest) {
    const request = rawRequest && typeof rawRequest === 'object' ? cloneJson(rawRequest) : {};
    const status = String(request.status || 'PENDING').toUpperCase();
    request.status = ['PENDING', 'CANCELLED', 'COMPLETED'].includes(status) ? status : 'PENDING';
    request.game = normalizeGameId(request.game, GAME_IDS.OVERWATCH);
    request.role = String(request.role || '').trim();
    request.slot = String(request.slot || '').trim();
    request.notes = String(request.notes || '').trim();
    request.targetLabel = String(request.targetLabel || '').trim() || 'Unknown';
    request.createdAt = toIsoOrNull(request.createdAt) || new Date().toISOString();
    request.updatedAt = toIsoOrNull(request.updatedAt) || request.createdAt;
    normalizeTargetIdentity(request);
    request.tryout = normalizeTryoutState(request);

    if (request.tryout.selfConfirmedAt && request.tryout.counterpartConfirmedAt && request.status !== 'CANCELLED') {
      request.status = 'COMPLETED';
      if (!request.tryout.verifiedAt) {
        request.tryout.verifiedAt = request.tryout.counterpartConfirmedAt || request.tryout.selfConfirmedAt;
      }
      if (!request.tryout.ratingWindowOpenedAt) {
        request.tryout.ratingWindowOpenedAt = request.tryout.verifiedAt;
      }
      if (!request.tryout.ratingWindowExpiresAt) {
        request.tryout.ratingWindowExpiresAt = addHoursIso(request.tryout.ratingWindowOpenedAt, CONDUCT_RATING_WINDOW_HOURS);
      }
    }

    return request;
  }

  function normalizeEntitiesState(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const normalized = {
      seedVersion: typeof source.seedVersion === 'string' ? source.seedVersion : '',
      requests: Array.isArray(source.requests) ? source.requests.map(normalizeRequestEntity) : [],
      threads: Array.isArray(source.threads) ? source.threads : [],
      notifications: Array.isArray(source.notifications) ? source.notifications : [],
      ratings: Array.isArray(source.ratings) ? source.ratings : [],
      reputation: source.reputation && typeof source.reputation === 'object' ? source.reputation : {}
    };
    normalizeRatingsState(normalized);
    return normalized;
  }

  function loadEntitiesState() {
    return normalizeEntitiesState(loadUnifiedState('entities', {}, () => null));
  }

  function updateEntitiesState(updater) {
    return updateUnifiedState(
      'entities',
      (previous) => {
        const base = normalizeEntitiesState(previous);
        const draft = cloneJson(base);
        const next = typeof updater === 'function' ? updater(draft) : draft;
        return normalizeEntitiesState(next || draft);
      },
      { seedVersion: '', requests: [], threads: [], notifications: [], ratings: [], reputation: {} }
    );
  }

  function sanitizeThreadToken(value) {
    const normalized = String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    return normalized || 'unknown';
  }

  function getContextCompareHandles(context) {
    if (!context || typeof context !== 'object') {
      return [];
    }
    const handles = Array.isArray(context.compareHandles) ? context.compareHandles : [];
    const uniqueSorted = Array.from(new Set(handles.map((handle) => sanitizeThreadToken(handle)).filter(Boolean))).sort();
    return uniqueSorted;
  }

  function getTargetLabelFromContext(context) {
    if (!context || typeof context !== 'object') {
      return 'Unknown';
    }
    if (context.type === 'team') {
      const teamSlug = String(context.team || context.teamSlug || '').trim();
      if (!teamSlug) {
        return 'Team';
      }
      const found = teams.find((team) => team.slug === teamSlug);
      return found ? found.name : teamSlug;
    }
    if (context.type === 'player') {
      return String(context.handle || 'Player').trim() || 'Player';
    }
    if (context.type === 'multi') {
      const labels = getContextCompareHandles(context).map((token) => {
        const original = (context.compareHandles || []).find((handle) => sanitizeThreadToken(handle) === token);
        return original || token;
      });
      return labels.length ? labels.join(', ') : 'Selected players';
    }
    return String(context.handle || context.team || 'Unknown').trim() || 'Unknown';
  }

  function getTargetIdentityFromContext(context) {
    if (!context || typeof context !== 'object') {
      return { targetType: 'player', targetId: 'unknown' };
    }

    if (context.type === 'team') {
      const teamSlug = slugifyStableId(context.team || context.teamSlug || getTargetLabelFromContext(context));
      return { targetType: 'team', targetId: teamSlug };
    }

    if (context.type === 'player') {
      return { targetType: 'player', targetId: slugifyStableId(context.handle || getTargetLabelFromContext(context)) };
    }

    if (context.type === 'multi') {
      const sortedHandles = getContextCompareHandles(context);
      const joined = sortedHandles.length ? sortedHandles.join('-') : 'unknown';
      return { targetType: 'player', targetId: slugifyStableId(joined) };
    }

    return { targetType: 'player', targetId: slugifyStableId(context.handle || context.team || 'unknown') };
  }

  function buildThreadKey(context, gameId) {
    const normalizedGame = normalizeGameId(gameId, GAME_IDS.OVERWATCH);
    const gameSegment = `game:${normalizedGame}`;
    if (!context || typeof context !== 'object') {
      return `${gameSegment}|unknown:unknown`;
    }

    if (context.type === 'team') {
      const teamToken = sanitizeThreadToken(context.team || context.teamSlug || getTargetLabelFromContext(context));
      return `${gameSegment}|team:${teamToken}`;
    }

    if (context.type === 'player') {
      const playerToken = sanitizeThreadToken(context.handle || getTargetLabelFromContext(context));
      return `${gameSegment}|player:${playerToken}`;
    }

    if (context.type === 'multi') {
      const sortedHandles = getContextCompareHandles(context);
      const multiToken = sortedHandles.length ? sortedHandles.join(',') : 'unknown';
      return `${gameSegment}|multi:${multiToken}`;
    }

    return `${gameSegment}|unknown:${sanitizeThreadToken(getTargetLabelFromContext(context))}`;
  }

  function resolveActorIdentity() {
    if (state.authUser) {
      return {
        username: state.authUser.username || 'player',
        handle: state.authUser.handle || 'Shinobi'
      };
    }

    const fallbackHandle = state.profile && state.profile.publicProfile
      ? state.profile.publicProfile.displayName
      : 'Shinobi';

    return {
      username: 'guest',
      handle: fallbackHandle || 'Shinobi'
    };
  }

  function createEntityMessage(kind, sender, text, createdAt) {
    return {
      id: makeUnifiedId('msg'),
      kind: kind || 'SYSTEM',
      sender: sender || 'system',
      text: String(text || '').trim() || '-',
      createdAt: createdAt || new Date().toISOString()
    };
  }

  function getRequestDeepLink(requestId) {
    return `requests.html#request=${encodeURIComponent(String(requestId || ''))}`;
  }

  function getThreadDeepLink(threadId) {
    return `messages.html#thread=${encodeURIComponent(String(threadId || ''))}`;
  }

  function createNotificationWithDedupe(notifications, payload, nowIso) {
    const list = Array.isArray(notifications) ? notifications : [];
    const now = nowIso || new Date().toISOString();
    const nowMs = new Date(now).getTime();
    const dedupeWindowMs = 5000;

    const existing = list.find((item) => {
      if (!item || typeof item !== 'object') return false;
      if (item.type !== payload.type) return false;
      if ((item.requestId || '') !== (payload.requestId || '')) return false;
      if ((item.threadId || '') !== (payload.threadId || '')) return false;
      if ((item.deepLink || '') !== (payload.deepLink || '')) return false;
      const createdMs = new Date(item.createdAt || 0).getTime();
      if (!Number.isFinite(createdMs)) return false;
      return Math.abs(nowMs - createdMs) <= dedupeWindowMs;
    });

    if (existing) {
      return existing;
    }

    const created = {
      id: makeUnifiedId('noti'),
      type: payload.type || 'SYSTEM',
      title: payload.title || '',
      body: payload.body || '',
      requestId: payload.requestId || '',
      threadId: payload.threadId || '',
      deepLink: payload.deepLink || '',
      read: false,
      createdAt: now,
      updatedAt: now
    };
    list.push(created);
    return created;
  }

  function getRequestSubject(request) {
    const targetType = request && request.targetType === 'team' ? 'team' : 'player';
    const targetId = slugifyStableId(request && request.targetId ? request.targetId : (request && request.id ? request.id : 'unknown'));
    return { subjectType: targetType, subjectId: targetId };
  }

  function getOppositeSide(side) {
    return side === 'counterpart' ? 'self' : 'counterpart';
  }

  function getRequestRatings(entitiesState, requestId) {
    const list = Array.isArray(entitiesState && entitiesState.ratings) ? entitiesState.ratings : [];
    return list.filter((entry) => entry.requestId === requestId);
  }

  function getRatingBySide(entitiesState, requestId, side) {
    return getRequestRatings(entitiesState, requestId).find((entry) => entry.authorSide === side) || null;
  }

  function isRatingCounted(rating) {
    return !!(rating && rating.publicEligible === true && rating.countedAt);
  }

  function recomputeReputationInDraft(draft, nowIso) {
    normalizeRatingsState(draft);
    const now = nowIso || new Date().toISOString();
    const minVerified = Number(draft.reputation && draft.reputation.minVerifiedForDisplay);
    const threshold = Number.isFinite(minVerified) && minVerified > 0
      ? Math.floor(minVerified)
      : CONDUCT_MIN_VERIFIED_FOR_DISPLAY;

    const bySubjectAccum = {};
    (draft.ratings || []).forEach((rating) => {
      if (!isRatingCounted(rating)) {
        return;
      }
      const key = `${rating.subjectType}:${slugifyStableId(rating.subjectId)}`;
      if (!bySubjectAccum[key]) {
        bySubjectAccum[key] = { sum: 0, count: 0 };
      }
      bySubjectAccum[key].sum += Number(rating.stars) || 0;
      bySubjectAccum[key].count += 1;
    });

    const bySubject = {};
    Object.keys(bySubjectAccum).forEach((key) => {
      const item = bySubjectAccum[key];
      const count = item.count;
      const avg = count > 0 ? Number((item.sum / count).toFixed(1)) : 0;
      bySubject[key] = {
        avg,
        countVerified: count,
        displayMode: count >= threshold ? 'score' : 'placeholder',
        updatedAt: now
      };
    });

    draft.reputation = {
      minVerifiedForDisplay: threshold,
      bySubject,
      updatedAt: now
    };
    return draft.reputation;
  }

  function applyRatingTimeoutsInDraft(draft, nowIso) {
    normalizeRatingsState(draft);
    const now = nowIso || new Date().toISOString();
    const nowMs = new Date(now).getTime();
    let changed = false;

    (draft.requests || []).forEach((request) => {
      if (!request || typeof request !== 'object' || request.status === 'CANCELLED') {
        return;
      }
      request.tryout = normalizeTryoutState(request);

      const tryout = request.tryout;
      const selfRating = getRatingBySide(draft, request.id, 'self');
      const counterpartRating = getRatingBySide(draft, request.id, 'counterpart');
      const hasSelf = !!selfRating;
      const hasCounterpart = !!counterpartRating;

      if (!tryout.verifiedAt) {
        if (tryout.ratingRevealState !== 'pending') {
          tryout.ratingRevealState = 'pending';
          changed = true;
        }
        return;
      }

      if (!tryout.ratingWindowOpenedAt) {
        tryout.ratingWindowOpenedAt = tryout.verifiedAt;
        changed = true;
      }
      if (!tryout.ratingWindowExpiresAt && tryout.ratingWindowOpenedAt) {
        tryout.ratingWindowExpiresAt = addHoursIso(tryout.ratingWindowOpenedAt, CONDUCT_RATING_WINDOW_HOURS);
        changed = true;
      }

      if (hasSelf && hasCounterpart) {
        if (tryout.ratingRevealState !== 'revealed') {
          tryout.ratingRevealState = 'revealed';
          changed = true;
        }
        [selfRating, counterpartRating].forEach((entry) => {
          if (!entry.revealedAt) {
            entry.revealedAt = now;
            changed = true;
          }
          if (!entry.publicEligible) {
            entry.publicEligible = true;
            changed = true;
          }
          if (!entry.countedAt) {
            entry.countedAt = now;
            changed = true;
          }
        });
        return;
      }

      const singleRating = selfRating || counterpartRating;
      if (!singleRating) {
        if (tryout.ratingRevealState !== 'pending') {
          tryout.ratingRevealState = 'pending';
          changed = true;
        }
        return;
      }

      if (singleRating.publicEligible || singleRating.countedAt) {
        singleRating.publicEligible = false;
        singleRating.countedAt = null;
        changed = true;
      }

      const expiryMs = new Date(tryout.ratingWindowExpiresAt || 0).getTime();
      const isTimedOut = Number.isFinite(expiryMs) && nowMs >= expiryMs;
      const nextState = isTimedOut ? 'timeout_partial' : 'waiting';
      if (tryout.ratingRevealState !== nextState) {
        tryout.ratingRevealState = nextState;
        changed = true;
      }
    });

    return changed;
  }

  function syncConductDerivedStateOnLoad() {
    updateEntitiesState((draft) => {
      const nowIso = new Date().toISOString();
      draft.requests = (draft.requests || []).map(normalizeRequestEntity);
      normalizeRatingsState(draft);
      applyRatingTimeoutsInDraft(draft, nowIso);
      recomputeReputationInDraft(draft, nowIso);
      return draft;
    });
  }

  function formatTemplate(template, values) {
    let output = String(template || '');
    Object.keys(values || {}).forEach((key) => {
      output = output.replace(new RegExp(`\\{${key}\\}`, 'g'), String(values[key]));
    });
    return output;
  }

  function formatConductSummary(subjectType, subjectId, entitiesState) {
    const normalizedType = subjectType === 'team' ? 'team' : 'player';
    const normalizedId = slugifyStableId(subjectId);
    const entities = entitiesState || loadEntitiesState();
    const reputation = entities.reputation && typeof entities.reputation === 'object' ? entities.reputation : {};
    const threshold = Number.isFinite(Number(reputation.minVerifiedForDisplay))
      ? Math.max(1, Math.floor(Number(reputation.minVerifiedForDisplay)))
      : CONDUCT_MIN_VERIFIED_FOR_DISPLAY;
    const key = `${normalizedType}:${normalizedId}`;
    const entry = reputation.bySubject && reputation.bySubject[key] ? reputation.bySubject[key] : null;
    if (!entry || !Number.isFinite(Number(entry.countVerified)) || Number(entry.countVerified) < threshold) {
      return t('d.conduct.new');
    }
    const score = Number.isFinite(Number(entry.avg)) ? Number(entry.avg).toFixed(1) : '0.0';
    const count = Math.max(0, Math.floor(Number(entry.countVerified)));
    return formatTemplate(t('d.conduct.summary'), { score, count });
  }

  function getRatingReasonLabel(reasonCode) {
    if (!reasonCode) {
      return '';
    }
    return t(`d.rating.reason.${String(reasonCode || '').toLowerCase()}`);
  }

  function getHashParam(key) {
    const hash = String(window.location.hash || '').replace(/^#/, '');
    if (!hash) {
      return '';
    }
    const params = new URLSearchParams(hash);
    return params.get(key) || '';
  }

  function setEntityHighlight(node) {
    if (!node) {
      return;
    }
    node.classList.add('entity-highlight');
    node.scrollIntoView({ behavior: 'smooth', block: 'center' });
    window.setTimeout(() => {
      node.classList.remove('entity-highlight');
    }, 1800);
  }

  function findOrCreateThread(entitiesState, context, gameId, actorHandle, nowIso) {
    const normalizedGame = normalizeGameId(gameId, GAME_IDS.OVERWATCH);
    const threadKey = buildThreadKey(context, normalizedGame);
    let thread = entitiesState.threads.find((entry) => entry.threadKey === threadKey);
    if (thread) {
      return thread;
    }

    const targetLabel = getTargetLabelFromContext(context);
    const participants = Array.from(new Set([actorHandle, targetLabel].filter(Boolean)));
    const now = nowIso || new Date().toISOString();
    thread = {
      id: makeUnifiedId('thr'),
      threadKey,
      title: targetLabel,
      game: normalizedGame,
      participants,
      requestIds: [],
      messages: [],
      lastMessageAt: now,
      updatedAt: now
    };
    entitiesState.threads.push(thread);
    return thread;
  }

  function seedEntityStoreIfNeeded() {
    updateEntitiesState((entitiesState) => {
      const current = normalizeEntitiesState(entitiesState);
      const hasAnyData = current.requests.length > 0
        || current.threads.length > 0
        || current.notifications.length > 0
        || current.ratings.length > 0;
      if (current.seedVersion === 'b1' || hasAnyData) {
        return current;
      }

      const actor = resolveActorIdentity();
      const now = new Date();
      const t0 = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
      const t1 = new Date(now.getTime() - 70 * 60 * 1000).toISOString();
      const t2 = new Date(now.getTime() - 40 * 60 * 1000).toISOString();

      const requestOne = {
        id: makeUnifiedId('req'),
        status: 'PENDING',
        createdAt: t0,
        updatedAt: t0,
        game: GAME_IDS.OVERWATCH,
        role: 'Support',
        slot: 'Tue 20:00',
        notes: '',
        source: { type: 'team', teamSlug: 'vienna-ascend' },
        targetLabel: 'Vienna Ascend',
        targetType: 'team',
        targetId: 'vienna-ascend',
        threadId: '',
        createdBy: { username: actor.username, handle: actor.handle },
        tryout: {
          selfConfirmedAt: null,
          counterpartConfirmedAt: null,
          verifiedAt: null,
          ratingWindowOpenedAt: null,
          ratingWindowExpiresAt: null,
          ratingRevealState: 'pending'
        }
      };
      const requestTwo = {
        id: makeUnifiedId('req'),
        status: 'PENDING',
        createdAt: t1,
        updatedAt: t1,
        game: GAME_IDS.RIVALS,
        role: 'Scout',
        slot: 'Thu 19:30',
        notes: '',
        source: { type: 'team', teamSlug: 'cloud-quarter' },
        targetLabel: 'Cloud 25',
        targetType: 'team',
        targetId: 'cloud-quarter',
        threadId: '',
        createdBy: { username: actor.username, handle: actor.handle },
        tryout: {
          selfConfirmedAt: null,
          counterpartConfirmedAt: null,
          verifiedAt: null,
          ratingWindowOpenedAt: null,
          ratingWindowExpiresAt: null,
          ratingRevealState: 'pending'
        }
      };

      const threadOne = {
        id: makeUnifiedId('thr'),
        threadKey: `game:${GAME_IDS.OVERWATCH}|team:vienna-ascend`,
        title: 'Vienna Ascend',
        game: GAME_IDS.OVERWATCH,
        participants: [actor.handle, 'Vienna Ascend'],
        requestIds: [requestOne.id],
        messages: [createEntityMessage('SYSTEM', 'system', 'Invite request created for Vienna Ascend.', t0)],
        lastMessageAt: t0,
        updatedAt: t0
      };
      const threadTwo = {
        id: makeUnifiedId('thr'),
        threadKey: `game:${GAME_IDS.RIVALS}|team:cloud-quarter`,
        title: 'Cloud 25',
        game: GAME_IDS.RIVALS,
        participants: [actor.handle, 'Cloud 25'],
        requestIds: [requestTwo.id],
        messages: [createEntityMessage('SYSTEM', 'system', 'Invite request created for Cloud 25.', t1)],
        lastMessageAt: t1,
        updatedAt: t1
      };

      requestOne.threadId = threadOne.id;
      requestTwo.threadId = threadTwo.id;

      const notificationOne = {
        id: makeUnifiedId('noti'),
        type: 'REQUEST_CREATED',
        title: 'Tryout request created',
        body: 'Vienna Ascend · Overwatch',
        requestId: requestOne.id,
        threadId: threadOne.id,
        deepLink: getRequestDeepLink(requestOne.id),
        read: false,
        createdAt: t0,
        updatedAt: t0
      };
      const notificationTwo = {
        id: makeUnifiedId('noti'),
        type: 'MESSAGE_POSTED',
        title: 'New thread activity',
        body: 'Cloud 25',
        requestId: requestTwo.id,
        threadId: threadTwo.id,
        deepLink: getThreadDeepLink(threadTwo.id),
        read: false,
        createdAt: t2,
        updatedAt: t2
      };

      return {
        seedVersion: 'b1',
        requests: [requestOne, requestTwo],
        threads: [threadOne, threadTwo],
        notifications: [notificationOne, notificationTwo],
        ratings: [],
        reputation: {
          minVerifiedForDisplay: CONDUCT_MIN_VERIFIED_FOR_DISPLAY,
          bySubject: {},
          updatedAt: t2
        }
      };
    });
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

  function getGameLogoMeta(gameId) {
    const normalized = normalizeGameId(gameId, '');
    if (!ALLOWED_GAME_IDS.includes(normalized)) {
      return null;
    }
    const src = GAME_LOGO[normalized];
    if (!src) {
      return null;
    }
    const label = getGameLabel(normalized);
    return {
      src,
      label,
      alt: `${label} logo`
    };
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

  function normalizePlatform(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (raw === 'pc') return PLATFORM_IDS.PC;
    if (raw === 'playstation' || raw === 'play station' || raw === 'ps' || raw === 'ps5' || raw === 'ps4') return PLATFORM_IDS.PLAYSTATION;
    if (raw === 'xbox' || raw === 'x-box') return PLATFORM_IDS.XBOX;
    if (raw === 'switch' || raw === 'nintendo switch') return PLATFORM_IDS.SWITCH;
    return '';
  }

  function getPlatformLabel(platformValue) {
    const normalized = normalizePlatform(platformValue);
    if (normalized === PLATFORM_IDS.PC) return t('d.platform.pc');
    if (normalized === PLATFORM_IDS.PLAYSTATION) return t('d.platform.playstation');
    if (normalized === PLATFORM_IDS.XBOX) return t('d.platform.xbox');
    if (normalized === PLATFORM_IDS.SWITCH) return t('d.platform.switch');
    return '—';
  }

  function resolvePlatformForGame(entry, player) {
    const entryPlatform = normalizePlatform(entry && entry.platform ? entry.platform : '');
    if (entryPlatform) {
      return entryPlatform;
    }
    const playerPlatform = normalizePlatform(player && player.platform ? player.platform : '');
    if (playerPlatform) {
      return playerPlatform;
    }
    return '';
  }

  function formatPlatformList(values) {
    const list = Array.isArray(values) ? values : [];
    const normalized = Array.from(
      new Set(list.map((value) => normalizePlatform(value)).filter((value) => ALLOWED_PLATFORM_IDS.includes(value)))
    );
    if (!normalized.length) {
      return '—';
    }
    return normalized.map((value) => getPlatformLabel(value)).join(' · ');
  }

  function hashStringDeterministic(input) {
    return hashString(String(input || ''));
  }

  function normalizeAvatarStyle(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === AVATAR_STYLE_IDS.MONO) return AVATAR_STYLE_IDS.MONO;
    if (normalized === AVATAR_STYLE_IDS.SYMBOL) return AVATAR_STYLE_IDS.SYMBOL;
    if (normalized === AVATAR_STYLE_IDS.BRAND) return AVATAR_STYLE_IDS.BRAND;
    return '';
  }

  function normalizeAvatarShape(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === AVATAR_SHAPE_IDS.CIRCLE) return AVATAR_SHAPE_IDS.CIRCLE;
    if (normalized === AVATAR_SHAPE_IDS.SHIELD) return AVATAR_SHAPE_IDS.SHIELD;
    if (normalized === AVATAR_SHAPE_IDS.HEX) return AVATAR_SHAPE_IDS.HEX;
    if (normalized === AVATAR_SHAPE_IDS.DIAMOND) return AVATAR_SHAPE_IDS.DIAMOND;
    return '';
  }

  function normalizeAvatarAccent(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === AVATAR_ACCENT_IDS.CYAN) return AVATAR_ACCENT_IDS.CYAN;
    if (normalized === AVATAR_ACCENT_IDS.GOLD) return AVATAR_ACCENT_IDS.GOLD;
    if (normalized === AVATAR_ACCENT_IDS.SILVER) return AVATAR_ACCENT_IDS.SILVER;
    if (normalized === AVATAR_ACCENT_IDS.TEAL) return AVATAR_ACCENT_IDS.TEAL;
    if (normalized === AVATAR_ACCENT_IDS.VIOLET) return AVATAR_ACCENT_IDS.VIOLET;
    return '';
  }

  function getAvatarInitials(name, fallback) {
    const safeFallback = String(fallback || 'PL').slice(0, 2).toUpperCase();
    const raw = String(name || '').trim();
    if (!raw) {
      return safeFallback;
    }
    const parts = raw.split(/\s+/).filter(Boolean);
    if (!parts.length) {
      return safeFallback;
    }
    if (parts.length === 1) {
      const value = parts[0].replace(/[^a-zA-Z0-9]/g, '').slice(0, 2).toUpperCase();
      return value || safeFallback;
    }
    const initials = `${parts[0][0] || ''}${parts[parts.length - 1][0] || ''}`.toUpperCase();
    return initials || safeFallback;
  }

  function deriveAvatarVisualSeed(entity) {
    const source = entity && typeof entity === 'object'
      ? (entity.handle || entity.displayName || entity.name || entity.slug || entity.id || 'gamein')
      : String(entity || 'gamein');
    const hash = hashStringDeterministic(source);
    const styleBucket = hash % 10;
    const style = styleBucket < 7
      ? AVATAR_STYLE_IDS.MONO
      : styleBucket < 9
        ? AVATAR_STYLE_IDS.BRAND
        : AVATAR_STYLE_IDS.SYMBOL;
    const shape = ALLOWED_AVATAR_SHAPES[hash % ALLOWED_AVATAR_SHAPES.length];
    const accent = ALLOWED_AVATAR_ACCENTS[hash % ALLOWED_AVATAR_ACCENTS.length];
    const glyph = AVATAR_GLYPH_KEYS[hash % AVATAR_GLYPH_KEYS.length];
    return { style, shape, accent, glyph };
  }

  function resolveAvatarConfig(entity, fallbackName, options) {
    const safeEntity = entity && typeof entity === 'object' ? entity : {};
    const opts = options && typeof options === 'object' ? options : {};
    const seed = deriveAvatarVisualSeed({
      handle: safeEntity.handle || safeEntity.displayName || safeEntity.name || safeEntity.slug || fallbackName || 'gamein'
    });
    const preferredStyle = normalizeAvatarStyle(opts.preferredStyle);
    const style = normalizeAvatarStyle(safeEntity.avatarStyle) || preferredStyle || seed.style;
    const shape = normalizeAvatarShape(safeEntity.avatarShape) || seed.shape;
    const accent = normalizeAvatarAccent(safeEntity.avatarAccent) || seed.accent;
    const glyphKeyRaw = String(safeEntity.avatarGlyph || '').trim().toLowerCase();
    const glyphKey = AVATAR_GLYPH_KEYS.includes(glyphKeyRaw) ? glyphKeyRaw : seed.glyph;
    const initials = getAvatarInitials(
      safeEntity.avatarInitials || safeEntity.displayName || safeEntity.handle || safeEntity.name || fallbackName || 'PL',
      'PL'
    );
    return {
      style,
      shape,
      accent,
      glyph: glyphKey,
      initials
    };
  }

  function renderAvatarBadgeHTML(config, options) {
    const safeConfig = config && typeof config === 'object' ? config : resolveAvatarConfig({}, 'PL');
    const opts = options && typeof options === 'object' ? options : {};
    const size = opts.size === 'sm' || opts.size === 'lg' ? opts.size : 'md';
    const classes = [
      'avatar-badge',
      `avatar-badge--${size}`,
      `avatar-badge--${safeConfig.style}`,
      `is-${safeConfig.shape}`,
      `accent-${safeConfig.accent}`
    ];
    if (opts.className) {
      classes.push(opts.className);
    }
    const glyphLabel = AVATAR_GLYPH_LABELS[safeConfig.glyph] || '+';
    const content = safeConfig.style === AVATAR_STYLE_IDS.SYMBOL
      ? `<span class="avatar-badge__glyph" aria-hidden="true">${escapeHtml(glyphLabel)}</span>`
      : `<span class="avatar-badge__initials" aria-hidden="true">${escapeHtml(safeConfig.initials)}</span>`;
    const mark = safeConfig.style === AVATAR_STYLE_IDS.BRAND
      ? '<span class="avatar-badge__brand-mark" aria-hidden="true"></span>'
      : '';
    const ariaLabel = opts.ariaLabel || t('d.avatar.defaultAlt');
    return `<span class="${classes.join(' ')}" role="img" aria-label="${escapeHtml(ariaLabel)}">${mark}${content}</span>`;
  }

  function getRankVisualShortCode(tier) {
    const normalized = String(tier || '').trim().toLowerCase();
    if (!normalized) return '—';
    if (normalized === 'one above all') return 'OAA';
    if (normalized === 'grandmaster') return 'GM';
    if (normalized === 'master') return 'M';
    if (normalized === 'diamond') return 'D';
    if (normalized === 'platinum') return 'P';
    if (normalized === 'gold') return 'G';
    if (normalized === 'silver') return 'S';
    if (normalized === 'bronze') return 'B';
    if (normalized === 'emerald') return 'E';
    if (normalized === 'challenger') return 'CH';
    if (normalized === 'champion') return 'C';
    if (normalized === 'elite') return 'EL';
    if (normalized === 'unreal') return 'UR';
    if (normalized === 'celestial') return 'CL';
    if (normalized === 'eternity') return 'ET';
    if (normalized === 'iron') return 'IR';
    return String(tier || '-').slice(0, 2).toUpperCase();
  }

  function renderRankVisual(entry, gameKey) {
    const normalizedGame = getProfileGameKeyFromExploreGame(gameKey);
    const rankText = entry && typeof entry === 'object'
      ? String(entry.rank || entry.tier || '')
      : String(entry || '');
    const tier = normalizedGame ? extractTierFromExploreRank(normalizedGame, rankText) : '';
    const shortCode = getRankVisualShortCode(tier || rankText);
    const tone = tier ? String(tier).toLowerCase().replace(/\s+/g, '-') : 'unknown';
    const title = tier || rankText || '-';
    return `<span class="rank-visual rank-visual--${escapeHtml(tone)}" title="${escapeHtml(title)}">${escapeHtml(shortCode)}</span>`;
  }

  function normalizeProviderKey(provider) {
    const raw = String(provider || '').trim().toLowerCase();
    if (raw === 'battle.net' || raw === 'battlenet' || raw === 'battle net') return 'battle_net';
    if (raw === 'riot') return 'riot';
    if (raw === 'epic') return 'epic';
    if (raw === 'steam') return 'steam';
    if (raw === 'playstation' || raw === 'play station') return 'playstation';
    if (raw === 'xbox' || raw === 'x-box') return 'xbox';
    return slugifyStableId(raw || 'provider');
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
        avatarStyle: AVATAR_STYLE_IDS.BRAND,
        avatarShape: AVATAR_SHAPE_IDS.CIRCLE,
        avatarAccent: AVATAR_ACCENT_IDS.CYAN,
        avatarGlyph: 'crosshair',
        avatarInitials: 'SN',
        headline: 'Flex DPS focused on team systems, comms discipline and measurable improvement.',
        about: 'Known for calm mid-round communication, role flexibility across metas and consistent VOD review habits.',
        proofStatus: PROOF_STATUS.SELF_DECLARED,
        mainGame: 'overwatch',
        availability: 'Any',
        availabilityDetail: '',
        games: {
          overwatch: { handle: 'Shinobi#4728', tier: 'Master', division: '3', platform: PLATFORM_IDS.PC },
          lol: { handle: 'Shn0bi', tier: 'Diamond', division: 'II', platform: PLATFORM_IDS.PC },
          rivals: { handle: 'ShinobiX', tier: 'Grandmaster', platform: PLATFORM_IDS.PC },
          fortnite: { handle: 'ShinobiFN', tier: 'Champion', division: 'II', platform: PLATFORM_IDS.PLAYSTATION }
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
      tier,
      platform: normalizePlatform(source.platform) || normalizePlatform(fallbackValue.platform) || ''
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
    normalized.publicProfile.avatarStyle = normalizeAvatarStyle(sourcePublic.avatarStyle)
      || normalizeAvatarStyle(defaults.publicProfile.avatarStyle)
      || AVATAR_STYLE_IDS.BRAND;
    normalized.publicProfile.avatarShape = normalizeAvatarShape(sourcePublic.avatarShape)
      || normalizeAvatarShape(defaults.publicProfile.avatarShape)
      || AVATAR_SHAPE_IDS.CIRCLE;
    normalized.publicProfile.avatarAccent = normalizeAvatarAccent(sourcePublic.avatarAccent)
      || normalizeAvatarAccent(defaults.publicProfile.avatarAccent)
      || AVATAR_ACCENT_IDS.CYAN;
    normalized.publicProfile.avatarGlyph = AVATAR_GLYPH_KEYS.includes(String(sourcePublic.avatarGlyph || '').trim().toLowerCase())
      ? String(sourcePublic.avatarGlyph || '').trim().toLowerCase()
      : defaults.publicProfile.avatarGlyph;
    normalized.publicProfile.avatarInitials = sanitizeTextValue(sourcePublic.avatarInitials, defaults.publicProfile.avatarInitials, 4);
    normalized.publicProfile.headline = sanitizeTextValue(sourcePublic.headline, defaults.publicProfile.headline, 170);
    normalized.publicProfile.about = sanitizeTextValue(sourcePublic.about, defaults.publicProfile.about, 280);
    normalized.publicProfile.proofStatus = normalizeProofStatus(sourcePublic.proofStatus, defaults.publicProfile.proofStatus);
    normalized.publicProfile.mainGame = ['overwatch', 'lol', 'rivals', 'fortnite'].includes(sourcePublic.mainGame)
      ? sourcePublic.mainGame
      : defaults.publicProfile.mainGame;
    normalized.publicProfile.availability = normalizeAvailability(sourcePublic.availability);
    normalized.publicProfile.availabilityDetail = sanitizeTextValue(sourcePublic.availabilityDetail, '', 80);

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
      availabilityDetail: 'Mon-Fri 19:00-22:00 CET',
      lookingFor: ['Team', 'Tryouts'],
      hook: 'calm',
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
      availabilityDetail: 'Sat-Sun 10:00-13:00 CET',
      lookingFor: ['Scrims', 'Tryouts'],
      hook: 'mapaware',
      games: [
        { game: GAME_IDS.RIVALS, role: 'Scout', rank: 'Diamond', peak: 'Grandmaster', proof: PROOF_STATUS.SELF_DECLARED },
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
      hook: 'teamfirst',
      games: [
        { game: GAME_IDS.OVERWATCH, role: 'Flex DPS', rank: 'Master', peak: 'Grandmaster', proof: PROOF_STATUS.SELF_DECLARED },
        { game: GAME_IDS.FORTNITE, role: 'IGL', rank: 'Champion', peak: 'Unreal', proof: PROOF_STATUS.SELF_DECLARED }
      ]
    },
    {
      handle: 'AegisTank',
      region: 'NA',
      country: 'US',
      language: ['EN'],
      availability: 'Weeknights',
      lookingFor: ['Team'],
      hook: 'anchor',
      games: [
        { game: GAME_IDS.OVERWATCH, role: 'Tank', rank: 'Grandmaster 4', peak: 'Champion 5', proof: PROOF_STATUS.RANK_VERIFIED }
      ]
    },
    {
      handle: 'PulseDPS',
      region: 'APAC',
      country: 'KR',
      language: ['KR', 'EN'],
      availability: 'Weeknights',
      availabilityDetail: 'Mon-Thu 20:00-23:00 KST',
      lookingFor: ['Tryouts'],
      games: [
        { game: GAME_IDS.OVERWATCH, role: 'DPS', rank: 'Master 2', peak: 'Grandmaster 3', proof: PROOF_STATUS.ACCOUNT_CONNECTED }
      ]
    },
    {
      handle: 'OrbitSupport',
      region: 'EU',
      country: 'FR',
      language: ['FR', 'EN'],
      availability: 'Weekend',
      lookingFor: ['Team', 'Scrims'],
      hook: 'vod',
      games: [
        { game: GAME_IDS.OVERWATCH, role: 'Support', rank: 'Diamond 1', peak: 'Master 5', proof: PROOF_STATUS.SELF_DECLARED }
      ]
    },
    {
      handle: 'FrostAnchor',
      region: 'EU',
      country: 'SE',
      language: ['EN', 'SE'],
      availability: 'Weeknights',
      lookingFor: ['Team'],
      games: [
        { game: GAME_IDS.OVERWATCH, role: 'Tank', rank: 'Master 4', peak: 'Grandmaster 5', proof: PROOF_STATUS.ACCOUNT_CONNECTED }
      ]
    },
    {
      handle: 'ZenithTracer',
      region: 'NA',
      country: 'CA',
      language: ['EN'],
      availability: 'Weekend',
      availabilityDetail: 'Fri-Sun 18:00-22:00 ET',
      lookingFor: ['Tryouts', 'Scrims'],
      hook: 'tempo',
      games: [
        { game: GAME_IDS.OVERWATCH, role: 'DPS', rank: 'Grandmaster 5', peak: 'Champion 3', proof: PROOF_STATUS.RANK_VERIFIED }
      ]
    },
    {
      handle: 'TopLaneTide',
      region: 'EU',
      country: 'NL',
      language: ['EN', 'NL'],
      availability: 'Weeknights',
      lookingFor: ['Team'],
      games: [
        { game: GAME_IDS.LOL, role: 'Top', rank: 'Emerald I', peak: 'Diamond IV', proof: PROOF_STATUS.ACCOUNT_CONNECTED }
      ]
    },
    {
      handle: 'JungleMint',
      region: 'NA',
      country: 'US',
      language: ['EN'],
      availability: 'Weeknights',
      availabilityDetail: 'Mon-Fri 20:00-23:00 PT',
      lookingFor: ['Tryouts'],
      hook: 'macro',
      games: [
        { game: GAME_IDS.LOL, role: 'Jungle', rank: 'Master', peak: 'Grandmaster', proof: PROOF_STATUS.RANK_VERIFIED }
      ]
    },
    {
      handle: 'MidNova',
      region: 'APAC',
      country: 'JP',
      language: ['JP', 'EN'],
      availability: 'Weekend',
      lookingFor: ['Team', 'Scrims'],
      games: [
        { game: GAME_IDS.LOL, role: 'Mid', rank: 'Diamond II', peak: 'Master', proof: PROOF_STATUS.SELF_DECLARED }
      ]
    },
    {
      handle: 'BotEcho',
      region: 'EU',
      country: 'GB',
      language: ['EN'],
      availability: 'Weeknights',
      lookingFor: ['Tryouts'],
      hook: 'stable',
      games: [
        { game: GAME_IDS.LOL, role: 'ADC', rank: 'Diamond I', peak: 'Master', proof: PROOF_STATUS.ACCOUNT_CONNECTED }
      ]
    },
    {
      handle: 'RiftShield',
      region: 'NA',
      country: 'MX',
      language: ['ES', 'EN'],
      availability: 'Weekend',
      availabilityDetail: 'Sat-Sun 12:00-16:00 CT',
      lookingFor: ['Team'],
      games: [
        { game: GAME_IDS.LOL, role: 'Support', rank: 'Platinum II', peak: 'Diamond IV', proof: PROOF_STATUS.SELF_DECLARED }
      ]
    },
    {
      handle: 'TacticBloom',
      region: 'EU',
      country: 'DE',
      language: ['DE', 'EN'],
      availability: 'Weeknights',
      lookingFor: ['Team', 'Tryouts'],
      games: [
        { game: GAME_IDS.LOL, role: 'Mid', rank: 'Diamond III', peak: 'Master', proof: PROOF_STATUS.ACCOUNT_CONNECTED }
      ]
    },
    {
      handle: 'CrownIGL',
      region: 'EU',
      country: 'PL',
      language: ['PL', 'EN'],
      availability: 'Weeknights',
      availabilityDetail: 'Mon-Thu 19:30-23:00 CET',
      lookingFor: ['Team'],
      hook: 'shotcall',
      games: [
        { game: GAME_IDS.FORTNITE, role: 'IGL', rank: 'Champion II', peak: 'Unreal', proof: PROOF_STATUS.RANK_VERIFIED }
      ]
    },
    {
      handle: 'StormFragger',
      region: 'NA',
      country: 'US',
      language: ['EN'],
      availability: 'Weekend',
      lookingFor: ['Tryouts', 'Scrims'],
      games: [
        { game: GAME_IDS.FORTNITE, role: 'Fragger', rank: 'Elite', peak: 'Champion', proof: PROOF_STATUS.ACCOUNT_CONNECTED }
      ]
    },
    {
      handle: 'PixelSupport',
      region: 'APAC',
      country: 'AU',
      language: ['EN'],
      availability: 'Weeknights',
      lookingFor: ['Team'],
      hook: 'utility',
      games: [
        { game: GAME_IDS.FORTNITE, role: 'Support', rank: 'Diamond III', peak: 'Elite', proof: PROOF_STATUS.SELF_DECLARED }
      ]
    },
    {
      handle: 'ZoneCaller',
      region: 'EU',
      country: 'IT',
      language: ['IT', 'EN'],
      availability: 'Weeknights',
      availabilityDetail: 'Tue-Thu 20:00-22:30 CET',
      lookingFor: ['Team', 'Tryouts'],
      games: [
        { game: GAME_IDS.FORTNITE, role: 'IGL', rank: 'Champion I', peak: 'Unreal', proof: PROOF_STATUS.ACCOUNT_CONNECTED }
      ]
    },
    {
      handle: 'ClutchSpark',
      region: 'NA',
      country: 'CA',
      language: ['EN', 'FR'],
      availability: 'Weekend',
      lookingFor: ['Scrims'],
      hook: 'lateclutch',
      games: [
        { game: GAME_IDS.FORTNITE, role: 'Fragger', rank: 'Champion III', peak: 'Champion I', proof: PROOF_STATUS.SELF_DECLARED }
      ]
    },
    {
      handle: 'VanguardRay',
      region: 'EU',
      country: 'ES',
      language: ['ES', 'EN'],
      availability: 'Weeknights',
      lookingFor: ['Team'],
      games: [
        { game: GAME_IDS.RIVALS, role: 'Vanguard', rank: 'Diamond', peak: 'Grandmaster', proof: PROOF_STATUS.ACCOUNT_CONNECTED }
      ]
    },
    {
      handle: 'DuelistHex',
      region: 'NA',
      country: 'US',
      language: ['EN'],
      availability: 'Weeknights',
      availabilityDetail: 'Mon-Fri 18:00-21:00 PT',
      lookingFor: ['Tryouts'],
      hook: 'entry',
      games: [
        { game: GAME_IDS.RIVALS, role: 'Duelist', rank: 'Grandmaster', peak: 'Celestial', proof: PROOF_STATUS.RANK_VERIFIED }
      ]
    },
    {
      handle: 'StrategistIvy',
      region: 'APAC',
      country: 'IN',
      language: ['EN'],
      availability: 'Weekend',
      lookingFor: ['Team', 'Scrims'],
      games: [
        { game: GAME_IDS.RIVALS, role: 'Strategist', rank: 'Platinum', peak: 'Diamond', proof: PROOF_STATUS.SELF_DECLARED }
      ]
    },
    {
      handle: 'ScoutMako',
      region: 'EU',
      country: 'PT',
      language: ['PT', 'EN'],
      availability: 'Weeknights',
      lookingFor: ['Tryouts'],
      hook: 'pathing',
      games: [
        { game: GAME_IDS.RIVALS, role: 'Scout', rank: 'Diamond', peak: 'Grandmaster', proof: PROOF_STATUS.ACCOUNT_CONNECTED }
      ]
    },
    {
      handle: 'CelestialV',
      region: 'NA',
      country: 'BR',
      language: ['PT', 'EN'],
      availability: 'Weekend',
      availabilityDetail: 'Sat-Sun 11:00-15:00 BRT',
      lookingFor: ['Team'],
      games: [
        { game: GAME_IDS.RIVALS, role: 'Vanguard', rank: 'Celestial', peak: 'Eternity', proof: PROOF_STATUS.SELF_DECLARED }
      ]
    },
    {
      handle: 'RuneDuel',
      region: 'APAC',
      country: 'KR',
      language: ['KR', 'EN'],
      availability: 'Weeknights',
      lookingFor: ['Tryouts'],
      games: [
        { game: GAME_IDS.RIVALS, role: 'Duelist', rank: 'Grandmaster', peak: 'Celestial', proof: PROOF_STATUS.ACCOUNT_CONNECTED }
      ]
    }
  ];

  const PLAYER_PLATFORM_OVERRIDES = {
    ValkyrieEU: PLATFORM_IDS.PC,
    ArcScout: PLATFORM_IDS.PC,
    Shinobi: PLATFORM_IDS.PLAYSTATION,
    AegisTank: PLATFORM_IDS.PC,
    PulseDPS: PLATFORM_IDS.PC,
    OrbitSupport: PLATFORM_IDS.PC,
    FrostAnchor: PLATFORM_IDS.PC,
    ZenithTracer: PLATFORM_IDS.PC,
    TopLaneTide: PLATFORM_IDS.PC,
    JungleMint: PLATFORM_IDS.PC,
    MidNova: PLATFORM_IDS.PC,
    BotEcho: PLATFORM_IDS.PC,
    RiftShield: PLATFORM_IDS.PC,
    TacticBloom: PLATFORM_IDS.PC,
    CrownIGL: PLATFORM_IDS.PLAYSTATION,
    StormFragger: PLATFORM_IDS.XBOX,
    PixelSupport: PLATFORM_IDS.PC,
    ZoneCaller: PLATFORM_IDS.SWITCH,
    ClutchSpark: PLATFORM_IDS.PLAYSTATION,
    VanguardRay: PLATFORM_IDS.PC,
    DuelistHex: PLATFORM_IDS.PC,
    StrategistIvy: PLATFORM_IDS.PC,
    ScoutMako: PLATFORM_IDS.PC,
    CelestialV: PLATFORM_IDS.XBOX,
    RuneDuel: PLATFORM_IDS.PC
  };

  players.forEach((player) => {
    const fallbackPlatform = normalizePlatform(PLAYER_PLATFORM_OVERRIDES[player.handle]);
    const topLevelPlatform = normalizePlatform(player.platform) || fallbackPlatform || '';
    if (topLevelPlatform) {
      player.platform = topLevelPlatform;
    }
    if (!Array.isArray(player.games)) {
      return;
    }
    player.games.forEach((entry) => {
      const normalizedPlatform = normalizePlatform(entry && entry.platform);
      entry.platform = normalizedPlatform || topLevelPlatform || '';
    });
  });

  const teams = [
    {
      slug: 'vienna-ascend',
      name: 'Vienna Ascend',
      region: 'EU',
      verified: PROOF_STATUS.ACCOUNT_CONNECTED,
      availability: 'Weeknights',
      availabilityDetail: 'Mon/Wed/Fri 19:00-22:00 CET',
      hook: 'system',
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
      availability: 'Weeknights',
      hook: 'discipline',
      games: [
        {
          game: GAME_IDS.FORTNITE,
          needs: [{ role: 'IGL', rankMin: 'Champion' }]
        },
        {
          game: GAME_IDS.RIVALS,
          needs: [{ role: 'Scout', rankMin: 'Diamond' }]
        }
      ],
      schedule: 'Tue/Thu 20:00-23:00 CET'
    },
    {
      slug: 'northforge-ow',
      name: 'Northforge OW',
      region: 'NA',
      verified: PROOF_STATUS.ACCOUNT_CONNECTED,
      availability: 'Weeknights',
      availabilityDetail: 'Mon-Thu 20:00-23:00 ET',
      games: [
        {
          game: GAME_IDS.OVERWATCH,
          needs: [
            { role: 'Tank', rankMin: 'Diamond' },
            { role: 'DPS', rankMin: 'Master' }
          ]
        }
      ],
      schedule: 'Mon/Wed/Fri 20:00-23:00 ET'
    },
    {
      slug: 'payload-union',
      name: 'Payload Union',
      region: 'APAC',
      verified: PROOF_STATUS.SELF_DECLARED,
      availability: 'Weekend',
      games: [
        {
          game: GAME_IDS.OVERWATCH,
          needs: [
            { role: 'Support', rankMin: 'Diamond' },
            { role: 'DPS', rankMin: 'Diamond' }
          ]
        }
      ],
      schedule: 'Sat/Sun 18:00-22:00 KST'
    },
    {
      slug: 'river-wardens',
      name: 'River Wardens',
      region: 'EU',
      verified: PROOF_STATUS.RANK_VERIFIED,
      availability: 'Weeknights',
      hook: 'macro',
      games: [
        {
          game: GAME_IDS.LOL,
          needs: [
            { role: 'Top', rankMin: 'Diamond' },
            { role: 'Support', rankMin: 'Emerald' }
          ]
        }
      ],
      schedule: 'Tue/Thu 19:00-22:00 CET'
    },
    {
      slug: 'midlane-district',
      name: 'Midlane District',
      region: 'NA',
      verified: PROOF_STATUS.ACCOUNT_CONNECTED,
      availability: 'Weekend',
      availabilityDetail: 'Sat-Sun 14:00-18:00 PT',
      games: [
        {
          game: GAME_IDS.LOL,
          needs: [
            { role: 'Mid', rankMin: 'Master' },
            { role: 'Jungle', rankMin: 'Diamond' }
          ]
        }
      ],
      schedule: 'Sat/Sun 14:00-18:00 PT'
    },
    {
      slug: 'storm-harbor',
      name: 'Storm Harbor',
      region: 'EU',
      verified: PROOF_STATUS.RANK_VERIFIED,
      availability: 'Weeknights',
      games: [
        {
          game: GAME_IDS.FORTNITE,
          needs: [
            { role: 'IGL', rankMin: 'Champion' },
            { role: 'Fragger', rankMin: 'Elite' }
          ]
        }
      ],
      schedule: 'Mon/Wed/Fri 20:00-23:00 CET'
    },
    {
      slug: 'last-circle-labs',
      name: 'Last Circle Labs',
      region: 'APAC',
      verified: PROOF_STATUS.SELF_DECLARED,
      availability: 'Weekend',
      hook: 'clutch',
      games: [
        {
          game: GAME_IDS.FORTNITE,
          needs: [
            { role: 'Support', rankMin: 'Diamond' },
            { role: 'Fragger', rankMin: 'Champion' }
          ]
        }
      ],
      schedule: 'Sat/Sun 19:00-23:00 AEST'
    },
    {
      slug: 'neon-vanguard',
      name: 'Neon Vanguard',
      region: 'EU',
      verified: PROOF_STATUS.ACCOUNT_CONNECTED,
      availability: 'Weeknights',
      availabilityDetail: 'Mon-Thu 19:30-22:30 CET',
      games: [
        {
          game: GAME_IDS.RIVALS,
          needs: [
            { role: 'Vanguard', rankMin: 'Diamond' },
            { role: 'Strategist', rankMin: 'Diamond' }
          ]
        }
      ],
      schedule: 'Mon/Thu 19:30-22:30 CET'
    },
    {
      slug: 'quantum-sigil',
      name: 'Quantum Sigil',
      region: 'NA',
      verified: PROOF_STATUS.SELF_DECLARED,
      availability: 'Weekend',
      games: [
        {
          game: GAME_IDS.RIVALS,
          needs: [
            { role: 'Duelist', rankMin: 'Grandmaster' },
            { role: 'Scout', rankMin: 'Diamond' }
          ]
        }
      ],
      schedule: 'Sat/Sun 17:00-21:00 ET'
    },
    {
      slug: 'crossfire-labs',
      name: 'Crossfire Labs',
      region: 'EU',
      verified: PROOF_STATUS.ACCOUNT_CONNECTED,
      availability: 'Any',
      games: [
        {
          game: GAME_IDS.OVERWATCH,
          needs: [{ role: 'Support', rankMin: 'Master' }]
        },
        {
          game: GAME_IDS.FORTNITE,
          needs: [{ role: 'IGL', rankMin: 'Champion' }]
        }
      ],
      schedule: 'Flexible blocks'
    },
    {
      slug: 'astral-path',
      name: 'Astral Path',
      region: 'APAC',
      verified: PROOF_STATUS.RANK_VERIFIED,
      availability: 'Weeknights',
      hook: 'structured',
      games: [
        {
          game: GAME_IDS.LOL,
          needs: [{ role: 'ADC', rankMin: 'Diamond' }]
        },
        {
          game: GAME_IDS.RIVALS,
          needs: [{ role: 'Strategist', rankMin: 'Diamond' }]
        }
      ],
      schedule: 'Tue/Thu 19:00-22:00 JST'
    }
  ];

  const TEAM_PLATFORM_OVERRIDES = {
    'vienna-ascend': [PLATFORM_IDS.PC],
    'cloud-quarter': [PLATFORM_IDS.PC, PLATFORM_IDS.PLAYSTATION],
    'northforge-ow': [PLATFORM_IDS.PC],
    'payload-union': [PLATFORM_IDS.PLAYSTATION, PLATFORM_IDS.XBOX],
    'river-wardens': [PLATFORM_IDS.PC],
    'midlane-district': [PLATFORM_IDS.PC],
    'storm-harbor': [PLATFORM_IDS.PLAYSTATION, PLATFORM_IDS.XBOX],
    'last-circle-labs': [PLATFORM_IDS.PC, PLATFORM_IDS.SWITCH],
    'neon-vanguard': [PLATFORM_IDS.PC, PLATFORM_IDS.PLAYSTATION],
    'quantum-sigil': [PLATFORM_IDS.PC, PLATFORM_IDS.XBOX],
    'crossfire-labs': [PLATFORM_IDS.PC, PLATFORM_IDS.PLAYSTATION],
    'astral-path': [PLATFORM_IDS.PC]
  };

  teams.forEach((team) => {
    const configured = Array.isArray(team.platforms) ? team.platforms : TEAM_PLATFORM_OVERRIDES[team.slug];
    const normalized = Array.isArray(configured)
      ? configured.map((value) => normalizePlatform(value)).filter((value) => ALLOWED_PLATFORM_IDS.includes(value))
      : [];
    if (normalized.length) {
      team.platforms = Array.from(new Set(normalized));
    }
  });

  players.forEach((player) => {
    const avatar = resolveAvatarConfig(player, player.handle);
    player.avatarStyle = normalizeAvatarStyle(player.avatarStyle) || avatar.style;
    player.avatarShape = normalizeAvatarShape(player.avatarShape) || avatar.shape;
    player.avatarAccent = normalizeAvatarAccent(player.avatarAccent) || avatar.accent;
    player.avatarGlyph = AVATAR_GLYPH_KEYS.includes(String(player.avatarGlyph || '').trim().toLowerCase())
      ? String(player.avatarGlyph || '').trim().toLowerCase()
      : avatar.glyph;
    player.avatarInitials = sanitizeTextValue(player.avatarInitials, avatar.initials, 4);
  });

  teams.forEach((team) => {
    const avatar = resolveAvatarConfig(team, team.name);
    team.avatarStyle = normalizeAvatarStyle(team.avatarStyle) || avatar.style;
    team.avatarShape = normalizeAvatarShape(team.avatarShape) || avatar.shape;
    team.avatarAccent = normalizeAvatarAccent(team.avatarAccent) || avatar.accent;
    team.avatarGlyph = AVATAR_GLYPH_KEYS.includes(String(team.avatarGlyph || '').trim().toLowerCase())
      ? String(team.avatarGlyph || '').trim().toLowerCase()
      : avatar.glyph;
    team.avatarInitials = sanitizeTextValue(team.avatarInitials, avatar.initials, 4);
  });

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
      'd.messages.meta.count': 'messages',
      'd.messages.meta.unread': 'unread',
      'd.messages.threads.empty': 'No threads yet.',
      'd.messages.empty': 'Select a thread to view messages.',
      'd.messages.send': 'Send message',
      'd.messages.sending': 'Sending...',
      'd.messages.field.to': 'To',
      'd.messages.field.draft': 'Draft',
      'd.requests.empty': 'No requests yet.',
      'd.requests.status.pending': 'Pending',
      'd.requests.status.completed': 'Completed',
      'd.requests.status.cancelled': 'Cancelled',
      'd.requests.cancel': 'Cancel',
      'd.requests.openThread': 'Open thread',
      'd.requests.confirmCompleted': 'Confirm completed',
      'd.requests.rate': 'Rate tryout',
      'd.requests.processing': 'Updating...',
      'd.requests.tryout.label': 'Tryout',
      'd.requests.tryout.pending': 'Pending confirmation',
      'd.requests.tryout.partial': 'Partially confirmed',
      'd.requests.tryout.verified': 'Verified tryout',
      'd.requests.tryout.cancelled': 'Cancelled',
      'd.requests.rating.label': 'Rating',
      'd.requests.rating.locked': 'Available after verified completion',
      'd.requests.rating.notStarted': 'Not submitted',
      'd.requests.rating.waitingCounterpart': 'Submitted. Waiting for counterpart',
      'd.requests.rating.waitingYou': 'Counterpart submitted. Waiting for your rating',
      'd.requests.rating.timeoutSelf': 'Submitted ★{stars}. Timeout: visible only to you',
      'd.requests.rating.timeoutCounterpart': 'Counterpart timeout. You can still rate',
      'd.requests.rating.revealed': 'Revealed · You ★{you} · Counterpart ★{counterpart}',
      'd.requests.rating.saved': 'Rating saved.',
      'd.requests.completion.saved': 'Completion saved.',
      'd.requests.system.selfCompleted': 'You confirmed tryout completion.',
      'd.requests.system.counterpartCompleted': 'Counterpart completion confirmed.',
      'd.requests.demo.counterpartComplete': 'Demo: confirm counterpart',
      'd.requests.demo.counterpartRate': 'Demo: counterpart rating',
      'd.rating.title': 'Rate tryout conduct',
      'd.rating.stars': 'Stars',
      'd.rating.reason': 'Reason (required for 1–2 stars)',
      'd.rating.reason.placeholder': 'Select reason',
      'd.rating.reason.no_show': 'No-show',
      'd.rating.reason.toxic_communication': 'Toxic communication',
      'd.rating.reason.unreliable_commitment': 'Unreliable commitment',
      'd.rating.reason.role_mismatch': 'Role mismatch',
      'd.rating.submit': 'Submit rating',
      'd.conduct.summary': '★ {score} ({count} verified)',
      'd.conduct.new': '★ — (New)',
      'd.notifications.meta.mentions.two': '3 profile views · 1 direct mention · Last 24h',
      'd.notifications.meta.updates.oneTitle': 'Rank requirement update',
      'd.notifications.meta.updates.twoTitle': 'Tryout slot shift',
      'd.notifications.meta.updates.twoText': 'Cloud 25 moved Thursday block to 20:30 CET',
      'd.notifications.meta.system.oneTitle': 'Account Access',
      'd.notifications.meta.system.twoTitle': 'Profile proof state',
      'd.notifications.meta.system.twoText': 'Connected account badges are visible, rank verification expands in early access.',
      'd.notifications.empty.unread': 'No unread notifications.',
      'd.notifications.empty.read': 'No read notifications yet.',
      'd.notifications.markAllRead': 'Mark all as read',
      'd.notifications.marking': 'Updating...',
      'd.notifications.open': 'Open',
      'd.notifications.markRead': 'Mark read',
      'd.notifications.markUnread': 'Mark unread',
      'd.notifications.title.requestCreated': 'Tryout request created',
      'd.notifications.title.requestCancelled': 'Request cancelled',
      'd.notifications.title.messagePosted': 'New message',
      'd.notifications.title.accountConnectedPending': 'Account connection pending',
      'd.notifications.body.accountConnectedPending': '{provider} linked. Verification is pending.',
      'd.notifications.title.waitlistJoined': 'Waitlist joined',
      'd.notifications.body.waitlistJoined': '{role} · {game}',
      'd.system.inviteCreated': 'Tryout request created for',
      'd.system.requestCancelled': 'Tryout request cancelled for',
      'd.hero.badge': 'GameIn',
      'd.hero.title': 'Build your roster faster.',
      'd.hero.lead': 'Proof-first profiles. Instant compare. Clear tryout intent.',
      'd.hero.ctaExplore': 'Explore players',
      'd.hero.ctaEarlyAccess': 'Join Early Access',
      'd.hero.toolsLabel': 'Proof tools',
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
      'd.quick.title': 'Quick Start',
      'd.quick.stepGame': '1. Pick game',
      'd.quick.stepMode': '2. Pick directory',
      'd.quick.players': 'Players',
      'd.quick.teams': 'Teams',
      'd.quick.showMatches': 'Show matches',
      'd.explore.browse.players': 'Browse player profiles',
      'd.explore.browse.teams': 'Browse team profiles',
      'd.filter.search': 'Search',
      'd.filter.title': 'Filters',
      'd.filter.role': 'Role',
      'd.filter.roleNeeded': 'Role needed',
      'd.filter.rank': 'Rank',
      'd.filter.region': 'Region',
      'd.filter.availability': 'Availability',
      'd.filter.proof': 'Proof',
      'd.filter.any': 'Any',
      'd.filter.gameHint': 'Select a game to filter roles/ranks',
      'd.common.ingameName': 'In-game name',
      'd.common.platform': 'Platform',
      'd.common.platformFocus': 'Platform focus',
      'd.platform.pc': 'PC',
      'd.platform.playstation': 'PlayStation',
      'd.platform.xbox': 'Xbox',
      'd.platform.switch': 'Switch',
      'd.game.overwatch': 'Overwatch',
      'd.game.lol': 'League of Legends',
      'd.game.fortnite': 'Fortnite',
      'd.game.rivals': 'Marvel Rivals',
      'd.role.tank': 'Tank',
      'd.role.support': 'Support',
      'd.role.dps': 'DPS',
      'd.role.flexDps': 'Flex DPS',
      'd.role.top': 'Top',
      'd.role.jungle': 'Jungle',
      'd.role.mid': 'Mid',
      'd.role.adc': 'ADC',
      'd.role.igl': 'IGL',
      'd.role.fragger': 'Fragger',
      'd.role.vanguard': 'Vanguard',
      'd.role.duelist': 'Duelist',
      'd.role.strategist': 'Strategist',
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
      'd.proof.connectedPending': 'Connected Pending',
      'd.proof.accountConnected': 'Connected Pending',
      'd.proof.selfDeclared': 'Self Declared',
      'd.compare.title': 'Compare (max 2)',
      'd.compare.clear': 'Clear',
      'd.compare.now': 'Compare now',
      'd.compare.hide': 'Hide compare',
      'd.compare.headtohead': 'Head-to-Head: who fits your system?',
      'd.compare.slot.empty': 'Select player',
      'd.compare.dock.title': 'Compare selection',
      'd.compare.dock.selectedCount': '{count}/2 selected',
      'd.compare.dock.open': 'Compare now',
      'd.compare.dock.clear': 'Clear',
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
      'd.toast.requestCancelled': 'Request cancelled.',
      'd.toast.messageSent': 'Message sent.',
      'd.toast.notificationsMarkedRead': 'All notifications marked as read.',
      'd.waitlist.validation.error': 'Add a valid email, role, and game to continue.',
      'd.waitlist.submitting': 'Saving...',
      'd.waitlist.success.tight': "Thanks - you're on the list. We'll email you when Early Access opens.",
      'd.invite.title': 'Invite to Tryout',
      'd.invite.game': 'Game',
      'd.invite.role': 'Role needed / offered',
      'd.invite.slot': 'Suggested slot',
      'd.invite.slotHint': 'Slots based on availability of {name}: {availability}',
      'd.invite.slotHintUnknown': 'Slots are based on broad availability defaults.',
      'd.invite.slotHintMixed': 'Mixed availability detected. Showing balanced slot options.',
      'd.invite.slotSource': 'Slots based on availability of {name}: {detail}',
      'd.invite.slotPreset.weeknights.1': 'Mon 19:30',
      'd.invite.slotPreset.weeknights.2': 'Wed 20:00',
      'd.invite.slotPreset.weeknights.3': 'Thu 21:00',
      'd.invite.slotPreset.weekend.1': 'Sat 14:00',
      'd.invite.slotPreset.weekend.2': 'Sat 18:00',
      'd.invite.slotPreset.weekend.3': 'Sun 17:00',
      'd.invite.slotPreset.any.1': 'Tue 20:00',
      'd.invite.slotPreset.any.2': 'Thu 19:30',
      'd.invite.slotPreset.any.3': 'Sun 18:00',
      'd.invite.notes': 'Notes',
      'd.invite.submit': 'Send tryout request',
      'd.invite.submitting': 'Sending...',
      'd.invite.success': 'Saved (Preview). Sending unlocks in Early Access.',
      'd.connect.title': 'Connect account',
      'd.connect.lead': 'Choose a provider to confirm ownership and improve trust signals.',
      'd.connect.connecting': 'Connecting...',
      'd.connect.success': 'Connection recorded. Rank verification arrives in Early Access.',
      'd.avatar.defaultAlt': 'Profile identity badge',
      'd.avatar.style.mono': 'Monogram',
      'd.avatar.style.symbol': 'Symbol',
      'd.avatar.style.brand': 'Brand',
      'd.modal.close': 'Close',
      'd.card.chip.proof': 'Proof',
      'd.card.chip.role': 'Role',
      'd.card.chip.roleNeeded': 'Role needed',
      'd.card.chip.availability': 'Availability',
      'd.card.chip.platform': 'Platform',
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
      'd.search.placeholder.players': 'Search in-game name',
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
      'd.profile.primaryMeta': 'Primary: {game} · {role} · {rank}',
      'd.profile.mainGame': 'Main game',
      'd.profile.mainRole': 'Main role',
      'd.profile.mainRank': 'Current rank',
      'd.profile.mainGameDetails': 'Main Game Details',
      'd.profile.secondaryGames': 'Secondary Games',
      'd.profile.previousFocus': 'Secondary / Previous Focus',
      'd.profile.handle': 'In-game name',
      'd.profile.ingameName': 'In-game name',
      'd.profile.role': 'Role',
      'd.profile.rank': 'Rank',
      'd.profile.peak': 'Peak',
      'd.profile.proof': 'Proof',
      'd.profile.platform': 'Platform',
      'd.profile.availability': 'Availability',
      'd.profile.availabilityDetail': 'Availability detail',
      'd.profile.alsoPlays': 'Also plays',
      'd.profile.noSecondaryGames': 'No secondary games added yet.',
      'd.profile.viewingPlayer': 'Viewing profile: {player}',
      'd.profile.back': 'Back',
      'd.profile.backToSelf': 'Back to your profile',
      'd.profile.backToExplore': 'Back to Explore',
      'd.profile.backToCompare': 'Back to Compare',
      'd.profile.close': 'Close',
      'd.profile.return.compare': 'Return to Compare',
      'd.profile.context.fromCompare': 'Opened from compare',
      'd.profile.context.fromExplore': 'Opened from explore',
      'd.profile.editPrimary': 'Edit profile',
      'd.profile.externalReadonlyHint': 'Read-only view of this player profile.',
      'd.profile.viewingFromContext': 'Opened from {game}',
      'd.profile.teaserTitle': 'Profile details',
      'd.profile.teaserLead': 'Detailed profile, history, references and setup in one dedicated view.',
      'd.profile.teaserOpen': 'Open profile',
      'd.profile.openPage': 'Open profile page',
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
      'd.network.success': 'Saved (Preview). Intros & references go live in Early Access.',
      'd.toast.networkCaptured': 'Saved (Preview).',
      'd.scout.hook.calm': 'Calm comms. Consistent VOD review.',
      'd.scout.hook.teamfirst': 'Team-first, fast adaptation.',
      'd.scout.hook.shotcall': 'Shotcaller-leaning, system focused.',
      'd.scout.hook.macro': 'Strong macro reads under pressure.',
      'd.scout.hook.mapaware': 'Map-aware pathing and clean timings.',
      'd.scout.hook.anchor': 'Reliable anchor with disciplined tempo.',
      'd.scout.hook.vod': 'Prep-heavy routine, low-ego comms.',
      'd.scout.hook.stable': 'Stable impact across long sets.',
      'd.scout.hook.utility': 'Utility-first and role-flex ready.',
      'd.scout.hook.tempo': 'High-tempo decisions, low noise.',
      'd.scout.hook.lateclutch': 'Composed in late-game clutch spots.',
      'd.scout.hook.pathing': 'Efficient pathing, clear info flow.',
      'd.scout.hook.entry': 'Confident entry timings, team aligned.',
      'd.scout.hook.structured': 'Structured practice and dependable execution.',
      'd.scout.hook.system': 'System-driven roster with clear comm lanes.',
      'd.scout.hook.discipline': 'Disciplined prep and reliable attendance.',
      'd.scout.hook.clutch': 'Strong closeout discipline in tight games.',
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
      'd.auth.requiredAction': 'Please log in to continue.',
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
      'd.editor.availability': 'Availability',
      'd.editor.availabilityDetail': 'Availability detail',
      'd.editor.availabilityDetailPlaceholder': 'Mon/Wed/Fri 19:00-22:00 CET',
      'd.editor.handle': 'In-game name',
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
      'd.messages.meta.count': 'Nachrichten',
      'd.messages.meta.unread': 'ungelesen',
      'd.messages.threads.empty': 'Noch keine Threads.',
      'd.messages.empty': 'Wähle einen Thread, um Nachrichten zu sehen.',
      'd.messages.send': 'Nachricht senden',
      'd.messages.sending': 'Wird gesendet...',
      'd.messages.field.to': 'An',
      'd.messages.field.draft': 'Entwurf',
      'd.requests.empty': 'Noch keine Anfragen.',
      'd.requests.status.pending': 'Offen',
      'd.requests.status.completed': 'Abgeschlossen',
      'd.requests.status.cancelled': 'Storniert',
      'd.requests.cancel': 'Stornieren',
      'd.requests.openThread': 'Thread öffnen',
      'd.requests.confirmCompleted': 'Abschluss bestätigen',
      'd.requests.rate': 'Tryout bewerten',
      'd.requests.processing': 'Aktualisiere...',
      'd.requests.tryout.label': 'Tryout',
      'd.requests.tryout.pending': 'Bestätigung ausstehend',
      'd.requests.tryout.partial': 'Teilweise bestätigt',
      'd.requests.tryout.verified': 'Verifiziertes Tryout',
      'd.requests.tryout.cancelled': 'Storniert',
      'd.requests.rating.label': 'Bewertung',
      'd.requests.rating.locked': 'Nach verifiziertem Abschluss verfügbar',
      'd.requests.rating.notStarted': 'Noch nicht abgegeben',
      'd.requests.rating.waitingCounterpart': 'Abgegeben. Warte auf Gegenseite',
      'd.requests.rating.waitingYou': 'Gegenseite abgegeben. Warte auf deine Bewertung',
      'd.requests.rating.timeoutSelf': 'Abgegeben ★{stars}. Timeout: nur für dich sichtbar',
      'd.requests.rating.timeoutCounterpart': 'Gegenseite Timeout. Du kannst noch bewerten',
      'd.requests.rating.revealed': 'Aufgedeckt · Du ★{you} · Gegenseite ★{counterpart}',
      'd.requests.rating.saved': 'Bewertung gespeichert.',
      'd.requests.completion.saved': 'Abschluss gespeichert.',
      'd.requests.system.selfCompleted': 'Du hast den Tryout-Abschluss bestätigt.',
      'd.requests.system.counterpartCompleted': 'Abschluss durch Gegenseite bestätigt.',
      'd.requests.demo.counterpartComplete': 'Demo: Gegenseite bestätigen',
      'd.requests.demo.counterpartRate': 'Demo: Gegenseite bewerten',
      'd.rating.title': 'Tryout-Verhalten bewerten',
      'd.rating.stars': 'Sterne',
      'd.rating.reason': 'Grund (Pflicht bei 1–2 Sternen)',
      'd.rating.reason.placeholder': 'Grund auswählen',
      'd.rating.reason.no_show': 'Nicht erschienen',
      'd.rating.reason.toxic_communication': 'Toxische Kommunikation',
      'd.rating.reason.unreliable_commitment': 'Unzuverlässige Verbindlichkeit',
      'd.rating.reason.role_mismatch': 'Rollen-Mismatch',
      'd.rating.submit': 'Bewertung senden',
      'd.conduct.summary': '★ {score} ({count} verifiziert)',
      'd.conduct.new': '★ — (Neu)',
      'd.notifications.meta.mentions.two': '3 Profilaufrufe · 1 direkte Mention · Letzte 24h',
      'd.notifications.meta.updates.oneTitle': 'Rank-Anforderung aktualisiert',
      'd.notifications.meta.updates.twoTitle': 'Tryout-Slot verschoben',
      'd.notifications.meta.updates.twoText': 'Cloud 25 hat den Donnerstag-Block auf 20:30 CET verschoben',
      'd.notifications.meta.system.oneTitle': 'Vorschau-Modus',
      'd.notifications.meta.system.twoTitle': 'Profil-Proof-Status',
      'd.notifications.meta.system.twoText': 'Connected-Account-Badges sind sichtbar, Rank-Verifikation wird im Early Access ausgebaut.',
      'd.notifications.empty.unread': 'Keine ungelesenen Mitteilungen.',
      'd.notifications.empty.read': 'Noch keine gelesenen Mitteilungen.',
      'd.notifications.markAllRead': 'Alle als gelesen markieren',
      'd.notifications.marking': 'Aktualisiere...',
      'd.notifications.open': 'Öffnen',
      'd.notifications.markRead': 'Als gelesen markieren',
      'd.notifications.markUnread': 'Als ungelesen markieren',
      'd.notifications.title.requestCreated': 'Tryout-Anfrage erstellt',
      'd.notifications.title.requestCancelled': 'Anfrage storniert',
      'd.notifications.title.messagePosted': 'Neue Nachricht',
      'd.notifications.title.accountConnectedPending': 'Account-Verbindung ausstehend',
      'd.notifications.body.accountConnectedPending': '{provider} verknüpft. Verifikation ist ausstehend.',
      'd.notifications.title.waitlistJoined': 'Warteliste beigetreten',
      'd.notifications.body.waitlistJoined': '{role} · {game}',
      'd.system.inviteCreated': 'Tryout-Anfrage erstellt für',
      'd.system.requestCancelled': 'Tryout-Anfrage storniert für',
      'd.hero.badge': 'GameIn',
      'd.hero.title': 'Stell dein Team schneller zusammen.',
      'd.hero.lead': 'Proof-first Profile. Sofort vergleichen. Klarer Tryout-Intent.',
      'd.hero.ctaExplore': 'Spieler entdecken',
      'd.hero.ctaEarlyAccess': 'Early Access sichern',
      'd.hero.toolsLabel': 'Proof-Tools',
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
      'd.quick.title': 'Quick Start',
      'd.quick.stepGame': '1. Spiel wählen',
      'd.quick.stepMode': '2. Bereich wählen',
      'd.quick.players': 'Spieler',
      'd.quick.teams': 'Teams',
      'd.quick.showMatches': 'Matches anzeigen',
      'd.explore.browse.players': 'Spielerprofile durchsuchen',
      'd.explore.browse.teams': 'Teamprofile durchsuchen',
      'd.filter.search': 'Suche',
      'd.filter.title': 'Filter',
      'd.filter.role': 'Rolle',
      'd.filter.roleNeeded': 'Benötigte Rolle',
      'd.filter.rank': 'Rank',
      'd.filter.region': 'Region',
      'd.filter.availability': 'Verfügbarkeit',
      'd.filter.proof': 'Proof',
      'd.filter.any': 'Alle',
      'd.filter.gameHint': 'Wähle ein Spiel, um Rollen/Ranks zu filtern',
      'd.common.ingameName': 'Ingame-Name',
      'd.common.platform': 'Plattform',
      'd.common.platformFocus': 'Plattform-Fokus',
      'd.platform.pc': 'PC',
      'd.platform.playstation': 'PlayStation',
      'd.platform.xbox': 'Xbox',
      'd.platform.switch': 'Switch',
      'd.game.overwatch': 'Overwatch',
      'd.game.lol': 'League of Legends',
      'd.game.fortnite': 'Fortnite',
      'd.game.rivals': 'Marvel Rivals',
      'd.role.tank': 'Tank',
      'd.role.support': 'Support',
      'd.role.dps': 'DPS',
      'd.role.flexDps': 'Flex DPS',
      'd.role.top': 'Top',
      'd.role.jungle': 'Jungle',
      'd.role.mid': 'Mid',
      'd.role.adc': 'ADC',
      'd.role.igl': 'IGL',
      'd.role.fragger': 'Fragger',
      'd.role.vanguard': 'Vanguard',
      'd.role.duelist': 'Duelist',
      'd.role.strategist': 'Strategist',
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
      'd.proof.connectedPending': 'Verbindung ausstehend',
      'd.proof.accountConnected': 'Verbindung ausstehend',
      'd.proof.selfDeclared': 'Selbst angegeben',
      'd.compare.title': 'Vergleich (max 2)',
      'd.compare.clear': 'Leeren',
      'd.compare.now': 'Jetzt vergleichen',
      'd.compare.hide': 'Vergleich ausblenden',
      'd.compare.headtohead': 'Direktvergleich: Wer passt ins System?',
      'd.compare.slot.empty': 'Spieler wählen',
      'd.compare.dock.title': 'Vergleichsauswahl',
      'd.compare.dock.selectedCount': '{count}/2 gewählt',
      'd.compare.dock.open': 'Jetzt vergleichen',
      'd.compare.dock.clear': 'Leeren',
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
      'd.toast.requestCancelled': 'Anfrage storniert.',
      'd.toast.messageSent': 'Nachricht gesendet.',
      'd.toast.notificationsMarkedRead': 'Alle Mitteilungen als gelesen markiert.',
      'd.waitlist.validation.error': 'Bitte gib eine gueltige E-Mail, Rolle und ein Spiel an.',
      'd.waitlist.submitting': 'Speichern...',
      'd.waitlist.success.tight': 'Danke - du bist auf der Liste. Wir mailen dir, wenn Early Access startet.',
      'd.invite.title': 'Zum Tryout einladen',
      'd.invite.game': 'Spiel',
      'd.invite.role': 'Gesuchte / angebotene Rolle',
      'd.invite.slot': 'Vorgeschlagener Slot',
      'd.invite.slotHint': 'Slots basieren auf Verfügbarkeit von {name}: {availability}',
      'd.invite.slotHintUnknown': 'Slots basieren auf allgemeinen Verfügbarkeitswerten.',
      'd.invite.slotHintMixed': 'Gemischte Verfügbarkeiten erkannt. Es werden ausgewogene Slots vorgeschlagen.',
      'd.invite.slotSource': 'Slots basieren auf Verfügbarkeit von {name}: {detail}',
      'd.invite.slotPreset.weeknights.1': 'Mo 19:30',
      'd.invite.slotPreset.weeknights.2': 'Mi 20:00',
      'd.invite.slotPreset.weeknights.3': 'Do 21:00',
      'd.invite.slotPreset.weekend.1': 'Sa 14:00',
      'd.invite.slotPreset.weekend.2': 'Sa 18:00',
      'd.invite.slotPreset.weekend.3': 'So 17:00',
      'd.invite.slotPreset.any.1': 'Di 20:00',
      'd.invite.slotPreset.any.2': 'Do 19:30',
      'd.invite.slotPreset.any.3': 'So 18:00',
      'd.invite.notes': 'Notizen',
      'd.invite.submit': 'Tryout-Anfrage senden',
      'd.invite.submitting': 'Wird gesendet...',
      'd.invite.success': 'Gespeichert (Vorschau). Versenden startet mit Early Access.',
      'd.connect.title': 'Account verbinden',
      'd.connect.lead': 'Wähle einen Provider, um Ownership zu bestätigen und Trust-Signale zu verbessern.',
      'd.connect.connecting': 'Verbinde...',
      'd.connect.success': 'Verknuepfung gespeichert. Rank-Verifizierung kommt mit Early Access.',
      'd.avatar.defaultAlt': 'Profil-Identitätsbadge',
      'd.avatar.style.mono': 'Monogramm',
      'd.avatar.style.symbol': 'Symbol',
      'd.avatar.style.brand': 'Brand',
      'd.modal.close': 'Schließen',
      'd.card.chip.proof': 'Proof',
      'd.card.chip.role': 'Rolle',
      'd.card.chip.roleNeeded': 'Benoetigte Rolle',
      'd.card.chip.availability': 'Verfuegbarkeit',
      'd.card.chip.platform': 'Plattform',
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
      'd.search.placeholder.players': 'Ingame-Namen suchen',
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
      'd.profile.primaryMeta': 'Hauptfokus: {game} · {role} · {rank}',
      'd.profile.mainGame': 'Hauptspiel',
      'd.profile.mainRole': 'Hauptrolle',
      'd.profile.mainRank': 'Aktueller Rank',
      'd.profile.mainGameDetails': 'Hauptspiel-Details',
      'd.profile.secondaryGames': 'Weitere Spiele',
      'd.profile.previousFocus': 'Secondary / bisheriger Fokus',
      'd.profile.handle': 'Ingame-Name',
      'd.profile.ingameName': 'Ingame-Name',
      'd.profile.role': 'Rolle',
      'd.profile.rank': 'Rank',
      'd.profile.peak': 'Peak',
      'd.profile.proof': 'Proof',
      'd.profile.platform': 'Plattform',
      'd.profile.availability': 'Verfügbarkeit',
      'd.profile.availabilityDetail': 'Verfügbarkeitsdetails',
      'd.profile.alsoPlays': 'Spielt außerdem',
      'd.profile.noSecondaryGames': 'Noch keine Secondary Games hinterlegt.',
      'd.profile.viewingPlayer': 'Profilansicht: {player}',
      'd.profile.back': 'Zurück',
      'd.profile.backToSelf': 'Zurück zu deinem Profil',
      'd.profile.backToExplore': 'Zurück zu Explore',
      'd.profile.backToCompare': 'Zurück zum Vergleich',
      'd.profile.close': 'Schließen',
      'd.profile.return.compare': 'Zur Vergleichsansicht',
      'd.profile.context.fromCompare': 'Aus Vergleich geöffnet',
      'd.profile.context.fromExplore': 'Aus Explore geöffnet',
      'd.profile.editPrimary': 'Profil bearbeiten',
      'd.profile.externalReadonlyHint': 'Schreibgeschützte Ansicht dieses Spielerprofils.',
      'd.profile.viewingFromContext': 'Geöffnet aus {game}',
      'd.profile.teaserTitle': 'Profildetails',
      'd.profile.teaserLead': 'Detailliertes Profil, Historie, Referenzen und Setup in einer eigenen Ansicht.',
      'd.profile.teaserOpen': 'Profil öffnen',
      'd.profile.openPage': 'Profilseite öffnen',
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
      'd.network.success': 'Gespeichert (Vorschau). Intros & Referenzen gehen mit Early Access live.',
      'd.toast.networkCaptured': 'Gespeichert (Vorschau).',
      'd.scout.hook.calm': 'Ruhige Comms. Konstantes VOD-Review.',
      'd.scout.hook.teamfirst': 'Team-first und schnelle Anpassung.',
      'd.scout.hook.shotcall': 'Shotcaller-nah und systemfokussiert.',
      'd.scout.hook.macro': 'Starke Macro-Reads unter Druck.',
      'd.scout.hook.mapaware': 'Map-aware Pathing mit klaren Timings.',
      'd.scout.hook.anchor': 'Stabiler Anchor mit sauberem Tempo.',
      'd.scout.hook.vod': 'Hohe Vorbereitung, klare Low-Ego-Comms.',
      'd.scout.hook.stable': 'Konstante Wirkung ueber lange Sets.',
      'd.scout.hook.utility': 'Utility-first und rollenflexibel.',
      'd.scout.hook.tempo': 'Hoher Spielrhythmus bei klarer Kommunikation.',
      'd.scout.hook.lateclutch': 'Souveraen in späten Clutch-Momenten.',
      'd.scout.hook.pathing': 'Effizientes Pathing mit sauberem Infofluss.',
      'd.scout.hook.entry': 'Sichere Entry-Timings im Teamkontext.',
      'd.scout.hook.structured': 'Strukturiertes Training, verlaessliche Execution.',
      'd.scout.hook.system': 'Systemorientiertes Team mit klaren Comms.',
      'd.scout.hook.discipline': 'Disziplinierte Vorbereitung und Zuverlaessigkeit.',
      'd.scout.hook.clutch': 'Starke Closeout-Disziplin in engen Spielen.',
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
      'd.auth.requiredAction': 'Bitte einloggen, um fortzufahren.',
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
      'd.editor.availability': 'Verfügbarkeit',
      'd.editor.availabilityDetail': 'Verfügbarkeitsdetails',
      'd.editor.availabilityDetailPlaceholder': 'Mo/Mi/Fr 19:00-22:00 CET',
      'd.editor.handle': 'Ingame-Name',
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

  function renderProfileNavVisibility() {
    document.querySelectorAll('[data-auth-nav="profile"]').forEach((link) => {
      const visible = state.isAuthenticated;
      link.classList.toggle('hidden', !visible);
      link.setAttribute('aria-hidden', visible ? 'false' : 'true');
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
          if (isProfilePage()) {
            const profile = document.getElementById('profile');
            if (profile) {
              profile.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            if (state.isAuthenticated) {
              window.setTimeout(() => {
                openProfileEditorModal('public');
              }, 180);
            }
            return;
          }
          navigateToProfileSelf({
            editSection: 'public'
          });
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
    renderProfileNavVisibility();
    renderProfileHeaderActions();
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
    updateExploreModeSemantics();
    syncQuickStartControls();
    applyWaitlistSuccessCopy();
    applyWaitlistPanelCtaState();

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
    applyInviteSlotSuggestions(state.selectedInviteContext);
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

  function isProfilePage() {
    return getCurrentPage() === 'profile';
  }

  function isStartPage() {
    return getCurrentPage() === 'start';
  }

  function isSelfProfileView() {
    return state.profileViewMode === 'self';
  }

  function normalizeNavSource(value) {
    const source = String(value || '').trim().toLowerCase();
    if (source === 'explore' || source === 'compare') {
      return source;
    }
    return '';
  }

  function getCanonicalPlayerHandle(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (!normalized) {
      return '';
    }
    const player = players.find((entry) => String(entry.handle || '').trim().toLowerCase() === normalized);
    return player ? player.handle : '';
  }

  function parseCompareHandlesParam(value) {
    const raw = String(value || '').trim();
    if (!raw) {
      return [];
    }
    const unique = [];
    raw.split(',').forEach((token) => {
      if (unique.length >= 2) {
        return;
      }
      const canonical = getCanonicalPlayerHandle(token);
      if (!canonical || unique.includes(canonical)) {
        return;
      }
      unique.push(canonical);
    });
    return unique;
  }

  function serializeCompareHandles(handles) {
    if (!Array.isArray(handles) || !handles.length) {
      return '';
    }
    return parseCompareHandlesParam(handles.join(',')).join(',');
  }

  function setNavContext(source, options) {
    const opts = options && typeof options === 'object' ? options : {};
    const normalizedSource = normalizeNavSource(source);
    state.navContext = {
      source: normalizedSource,
      scrollY: Number.isFinite(opts.scrollY) ? opts.scrollY : window.scrollY || 0,
      compareScrollTarget: normalizedSource === 'compare' || opts.compareScrollTarget === true
    };
  }

  function clearNavContext() {
    state.navContext = {
      source: '',
      scrollY: 0,
      compareScrollTarget: false
    };
  }

  function scrollToExploreResults() {
    const target = document.getElementById('resultList') || document.getElementById('explore');
    if (!target) {
      return;
    }
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function scrollToCompareSection() {
    const target = document.getElementById('compareDrawer');
    if (!target) {
      return;
    }
    if (state.compare.length && !state.compareExpanded) {
      state.compareExpanded = true;
      renderCompareDrawer();
    }
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function getProfileRoutePlayerHandleFromURL() {
    if (typeof window === 'undefined' || !window.location) {
      return '';
    }
    const params = new URLSearchParams(window.location.search || '');
    return String(params.get('player') || '').trim();
  }

  function getProfileRouteSourceGameFromURL() {
    if (typeof window === 'undefined' || !window.location) {
      return '';
    }
    const params = new URLSearchParams(window.location.search || '');
    const normalized = normalizeGameId(params.get('game') || '', '');
    return isCanonicalProfileGame(normalized) ? normalized : '';
  }

  function getProfileRouteSourceFromURL() {
    if (typeof window === 'undefined' || !window.location) {
      return '';
    }
    const params = new URLSearchParams(window.location.search || '');
    return normalizeNavSource(params.get('from') || '');
  }

  function getProfileRouteCompareHandlesFromURL() {
    if (typeof window === 'undefined' || !window.location) {
      return [];
    }
    const params = new URLSearchParams(window.location.search || '');
    return parseCompareHandlesParam(params.get('compare') || '');
  }

  function getProfileReturnContext() {
    const source = getProfileRouteSourceFromURL() || normalizeNavSource(state.navContext.source);
    const compareHandles = getProfileRouteCompareHandlesFromURL();
    const sourceGame = getProfileRouteSourceGameFromURL();
    return {
      source,
      compareHandles,
      sourceGame
    };
  }

  function resolveProfileBackTarget(context) {
    const ctx = context && typeof context === 'object' ? context : {};
    const source = normalizeNavSource(ctx.source || '');
    const compareSerialized = serializeCompareHandles(
      Array.isArray(ctx.compareHandles) ? ctx.compareHandles : state.compare
    );
    if (source === 'compare') {
      if (compareSerialized) {
        return `index.html?back=compare&compare=${encodeURIComponent(compareSerialized)}`;
      }
      return 'index.html?back=compare';
    }
    if (source === 'explore') {
      return 'index.html?back=explore';
    }
    return 'index.html';
  }

  function goBackOrFallback(fallbackUrl) {
    const fallback = String(fallbackUrl || 'index.html').trim() || 'index.html';
    let hasSameOriginReferrer = false;
    try {
      if (document.referrer) {
        const ref = new URL(document.referrer);
        hasSameOriginReferrer = ref.origin === window.location.origin;
      }
    } catch (_err) {
      hasSameOriginReferrer = false;
    }
    if (window.history && window.history.length > 1 && hasSameOriginReferrer) {
      window.history.back();
      return;
    }
    window.location.href = fallback;
  }

  function getStartReturnSourceFromURL() {
    if (typeof window === 'undefined' || !window.location) {
      return '';
    }
    const params = new URLSearchParams(window.location.search || '');
    return normalizeNavSource(params.get('back') || '');
  }

  function getStartReturnCompareHandlesFromURL() {
    if (typeof window === 'undefined' || !window.location) {
      return [];
    }
    const params = new URLSearchParams(window.location.search || '');
    return parseCompareHandlesParam(params.get('compare') || '');
  }

  function getProfileRouteEditSectionFromURL() {
    if (typeof window === 'undefined' || !window.location) {
      return '';
    }
    const params = new URLSearchParams(window.location.search || '');
    const section = String(params.get('edit') || '').trim().toLowerCase();
    return ['public', 'experience', 'career', 'setup'].includes(section) ? section : '';
  }

  function getProfileRouteUrl(profileHandle, options) {
    const opts = options && typeof options === 'object' ? options : {};
    const params = new URLSearchParams();
    const normalizedHandle = String(profileHandle || '').trim();
    if (normalizedHandle) {
      params.set('player', normalizedHandle);
    }

    const normalizedGame = normalizeGameId(opts.sourceGame || '', '');
    if (isCanonicalProfileGame(normalizedGame)) {
      params.set('game', normalizedGame);
    }

    const editSection = String(opts.editSection || '').trim().toLowerCase();
    if (['public', 'experience', 'career', 'setup'].includes(editSection)) {
      params.set('edit', editSection);
    }

    const navSource = normalizeNavSource(opts.navSource || opts.from || '');
    if (navSource) {
      params.set('from', navSource);
    }

    const compareHandles = serializeCompareHandles(
      Array.isArray(opts.compareHandles) ? opts.compareHandles : []
    );
    if (compareHandles) {
      params.set('compare', compareHandles);
    }

    const query = params.toString();
    return `profile.html${query ? `?${query}` : ''}`;
  }

  function navigateToProfileSelf(options) {
    window.location.href = getProfileRouteUrl('', options);
  }

  function navigateToProfilePlayer(handle, options) {
    const resolvedHandle = String(handle || '').trim();
    if (!resolvedHandle) {
      navigateToProfileSelf(options);
      return;
    }
    window.location.href = getProfileRouteUrl(resolvedHandle, options);
  }

  function replaceProfileRoute(profileHandle, options) {
    if (!isProfilePage() || !window.history || typeof window.history.replaceState !== 'function') {
      return;
    }
    const next = getProfileRouteUrl(profileHandle, options);
    window.history.replaceState({}, '', next);
  }

  function applyProfileRouteFromURL() {
    if (!isProfilePage()) {
      state.profileViewMode = 'self';
      state.profileViewPlayerId = '';
      state.profileViewHandle = '';
      state.profileViewSourceGame = '';
      clearNavContext();
      return;
    }

    const routeHandle = getProfileRoutePlayerHandleFromURL();
    const routeSourceGame = getProfileRouteSourceGameFromURL();
    const routeSource = getProfileRouteSourceFromURL();
    const routeCompareHandles = getProfileRouteCompareHandlesFromURL();
    if (routeCompareHandles.length) {
      state.compare = routeCompareHandles;
    }
    if (routeSource) {
      setNavContext(routeSource, {
        scrollY: window.scrollY || 0,
        compareScrollTarget: routeSource === 'compare'
      });
    } else {
      clearNavContext();
    }
    if (!routeHandle) {
      state.profileViewMode = 'self';
      state.profileViewPlayerId = '';
      state.profileViewHandle = '';
      state.profileViewSourceGame = '';
      state.lastProfileOpenHandle = '';
      return;
    }

    const normalizedHandle = routeHandle.toLowerCase();
    const player = players.find((entry) => String(entry.handle || '').trim().toLowerCase() === normalizedHandle) || null;
    if (!player) {
      state.profileViewMode = 'self';
      state.profileViewPlayerId = '';
      state.profileViewHandle = '';
      state.profileViewSourceGame = '';
      state.lastProfileOpenHandle = '';
      replaceProfileRoute('', {});
      return;
    }

    state.profileViewMode = 'player';
    state.profileViewPlayerId = getPlayerViewId(player);
    state.profileViewHandle = player.handle;
    state.profileViewSourceGame = routeSourceGame;
    state.lastProfileOpenHandle = player.handle;
  }

  function applyStartReturnContextFromURL() {
    if (!isStartPage()) {
      return;
    }
    const source = getStartReturnSourceFromURL();
    const compareHandles = getStartReturnCompareHandlesFromURL();
    if (!source && !compareHandles.length) {
      return;
    }

    if (compareHandles.length) {
      state.compare = compareHandles;
    }
    if (source) {
      setNavContext(source, {
        scrollY: window.scrollY || 0,
        compareScrollTarget: source === 'compare'
      });
    } else {
      clearNavContext();
    }

    renderResults();
    renderCompareDrawer();

    window.setTimeout(() => {
      if (source === 'compare') {
        scrollToCompareSection();
      } else {
        scrollToExploreResults();
      }
    }, 60);

    if (window.history && typeof window.history.replaceState === 'function') {
      const params = new URLSearchParams(window.location.search || '');
      params.delete('back');
      params.delete('compare');
      const nextQuery = params.toString();
      window.history.replaceState({}, '', `index.html${nextQuery ? `?${nextQuery}` : ''}`);
    }
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
      notifications: 'view_notifications_page',
      profile: 'view_profile_page'
    };
    const event = eventByPage[page] || 'view_landing';
    track(event, { page });

    if (page === 'start' && document.getElementById('resultList')) {
      track('view_explore_players', {});
    }
  }

  function getProofMeta(proofStatus) {
    if (proofStatus === PROOF_STATUS.RANK_VERIFIED) {
      return {
        variant: 'verified',
        label: t('d.proof.rankVerified'),
        tooltip: t('d.proof.tooltip.rank')
      };
    }
    if (proofStatus === PROOF_STATUS.ACCOUNT_CONNECTED) {
      return {
        variant: 'connected-pending',
        label: t('d.proof.connectedPending'),
        tooltip: t('d.proof.tooltip.connected')
      };
    }
    return {
      variant: 'self-declared',
      label: t('d.proof.selfDeclared'),
      tooltip: t('d.proof.tooltip.self')
    };
  }

  function getLegacyProofClass(variant) {
    if (variant === 'verified') return 'rank';
    if (variant === 'connected-pending') return 'connected';
    return 'self';
  }

  function mapProof(proofStatus) {
    const meta = getProofMeta(proofStatus);
    return {
      cls: getLegacyProofClass(meta.variant),
      variant: meta.variant,
      label: meta.label,
      tooltip: meta.tooltip
    };
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderProofBadge(proofStatus, options) {
    const opts = options && typeof options === 'object' ? options : {};
    const meta = getProofMeta(proofStatus);
    const classes = ['proof-badge', `proof-badge--${meta.variant}`, getLegacyProofClass(meta.variant)];
    if (opts.compact) {
      classes.push('proof-badge--compact');
    }
    if (opts.className) {
      classes.push(opts.className);
    }
    return `<span class="${classes.join(' ')}" title="${escapeHtml(meta.tooltip)}">${escapeHtml(meta.label)}</span>`;
  }

  function normalizeAvailability(value) {
    const raw = String(value || '').trim().toLowerCase();
    if (raw === 'weeknights') {
      return 'Weeknights';
    }
    if (raw === 'weekend') {
      return 'Weekend';
    }
    return 'Any';
  }

  function formatAvailability(availability) {
    const normalized = normalizeAvailability(availability);
    if (normalized === 'Any') {
      return t('d.filter.any');
    }
    if (normalized === 'Weeknights') {
      return t('d.availability.weeknights');
    }
    if (normalized === 'Weekend') {
      return t('d.availability.weekend');
    }
    return normalized;
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

  function countryCodeToFlagEmoji(countryCode) {
    const normalized = String(countryCode || '').trim().toUpperCase();
    if (!/^[A-Z]{2}$/.test(normalized)) {
      return '';
    }
    return Array.from(normalized)
      .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
      .join('');
  }

  function formatCountryWithFlag(countryCode) {
    const label = formatCountry(countryCode);
    const flag = countryCodeToFlagEmoji(countryCode);
    return flag ? `${flag} ${label}` : label;
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
    if (role === 'Top') {
      return t('d.role.top');
    }
    if (role === 'Mid') {
      return t('d.role.mid');
    }
    if (role === 'ADC') {
      return t('d.role.adc');
    }
    if (role === 'Fragger') {
      return t('d.role.fragger');
    }
    if (role === 'Vanguard') {
      return t('d.role.vanguard');
    }
    if (role === 'Duelist') {
      return t('d.role.duelist');
    }
    if (role === 'Strategist') {
      return t('d.role.strategist');
    }
    return role;
  }

  function hashString(value) {
    const input = String(value || '');
    let hash = 0;
    for (let index = 0; index < input.length; index += 1) {
      hash = ((hash << 5) - hash) + input.charCodeAt(index);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  function resolveHookKey(entity) {
    const raw = entity && typeof entity.hook === 'string' ? entity.hook.trim() : '';
    if (raw) {
      if (raw.startsWith('d.')) {
        return raw;
      }
      return `d.scout.hook.${raw}`;
    }
    const source = entity && (entity.handle || entity.name || entity.slug) ? (entity.handle || entity.name || entity.slug) : 'gamein';
    const index = hashString(source) % SCOUT_HOOK_KEYS.length;
    return `d.scout.hook.${SCOUT_HOOK_KEYS[index]}`;
  }

  function getScoutHookText(entity) {
    const key = resolveHookKey(entity);
    return t(key);
  }

  function formatTeamNeed(gameId, need) {
    const safeNeed = need && typeof need === 'object' ? need : {};
    const role = formatRole(safeNeed.role || '-');
    const rank = safeNeed.rankMin || '-';
    return `${getGameLabel(gameId)}: ${role} (${rank}+)`;
  }

  function getTeamPrimaryNeed(team) {
    if (!team || !Array.isArray(team.games)) {
      return null;
    }
    const scopedGames = team.games.filter((entry) => state.game === GAME_IDS.ANY || entry.game === state.game);
    for (const gameEntry of scopedGames) {
      if (Array.isArray(gameEntry.needs) && gameEntry.needs.length > 0) {
        return {
          game: gameEntry.game,
          need: gameEntry.needs[0]
        };
      }
    }
    return null;
  }

  function getCoarseTeamAvailability(team) {
    const explicit = String(team && team.availability ? team.availability : '').trim();
    if (explicit === 'Weeknights' || explicit === 'Weekend' || explicit === 'Any') {
      return explicit;
    }
    const schedule = String(team && team.schedule ? team.schedule : '').toLowerCase();
    if (/(sat|sun|weekend)/.test(schedule)) {
      return 'Weekend';
    }
    if (/(mon|tue|wed|thu|fri)/.test(schedule)) {
      return 'Weeknights';
    }
    return 'Any';
  }

  function formatSchedule(schedule) {
    return schedule
      .replace('Mon/Wed/Fri', t('d.schedule.monWedFri'))
      .replace('Tue/Thu', t('d.schedule.tueThu'));
  }

  function getExploreRoleOptions() {
    if (state.game === GAME_IDS.ANY) {
      return ['Any'];
    }
    return ['Any'].concat(ROLE_OPTIONS_BY_GAME[state.game] || []);
  }

  function getExploreRankOptions() {
    if (state.game === GAME_IDS.ANY) {
      return ['Any'];
    }
    return ['Any'].concat(RANK_OPTIONS_BY_GAME[state.game] || []);
  }

  function setSelectEnabled(select, enabled) {
    if (!select) {
      return;
    }
    select.disabled = !enabled;
    const wrap = select.closest('.select-wrap');
    if (wrap) {
      wrap.classList.toggle('is-disabled', !enabled);
      if (!enabled) {
        wrap.classList.remove('is-open');
      }
    }
    const arrow = wrap ? wrap.querySelector(`[data-select-toggle="${select.id}"]`) : null;
    if (arrow) {
      arrow.disabled = !enabled;
      arrow.setAttribute('aria-disabled', String(!enabled));
      if (!enabled) {
        arrow.setAttribute('aria-expanded', 'false');
      }
    }
    const menu = wrap ? wrap.querySelector(`[data-select-menu="${select.id}"]`) : null;
    if (menu && !enabled) {
      menu.classList.add('hidden');
    }
  }

  function updateGameFilterHint() {
    const hint = document.getElementById('gameFilterHint');
    if (!hint) {
      return;
    }
    hint.classList.toggle('hidden', state.game !== GAME_IDS.ANY);
  }

  function updateExploreModeSemantics() {
    const browseHint = document.getElementById('exploreBrowseHint');
    if (browseHint) {
      const browseKey = state.mode === 'teams'
        ? 'd.explore.browse.teams'
        : 'd.explore.browse.players';
      browseHint.dataset.d18n = browseKey;
      browseHint.textContent = t(browseKey);
    }

    const roleLabel = document.getElementById('roleFilterLabel');
    if (roleLabel) {
      const roleKey = state.mode === 'teams'
        ? 'd.filter.roleNeeded'
        : 'd.filter.role';
      roleLabel.dataset.d18n = roleKey;
      roleLabel.textContent = t(roleKey);
    }
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

    const roleEnabled = state.game !== GAME_IDS.ANY;
    if (!roleEnabled) {
      state.role = 'Any';
    }
    const isValidSelection = options.includes(state.role);
    state.role = isValidSelection ? state.role : 'Any';
    roleFilter.value = state.role;
    setSelectEnabled(roleFilter, roleEnabled);

    if (typeof roleFilter._uspecRebuildMenu === 'function') {
      roleFilter._uspecRebuildMenu();
    }
    updateGameFilterHint();
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
    const supportsRankCatalog = state.game !== GAME_IDS.ANY && Boolean(RANK_OPTIONS_BY_GAME[gameKey]);
    const options = getExploreRankOptions();

    setSelectOptions(rankFilter, options, (value) => {
      if (value === 'Any') {
        return t('d.filter.any');
      }
      const tierKey = getRankTierKey(gameKey, value);
      return tierKey ? t(tierKey) : value;
    });

    if (!supportsRankCatalog) {
      state.rank = 'Any';
    }
    const isValidSelection = options.includes(state.rank);
    state.rank = isValidSelection ? state.rank : 'Any';
    rankFilter.value = state.rank;
    setSelectEnabled(rankFilter, supportsRankCatalog);

    if (typeof rankFilter._uspecRebuildMenu === 'function') {
      rankFilter._uspecRebuildMenu();
    }
    updateGameFilterHint();
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

  function isCanonicalProfileGame(gameId) {
    return ALLOWED_GAME_IDS.includes(normalizeGameId(gameId, ''));
  }

  function getPlayerViewId(player) {
    if (!player || typeof player !== 'object') {
      return '';
    }
    return slugifyStableId(player.id || player.handle || '');
  }

  function findPlayerByViewState() {
    const playerId = slugifyStableId(state.profileViewPlayerId || '');
    if (playerId) {
      const byId = players.find((player) => getPlayerViewId(player) === playerId);
      if (byId) {
        return byId;
      }
    }

    const handle = String(state.profileViewHandle || '').trim().toLowerCase();
    if (!handle) {
      return null;
    }
    return players.find((player) => String(player.handle || '').trim().toLowerCase() === handle) || null;
  }

  function resolvePrimaryGameFromProfile(profilePublic) {
    const safeProfile = profilePublic && typeof profilePublic === 'object' ? profilePublic : {};
    const preferred = normalizeGameId(safeProfile.mainGame, '');
    if (isCanonicalProfileGame(preferred)) {
      return preferred;
    }

    const games = safeProfile.games && typeof safeProfile.games === 'object' ? safeProfile.games : {};
    for (const gameId of ALLOWED_GAME_IDS) {
      const entry = games[gameId];
      if (!entry || typeof entry !== 'object') {
        continue;
      }
      const hasHandle = String(entry.handle || '').trim().length > 0;
      const hasRank = String(entry.tier || '').trim().length > 0;
      if (hasHandle || hasRank) {
        return gameId;
      }
    }
    return GAME_IDS.OVERWATCH;
  }

  function resolvePrimaryGameFromPlayer(player) {
    if (!player || typeof player !== 'object') {
      return GAME_IDS.OVERWATCH;
    }
    const preferred = normalizeGameId(player.primaryGame, '');
    if (isCanonicalProfileGame(preferred)) {
      return preferred;
    }

    const games = Array.isArray(player.games) ? player.games : [];
    for (const entry of games) {
      const gameId = normalizeGameId(entry && entry.game, '');
      if (!isCanonicalProfileGame(gameId)) {
        continue;
      }
      const hasHandle = String(entry && entry.handle ? entry.handle : player.handle || '').trim().length > 0;
      const hasRank = String(entry && entry.rank ? entry.rank : '').trim().length > 0;
      if (hasHandle || hasRank) {
        return gameId;
      }
    }

    const firstCanonical = games
      .map((entry) => normalizeGameId(entry && entry.game, ''))
      .find((gameId) => isCanonicalProfileGame(gameId));
    return firstCanonical || GAME_IDS.OVERWATCH;
  }

  function getProfileGameEntryFromPlayer(player, gameId) {
    if (!player || !Array.isArray(player.games)) {
      return null;
    }
    const normalizedGame = normalizeGameId(gameId, '');
    if (!isCanonicalProfileGame(normalizedGame)) {
      return null;
    }
    return player.games.find((entry) => normalizeGameId(entry && entry.game, '') === normalizedGame) || null;
  }

  function getProfileSourcePlayer(profilePublic) {
    const safeProfile = profilePublic && typeof profilePublic === 'object' ? profilePublic : {};
    const lookup = slugifyStableId(safeProfile.displayName || '');
    if (!lookup) {
      return null;
    }
    return players.find((player) => slugifyStableId(player.handle || '') === lookup) || null;
  }

  function formatProofLabel(proofStatus) {
    return getProofMeta(proofStatus).label;
  }

  function buildSelfProfileViewModel(profileState) {
    const normalized = normalizeProfileState(profileState);
    const profilePublic = normalized.publicProfile;
    const sourcePlayer = getProfileSourcePlayer(profilePublic);
    const avatarConfig = resolveAvatarConfig({
      avatarStyle: profilePublic.avatarStyle || (sourcePlayer && sourcePlayer.avatarStyle),
      avatarShape: profilePublic.avatarShape || (sourcePlayer && sourcePlayer.avatarShape),
      avatarAccent: profilePublic.avatarAccent || (sourcePlayer && sourcePlayer.avatarAccent),
      avatarGlyph: profilePublic.avatarGlyph || (sourcePlayer && sourcePlayer.avatarGlyph),
      avatarInitials: profilePublic.avatarInitials || profilePublic.displayName || (sourcePlayer && sourcePlayer.avatarInitials),
      displayName: profilePublic.displayName,
      handle: sourcePlayer && sourcePlayer.handle ? sourcePlayer.handle : profilePublic.displayName
    }, profilePublic.displayName);
    const primaryGame = resolvePrimaryGameFromProfile(profilePublic);
    const primaryEntry = profilePublic.games[primaryGame] || profilePublic.games.overwatch;
    const primaryPlayerEntry = getProfileGameEntryFromPlayer(sourcePlayer, primaryGame);
    const primaryRole = sanitizeTextValue(
      profilePublic.primaryRole,
      primaryPlayerEntry && primaryPlayerEntry.role ? formatRole(primaryPlayerEntry.role) : profilePublic.role,
      64
    );
    const primaryRank = sanitizeTextValue(
      profilePublic.primaryRank,
      formatRankDisplay(primaryGame, primaryEntry),
      64
    );
    const primaryPeak = sanitizeTextValue(
      primaryPlayerEntry && primaryPlayerEntry.peak ? primaryPlayerEntry.peak : '',
      primaryRank,
      64
    );
    const mainPlatform = resolvePlatformForGame(primaryEntry, primaryPlayerEntry || sourcePlayer || null);
    const profileAvailability = normalizeAvailability(profilePublic.availability);
    const sourceAvailability = normalizeAvailability(sourcePlayer && sourcePlayer.availability ? sourcePlayer.availability : '');
    const profileAvailabilityDetail = sanitizeTextValue(profilePublic.availabilityDetail, '', 80);
    const sourceAvailabilityDetail = sourcePlayer && sourcePlayer.availabilityDetail
      ? sanitizeTextValue(sourcePlayer.availabilityDetail, '', 80)
      : '';
    const secondaryGames = getOrderedGameKeys(primaryGame)
      .filter((gameId) => gameId !== primaryGame)
      .map((gameId) => {
        const entry = profilePublic.games[gameId];
        if (!entry) {
          return null;
        }
        const roleFromSource = getProfileGameEntryFromPlayer(sourcePlayer, gameId);
        const platform = resolvePlatformForGame(entry, roleFromSource || sourcePlayer || null);
        return {
          game: gameId,
          handle: sanitizeTextValue(entry.handle, '-', 64),
          role: roleFromSource && roleFromSource.role ? formatRole(roleFromSource.role) : '-',
          rank: formatRankDisplay(gameId, entry),
          platform
        };
      })
      .filter(Boolean);

    return {
      mode: 'self',
      displayName: profilePublic.displayName,
      country: profilePublic.country,
      proofStatus: profilePublic.proofStatus,
      headline: profilePublic.headline,
      about: profilePublic.about,
      mainGame: primaryGame,
      mainRole: primaryRole || '-',
      mainRank: primaryRank || '-',
      mainPeak: primaryPeak || '-',
      mainHandle: sanitizeTextValue(primaryEntry && primaryEntry.handle, '-', 64),
      mainPlatform,
      availability: profileAvailability || sourceAvailability || 'Any',
      availabilityDetail: profileAvailabilityDetail || sourceAvailabilityDetail || '',
      secondaryGames,
      avatar: avatarConfig,
      conductSubjectType: 'player',
      conductSubjectId: state.authUser && state.authUser.handle ? state.authUser.handle : profilePublic.displayName
    };
  }

  function buildPlayerProfileViewModel(player) {
    const safePlayer = player && typeof player === 'object' ? player : {};
    const avatarConfig = resolveAvatarConfig(safePlayer, safePlayer.handle || safePlayer.name || 'Player');
    const mainGame = resolvePrimaryGameFromPlayer(safePlayer);
    const mainEntry = getProfileGameEntryFromPlayer(safePlayer, mainGame) || {};
    const proofStatus = normalizeProofStatus(mainEntry.proof, PROOF_STATUS.SELF_DECLARED);
    const mainRole = sanitizeTextValue(safePlayer.primaryRole, mainEntry.role ? formatRole(mainEntry.role) : '-', 64);
    const mainRank = sanitizeTextValue(safePlayer.primaryRank, mainEntry.rank || '-', 64);
    const mainPeak = sanitizeTextValue(mainEntry.peak, mainRank, 64);
    const mainHandle = sanitizeTextValue(mainEntry.handle, safePlayer.handle || '-', 64);
    const mainPlatform = resolvePlatformForGame(mainEntry, safePlayer);

    let secondaryGames = [];
    if (Array.isArray(safePlayer.secondaryGames) && safePlayer.secondaryGames.length) {
      secondaryGames = safePlayer.secondaryGames
        .map((entry) => {
          const game = normalizeGameId(entry && entry.game, '');
          if (!isCanonicalProfileGame(game) || game === mainGame) {
            return null;
          }
          return {
            game,
            handle: sanitizeTextValue(entry && entry.handle, '-', 64),
            role: sanitizeTextValue(entry && entry.role, '-', 48),
            rank: sanitizeTextValue(entry && entry.rank, '-', 48),
            platform: resolvePlatformForGame(entry, safePlayer)
          };
        })
        .filter(Boolean);
    } else {
      secondaryGames = (Array.isArray(safePlayer.games) ? safePlayer.games : [])
        .map((entry) => {
          const game = normalizeGameId(entry && entry.game, '');
          if (!isCanonicalProfileGame(game) || game === mainGame) {
            return null;
          }
          return {
            game,
            handle: sanitizeTextValue(entry && entry.handle, safePlayer.handle || '-', 64),
            role: sanitizeTextValue(entry && entry.role ? formatRole(entry.role) : '-', '-', 48),
            rank: sanitizeTextValue(entry && entry.rank, '-', 48),
            platform: resolvePlatformForGame(entry, safePlayer)
          };
        })
        .filter(Boolean);
    }

    secondaryGames.sort((left, right) => {
      const order = getOrderedGameKeys(mainGame);
      return order.indexOf(left.game) - order.indexOf(right.game);
    });

    const fallbackCopy = getScoutHookText(safePlayer);
    return {
      mode: 'player',
      displayName: sanitizeTextValue(safePlayer.handle, 'Player', 64),
      country: sanitizeTextValue(safePlayer.country, 'DE', 2).toUpperCase(),
      proofStatus,
      headline: sanitizeTextValue(safePlayer.headline, fallbackCopy, 170),
      about: sanitizeTextValue(safePlayer.about, fallbackCopy, 280),
      mainGame,
      mainRole: mainRole || '-',
      mainRank: mainRank || '-',
      mainPeak: mainPeak || '-',
      mainHandle,
      mainPlatform,
      availability: safePlayer.availability || 'Any',
      availabilityDetail: safePlayer.availabilityDetail ? String(safePlayer.availabilityDetail).trim() : '',
      secondaryGames,
      avatar: avatarConfig,
      conductSubjectType: 'player',
      conductSubjectId: safePlayer.handle || safePlayer.id || 'player',
      sourceGame: isCanonicalProfileGame(state.profileViewSourceGame) ? state.profileViewSourceGame : ''
    };
  }

  function getCurrentProfileViewModel(normalizedProfileState) {
    const safeProfile = normalizedProfileState || normalizeProfileState(state.profile);
    if (state.profileViewMode === 'player') {
      const player = findPlayerByViewState();
      if (player) {
        return buildPlayerProfileViewModel(player);
      }
      state.profileViewMode = 'self';
      state.profileViewPlayerId = '';
      state.profileViewHandle = '';
      state.profileViewSourceGame = '';
    }
    return buildSelfProfileViewModel(safeProfile);
  }

  function renderProfileGameLogo(gameId, className) {
    const logo = getGameLogoMeta(gameId);
    if (!logo) {
      return '';
    }
    const cls = className ? ` ${className}` : '';
    return `<img class="profile-game-logo${cls}" src="${escapeHtml(logo.src)}" alt="${escapeHtml(logo.alt)}">`;
  }

  function formatPrimaryMeta(viewModel) {
    const text = formatTemplate(t('d.profile.primaryMeta'), {
      game: getGameLabel(viewModel.mainGame),
      role: viewModel.mainRole || '-',
      rank: viewModel.mainRank || '-'
    });
    const logo = renderProfileGameLogo(viewModel.mainGame, 'profile-game-logo-inline');
    return `${logo}<span class="profile-primary-meta-text">${escapeHtml(text)}</span>`;
  }

  function renderMainGamePanel(viewModel) {
    const proofBadge = renderProofBadge(viewModel.proofStatus, { compact: true });
    const availabilityLabel = formatAvailability(viewModel.availability || 'Any');
    const availabilityDetail = viewModel.availabilityDetail ? String(viewModel.availabilityDetail).trim() : '';
    const mainGameLogo = renderProfileGameLogo(viewModel.mainGame, '');
    const mainPlatform = getPlatformLabel(viewModel.mainPlatform || '');
    const rankVisual = renderRankVisual({ rank: viewModel.mainRank }, viewModel.mainGame);

    return [
      `<h4 class="profile-main-panel-title">${escapeHtml(t('d.profile.mainGameDetails'))}</h4>`,
      '<div class="profile-main-row">',
      `<span class="profile-main-label">${escapeHtml(t('d.profile.mainGame'))}</span>`,
      `<span class="profile-main-value profile-main-game-value">${mainGameLogo}<span>${escapeHtml(getGameLabel(viewModel.mainGame))}</span></span>`,
      '</div>',
      '<div class="profile-main-row">',
      `<span class="profile-main-label">${escapeHtml(t('d.profile.ingameName'))}</span>`,
      `<span class="profile-main-value">${escapeHtml(viewModel.mainHandle || '-')}</span>`,
      '</div>',
      '<div class="profile-main-row">',
      `<span class="profile-main-label">${escapeHtml(t('d.profile.role'))}</span>`,
      `<span class="profile-main-value">${escapeHtml(viewModel.mainRole || '-')}</span>`,
      '</div>',
      '<div class="profile-main-row">',
      `<span class="profile-main-label">${escapeHtml(t('d.profile.rank'))}</span>`,
      `<span class="profile-main-value profile-main-rank-value">${rankVisual}<span>${escapeHtml(viewModel.mainRank || '-')}</span></span>`,
      '</div>',
      '<div class="profile-main-row">',
      `<span class="profile-main-label">${escapeHtml(t('d.profile.peak'))}</span>`,
      `<span class="profile-main-value">${escapeHtml(viewModel.mainPeak || '-')}</span>`,
      '</div>',
      '<div class="profile-main-row">',
      `<span class="profile-main-label">${escapeHtml(t('d.profile.proof'))}</span>`,
      `<span class="profile-main-value">${proofBadge}</span>`,
      '</div>',
      '<div class="profile-main-row profile-main-platform">',
      `<span class="profile-main-label">${escapeHtml(t('d.profile.platform'))}</span>`,
      `<span class="profile-main-value">${escapeHtml(mainPlatform)}</span>`,
      '</div>',
      '<div class="profile-main-row">',
      `<span class="profile-main-label">${escapeHtml(t('d.profile.availability'))}</span>`,
      `<span class="profile-main-value">${escapeHtml(availabilityLabel)}</span>`,
      '</div>',
      availabilityDetail
        ? `<p class="profile-main-subvalue">${escapeHtml(availabilityDetail)}</p>`
        : ''
    ].join('');
  }

  function renderSecondaryGames(viewModel) {
    const rows = Array.isArray(viewModel.secondaryGames) ? viewModel.secondaryGames : [];
    if (!rows.length) {
      return [
        `<h4 class="profile-secondary-title">${escapeHtml(t('d.profile.secondaryGames'))}</h4>`,
        `<p class="profile-secondary-empty">${escapeHtml(t('d.profile.noSecondaryGames'))}</p>`
      ].join('');
    }

    return [
      `<h4 class="profile-secondary-title">${escapeHtml(t('d.profile.secondaryGames'))}</h4>`,
      `<p class="profile-secondary-lead">${escapeHtml(t('d.profile.previousFocus'))}</p>`,
      '<div class="secondary-games-list">',
      rows.map((entry) => [
        '<article class="secondary-game-item">',
        `<p class="secondary-game-title">${renderProfileGameLogo(entry.game, 'secondary-game-logo')}<span>${escapeHtml(getGameLabel(entry.game))}</span></p>`,
        '<p class="secondary-game-meta">',
        `${escapeHtml(t('d.profile.ingameName'))}: ${escapeHtml(entry.handle || '-')} · `,
        `${escapeHtml(t('d.profile.role'))}: ${escapeHtml(entry.role || '-')} · `,
        `${escapeHtml(t('d.profile.rank'))}: ${escapeHtml(entry.rank || '-')}`,
        entry.platform ? ` · ${escapeHtml(t('d.profile.platform'))}: ${escapeHtml(getPlatformLabel(entry.platform))}` : '',
        '</p>',
        '</article>'
      ].join('')).join(''),
      '</div>'
    ].join('');
  }

  function setProfileProofBadge(scope, proofMeta) {
    document.querySelectorAll(`[data-profile-proof="${scope}"]`).forEach((badge) => {
      badge.classList.remove(
        'rank',
        'connected',
        'self',
        'proof-badge--verified',
        'proof-badge--connected-pending',
        'proof-badge--self-declared'
      );
      badge.classList.add(`proof-badge--${proofMeta.variant}`, getLegacyProofClass(proofMeta.variant));
      badge.setAttribute('title', proofMeta.tooltip);
    });
  }

  function renderProfileContextChips(context) {
    const chipsNode = document.getElementById('profileContextChips');
    if (!chipsNode) {
      return;
    }
    const ctx = context && typeof context === 'object' ? context : getProfileReturnContext();
    const chips = [];
    if (ctx.source === 'compare') {
      chips.push(t('d.profile.context.fromCompare'));
    } else if (ctx.source === 'explore') {
      chips.push(t('d.profile.context.fromExplore'));
    }
    if (!chips.length) {
      chipsNode.classList.add('hidden');
      chipsNode.innerHTML = '';
      return;
    }
    chipsNode.classList.remove('hidden');
    chipsNode.innerHTML = chips
      .map((label) => `<span class="profile-context-chip">${escapeHtml(label)}</span>`)
      .join('');
  }

  function renderProfileHeaderActions() {
    const backButton = document.getElementById('profileBackButton');
    const closeButton = document.getElementById('profileCloseButton');
    const compareReturnButton = document.getElementById('profileCompareReturnButton');
    const editPrimaryButton = document.getElementById('profileEditPrimary');

    if (backButton) {
      backButton.dataset.d18n = 'd.profile.back';
      backButton.textContent = t('d.profile.back');
      backButton.setAttribute('aria-label', t('d.profile.back'));
    }
    if (closeButton) {
      closeButton.dataset.d18n = 'd.profile.close';
      closeButton.textContent = t('d.profile.close');
      closeButton.setAttribute('aria-label', t('d.profile.close'));
    }

    const context = getProfileReturnContext();
    if (compareReturnButton) {
      const visible = context.source === 'compare';
      compareReturnButton.classList.toggle('hidden', !visible);
      compareReturnButton.dataset.d18n = 'd.profile.return.compare';
      compareReturnButton.textContent = t('d.profile.return.compare');
      compareReturnButton.setAttribute('aria-label', t('d.profile.return.compare'));
    }

    if (editPrimaryButton) {
      const visible = state.isAuthenticated && isSelfProfileView();
      editPrimaryButton.classList.toggle('hidden', !visible);
      editPrimaryButton.dataset.d18n = 'd.profile.editPrimary';
      editPrimaryButton.textContent = t('d.profile.editPrimary');
      editPrimaryButton.setAttribute('aria-label', t('d.profile.editPrimary'));
    }

    renderProfileContextChips(context);
  }

  function initProfileHeaderActions() {
    if (!isProfilePage()) {
      return;
    }
    const backButton = document.getElementById('profileBackButton');
    const closeButton = document.getElementById('profileCloseButton');
    const compareReturnButton = document.getElementById('profileCompareReturnButton');
    const editPrimaryButton = document.getElementById('profileEditPrimary');

    if (backButton && !backButton.dataset.bound) {
      backButton.dataset.bound = '1';
      backButton.addEventListener('click', () => {
        const target = resolveProfileBackTarget(getProfileReturnContext());
        goBackOrFallback(target);
      });
    }

    if (closeButton && !closeButton.dataset.bound) {
      closeButton.dataset.bound = '1';
      closeButton.addEventListener('click', () => {
        const target = resolveProfileBackTarget(getProfileReturnContext());
        goBackOrFallback(target);
      });
    }

    if (compareReturnButton && !compareReturnButton.dataset.bound) {
      compareReturnButton.dataset.bound = '1';
      compareReturnButton.addEventListener('click', () => {
        const context = getProfileReturnContext();
        const target = resolveProfileBackTarget({
          source: 'compare',
          compareHandles: context.compareHandles
        });
        window.location.href = target;
      });
    }

    if (editPrimaryButton && !editPrimaryButton.dataset.bound) {
      editPrimaryButton.dataset.bound = '1';
      editPrimaryButton.addEventListener('click', () => {
        openProfileEditorModal('public');
      });
    }

    renderProfileHeaderActions();
  }

  function applyProfileStateToDOM() {
    const normalized = normalizeProfileState(state.profile);
    state.profile = normalized;
    const entitiesState = loadEntitiesState();
    const profile = normalized.publicProfile;

    const viewModel = getCurrentProfileViewModel(normalized);
    const isExternalView = viewModel.mode === 'player';

    setProfileField('public.displayName', viewModel.displayName);
    setProfileField('public.country', formatCountryWithFlag(viewModel.country));
    const avatarWrap = document.getElementById('publicAvatarWrap');
    const avatarImage = document.getElementById('publicAvatarImage');
    const avatarFallback = document.getElementById('publicAvatarFallback');
    const avatarBadgeLayer = document.getElementById('publicAvatarBadgeLayer');
    if (avatarWrap) {
      avatarWrap.classList.toggle('profile-avatar--badge-only', isExternalView);
    }
    if (avatarImage) {
      avatarImage.setAttribute('aria-hidden', isExternalView ? 'true' : 'false');
    }
    if (avatarFallback) {
      avatarFallback.textContent = viewModel.avatar && viewModel.avatar.initials
        ? viewModel.avatar.initials
        : getAvatarInitials(viewModel.displayName, 'PL');
    }
    if (avatarBadgeLayer) {
      if (isExternalView) {
        avatarBadgeLayer.classList.remove('hidden');
        avatarBadgeLayer.innerHTML = renderAvatarBadgeHTML(
          viewModel.avatar || resolveAvatarConfig({}, viewModel.displayName),
          {
            size: 'lg',
            className: 'profile-avatar-badge',
            ariaLabel: `${t('d.avatar.defaultAlt')} ${viewModel.displayName || ''}`.trim()
          }
        );
      } else {
        avatarBadgeLayer.classList.add('hidden');
        avatarBadgeLayer.innerHTML = '';
      }
    }
    const primaryMetaNode = document.getElementById('publicPrimaryMeta');
    if (primaryMetaNode) {
      primaryMetaNode.innerHTML = formatPrimaryMeta(viewModel);
    } else {
      setProfileField('public.primaryMeta', formatTemplate(t('d.profile.primaryMeta'), {
        game: getGameLabel(viewModel.mainGame),
        role: viewModel.mainRole || '-',
        rank: viewModel.mainRank || '-'
      }));
    }
    const dedupeExternalBio = isExternalView
      && normalizeIdentity(viewModel.headline) === normalizeIdentity(viewModel.about);
    setProfileField('public.headline', viewModel.headline);
    setProfileField('public.about', dedupeExternalBio ? '' : viewModel.about);
    document.querySelectorAll('[data-profile-field="public.about"]').forEach((node) => {
      node.classList.toggle('hidden', dedupeExternalBio);
    });

    setProfileField('hero.displayName', profile.displayName);
    setProfileField('hero.role', profile.role);
    setProfileField('hero.country', formatCountry(profile.country));
    setProfileField('hero.game.overwatch', formatGameLine('overwatch', profile.games.overwatch.handle));
    setProfileField('hero.game.lol', formatGameLine('lol', profile.games.lol.handle));
    setProfileField('hero.game.rivals', formatGameLine('rivals', profile.games.rivals.handle));
    setProfileField('hero.game.fortnite', formatGameLine('fortnite', profile.games.fortnite.handle));
    applyGameRowOrder('hero', profile.mainGame);

    const mainPanel = document.getElementById('publicMainGamePanel');
    if (mainPanel) {
      mainPanel.innerHTML = renderMainGamePanel(viewModel);
    }

    const secondaryPanel = document.getElementById('publicSecondaryGames');
    if (secondaryPanel) {
      secondaryPanel.innerHTML = renderSecondaryGames(viewModel);
    }

    const readonlyHint = document.getElementById('publicExternalReadonlyHint');
    if (readonlyHint) {
      readonlyHint.classList.toggle('hidden', !isExternalView);
    }

    const ownerSections = document.getElementById('publicOwnerSections');
    if (ownerSections) {
      ownerSections.classList.toggle('hidden', isExternalView);
    }

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

    const publicProof = getProofMeta(viewModel.proofStatus);
    setProfileField('public.proof', publicProof.label);
    setProfileProofBadge('public', publicProof);

    const heroProof = getProofMeta(profile.proofStatus);
    setProfileField('hero.proof', heroProof.label);
    setProfileProofBadge('hero', heroProof);

    const conductSummary = formatConductSummary(
      viewModel.conductSubjectType || 'player',
      viewModel.conductSubjectId || profile.displayName,
      entitiesState
    );
    setProfileField('public.conductSummary', conductSummary);

    const heroSubject = state.authUser && state.authUser.handle
      ? state.authUser.handle
      : profile.displayName;
    const heroConductSummary = formatConductSummary('player', heroSubject, entitiesState);
    setProfileField('hero.conductSummary', heroConductSummary);
    renderProfileEditorControls();
    renderProfileHeaderActions();
  }

  function setProfileField(field, value) {
    document.querySelectorAll(`[data-profile-field="${field}"]`).forEach((node) => {
      node.textContent = value;
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
      profileAvailability: document.getElementById('profileAvailability'),
      profileAvailabilityDetail: document.getElementById('profileAvailabilityDetail'),
      owHandle: document.getElementById('editorOwHandle'),
      owTier: document.getElementById('editorOwTier'),
      owDivision: document.getElementById('editorOwDivision'),
      owPlatform: document.getElementById('editorOwPlatform'),
      owDivisionWrap: document.getElementById('editorOwDivisionWrap'),
      lolHandle: document.getElementById('editorLolHandle'),
      lolTier: document.getElementById('editorLolTier'),
      lolDivision: document.getElementById('editorLolDivision'),
      lolPlatform: document.getElementById('editorLolPlatform'),
      lolDivisionWrap: document.getElementById('editorLolDivisionWrap'),
      rivalsHandle: document.getElementById('editorRivalsHandle'),
      rivalsTier: document.getElementById('editorRivalsTier'),
      rivalsPlatform: document.getElementById('editorRivalsPlatform'),
      fortniteHandle: document.getElementById('editorFortniteHandle'),
      fortniteTier: document.getElementById('editorFortniteTier'),
      fortniteDivision: document.getElementById('editorFortniteDivision'),
      fortnitePlatform: document.getElementById('editorFortnitePlatform'),
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

  function populateProfilePlatformOptions() {
    const inputs = getProfileEditorInputs();
    if (!inputs.owPlatform || !inputs.lolPlatform || !inputs.rivalsPlatform || !inputs.fortnitePlatform) {
      return;
    }
    const options = ALLOWED_PLATFORM_IDS.slice();
    setSelectOptions(inputs.owPlatform, options, (value) => getPlatformLabel(value));
    setSelectOptions(inputs.lolPlatform, options, (value) => getPlatformLabel(value));
    setSelectOptions(inputs.rivalsPlatform, options, (value) => getPlatformLabel(value));
    setSelectOptions(inputs.fortnitePlatform, options, (value) => getPlatformLabel(value));
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
    if (inputs.profileAvailability) {
      inputs.profileAvailability.value = normalizeAvailability(data.availability);
      if (typeof inputs.profileAvailability._uspecRebuildMenu === 'function') {
        inputs.profileAvailability._uspecRebuildMenu();
      }
    }
    if (inputs.profileAvailabilityDetail) {
      inputs.profileAvailabilityDetail.value = data.availabilityDetail || '';
    }

    populateProfileRankOptions();
    populateProfilePlatformOptions();

    inputs.owHandle.value = data.games.overwatch.handle;
    inputs.owTier.value = data.games.overwatch.tier;
    inputs.owDivision.value = data.games.overwatch.division;
    inputs.owPlatform.value = normalizePlatform(data.games.overwatch.platform) || PLATFORM_IDS.PC;
    inputs.lolHandle.value = data.games.lol.handle;
    inputs.lolTier.value = data.games.lol.tier;
    inputs.lolDivision.value = data.games.lol.division;
    inputs.lolPlatform.value = normalizePlatform(data.games.lol.platform) || PLATFORM_IDS.PC;
    inputs.rivalsHandle.value = data.games.rivals.handle;
    inputs.rivalsTier.value = data.games.rivals.tier;
    inputs.rivalsPlatform.value = normalizePlatform(data.games.rivals.platform) || PLATFORM_IDS.PC;
    inputs.fortniteHandle.value = data.games.fortnite.handle;
    inputs.fortniteTier.value = data.games.fortnite.tier;
    inputs.fortniteDivision.value = data.games.fortnite.division;
    inputs.fortnitePlatform.value = normalizePlatform(data.games.fortnite.platform) || PLATFORM_IDS.PC;

    if (typeof inputs.owPlatform._uspecRebuildMenu === 'function') inputs.owPlatform._uspecRebuildMenu();
    if (typeof inputs.lolPlatform._uspecRebuildMenu === 'function') inputs.lolPlatform._uspecRebuildMenu();
    if (typeof inputs.rivalsPlatform._uspecRebuildMenu === 'function') inputs.rivalsPlatform._uspecRebuildMenu();
    if (typeof inputs.fortnitePlatform._uspecRebuildMenu === 'function') inputs.fortnitePlatform._uspecRebuildMenu();

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

    if (state.profileViewMode !== 'self') {
      state.profileViewMode = 'self';
      state.profileViewPlayerId = '';
      state.profileViewHandle = '';
      state.profileViewSourceGame = '';
      replaceProfileRoute('', {});
      applyProfileStateToDOM();
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
    const currentProfile = normalizeProfileState(state.profile);

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
        availability: normalizeAvailability(inputs.profileAvailability ? inputs.profileAvailability.value : 'Any'),
        availabilityDetail: inputs.profileAvailabilityDetail ? sanitizeTextValue(inputs.profileAvailabilityDetail.value, '', 80) : '',
        games: {
          overwatch: {
            handle: inputs.owHandle.value,
            tier: inputs.owTier.value,
            division: inputs.owDivision.value,
            platform: normalizePlatform(inputs.owPlatform ? inputs.owPlatform.value : currentProfile.publicProfile.games.overwatch.platform)
              || PLATFORM_IDS.PC
          },
          lol: {
            handle: inputs.lolHandle.value,
            tier: inputs.lolTier.value,
            division: inputs.lolDivision.value,
            platform: normalizePlatform(inputs.lolPlatform ? inputs.lolPlatform.value : currentProfile.publicProfile.games.lol.platform)
              || PLATFORM_IDS.PC
          },
          rivals: {
            handle: inputs.rivalsHandle.value,
            tier: inputs.rivalsTier.value,
            platform: normalizePlatform(inputs.rivalsPlatform ? inputs.rivalsPlatform.value : currentProfile.publicProfile.games.rivals.platform)
              || PLATFORM_IDS.PC
          },
          fortnite: {
            handle: inputs.fortniteHandle.value,
            tier: inputs.fortniteTier.value,
            division: inputs.fortniteDivision.value,
            platform: normalizePlatform(inputs.fortnitePlatform ? inputs.fortnitePlatform.value : currentProfile.publicProfile.games.fortnite.platform)
              || PLATFORM_IDS.PC
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
    populateProfilePlatformOptions();
  }

  function renderProfileEditorControls() {
    const visible = state.isAuthenticated && state.profileViewMode === 'self';
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
      const roleMatch = team.games.some((entry) => {
        if (state.game !== GAME_IDS.ANY && entry.game !== state.game) {
          return false;
        }
        return entry.needs.some((need) => need.role === state.role);
      });
      if (!roleMatch) {
        return false;
      }
    }

    if (state.rank !== 'Any') {
      const rankMatch = team.games.some((entry) => {
        if (state.game !== GAME_IDS.ANY && entry.game !== state.game) {
          return false;
        }
        const gameKey = getProfileGameKeyFromExploreGame(entry.game);
        if (!gameKey) {
          return false;
        }
        return entry.needs.some((need) => extractTierFromExploreRank(gameKey, need.rankMin) === state.rank);
      });
      if (!rankMatch) {
        return false;
      }
    }

    return true;
  }

  function renderPlayerCard(player, entitiesState) {
    const game = getPrimaryGame(player);
    const inCompare = state.compare.includes(player.handle);
    const conduct = formatConductSummary('player', player.handle, entitiesState);
    const proofMeta = getProofMeta(game.proof);
    const availabilityLabel = formatAvailability(player.availability || 'Any');
    const hookText = getScoutHookText(player);
    const availabilityDetail = player.availabilityDetail ? String(player.availabilityDetail).trim() : '';
    const gameLogo = getGameLogoMeta(game.game);
    const platformLabel = getPlatformLabel(resolvePlatformForGame(game, player));
    const countryName = formatCountry(player.country);
    const countryFlag = countryCodeToFlagEmoji(player.country);
    const countryText = countryFlag ? `${countryFlag} ${countryName}` : countryName;
    const avatarConfig = resolveAvatarConfig(player, player.handle);
    const avatarBadge = renderAvatarBadgeHTML(avatarConfig, {
      size: 'md',
      className: 'result-card__avatar',
      ariaLabel: `${t('d.avatar.defaultAlt')} ${player.handle}`.trim()
    });
    const rankVisual = renderRankVisual(game, game.game);

    return [
      '<article class="result-card">',
      '<div class="result-card__header">',
      '<div class="result-card__identity">',
      avatarBadge,
      '<div class="result-card__title-wrap">',
      `<h3 class="result-handle">${escapeHtml(player.handle)}</h3>`,
      '<div class="explore-card-game-row">',
      gameLogo
        ? `<img class="explore-card-game-logo" src="${escapeHtml(gameLogo.src)}" alt="${escapeHtml(gameLogo.alt)}">`
        : '',
      `<span class="explore-card-game-label">${escapeHtml(getGameLabel(game.game))}</span>`,
      '</div>',
      '</div>',
      '</div>',
      renderProofBadge(game.proof, { compact: true }),
      '</div>',
      `<p class="scout-hook">${escapeHtml(hookText)}</p>`,
      '<div class="result-card__rank">',
      `<span class="result-card__rank-main">${rankVisual}<strong>${escapeHtml(game.rank || '-')}</strong></span>`,
      `<span>${escapeHtml(t('d.card.peak'))} ${escapeHtml(game.peak || '-')}</span>`,
      '</div>',
      '<div class="scout-chips">',
      `<span class="scout-chip"><strong>${escapeHtml(t('d.card.chip.proof'))}</strong><span>${escapeHtml(proofMeta.label)}</span></span>`,
      `<span class="scout-chip"><strong>${escapeHtml(t('d.card.chip.role'))}</strong><span>${escapeHtml(formatRole(game.role) || '-')}</span></span>`,
      `<span class="scout-chip"><strong>${escapeHtml(t('d.card.chip.availability'))}</strong><span>${escapeHtml(availabilityLabel || '-')}</span></span>`,
      `<span class="scout-chip scout-chip--platform"><strong>${escapeHtml(t('d.card.chip.platform'))}</strong><span>${escapeHtml(platformLabel)}</span></span>`,
      '</div>',
      availabilityDetail ? `<p class="availability-detail">${escapeHtml(availabilityDetail)}</p>` : '',
      '<div class="result-card__meta">',
      `<span class="meta-chip">${escapeHtml(t('d.card.region'))}: ${escapeHtml(player.region)}</span>`,
      `<span class="meta-chip">${escapeHtml(t('d.card.country'))}: ${escapeHtml(countryText)}</span>`,
      `<span class="meta-chip">${escapeHtml(player.language.join(', '))}</span>`,
      `<span class="conduct-line">${conduct}</span>`,
      '</div>',
      '<div class="result-card__actions">',
      `<button type="button" class="button primary small" data-action="invite-player" data-handle="${escapeHtml(player.handle)}" data-game="${escapeHtml(game.game)}">${escapeHtml(t('d.card.invite'))}</button>`,
      `<button type="button" class="button ghost small" data-action="compare-player" data-handle="${escapeHtml(player.handle)}">${escapeHtml(inCompare ? t('d.card.remove') : t('d.card.compare'))}</button>`,
      `<button type="button" class="button ghost small" data-action="open-player" data-handle="${escapeHtml(player.handle)}" data-player-id="${escapeHtml(getPlayerViewId(player))}" data-game="${escapeHtml(game.game)}">${escapeHtml(t('d.card.open'))}</button>`,
      '</div>',
      '</article>'
    ].join('');
  }

  function renderTeamCard(team, entitiesState) {
    const conduct = formatConductSummary('team', team.slug, entitiesState);
    const scopedNeeds = team.games
      .filter((entry) => state.game === GAME_IDS.ANY || entry.game === state.game)
      .flatMap((entry) => entry.needs.map((need) => formatTeamNeed(entry.game, need)));
    const primaryNeed = getTeamPrimaryNeed(team);
    const primaryGame = primaryNeed && primaryNeed.game
      ? primaryNeed.game
      : ((Array.isArray(team.games) && team.games[0] && team.games[0].game) ? team.games[0].game : GAME_IDS.OVERWATCH);
    const topNeed = primaryNeed && primaryNeed.need
      ? `${formatRole(primaryNeed.need.role)} · ${primaryNeed.need.rankMin}+`
      : '-';
    const roleNeeded = primaryNeed && primaryNeed.need ? formatRole(primaryNeed.need.role) : '-';
    const proofMeta = getProofMeta(team.verified);
    const coarseAvailability = formatAvailability(getCoarseTeamAvailability(team));
    const availabilityDetail = team.availabilityDetail ? String(team.availabilityDetail).trim() : '';
    const hookText = getScoutHookText(team);
    const gameLogo = getGameLogoMeta(primaryGame);
    const platformFocus = formatPlatformList(team.platforms);
    const hasPlatformFocus = platformFocus !== '—';
    const avatarConfig = resolveAvatarConfig(team, team.name, { preferredStyle: AVATAR_STYLE_IDS.BRAND });
    const avatarBadge = renderAvatarBadgeHTML(avatarConfig, {
      size: 'md',
      className: 'result-card__avatar',
      ariaLabel: `${t('d.avatar.defaultAlt')} ${team.name}`.trim()
    });
    const rankVisual = renderRankVisual({ rank: primaryNeed && primaryNeed.need ? primaryNeed.need.rankMin : '' }, primaryGame);

    return [
      '<article class="result-card">',
      '<div class="result-card__header">',
      '<div class="result-card__identity">',
      avatarBadge,
      '<div class="result-card__title-wrap">',
      `<h3 class="result-handle">${escapeHtml(team.name)}</h3>`,
      '<div class="explore-card-game-row">',
      gameLogo
        ? `<img class="explore-card-game-logo" src="${escapeHtml(gameLogo.src)}" alt="${escapeHtml(gameLogo.alt)}">`
        : '',
      `<span class="explore-card-game-label">${escapeHtml(getGameLabel(primaryGame))}</span>`,
      '</div>',
      '</div>',
      '</div>',
      renderProofBadge(team.verified, { compact: true }),
      '</div>',
      `<p class="scout-hook">${escapeHtml(hookText)}</p>`,
      '<div class="result-card__rank">',
      `<span class="result-card__rank-main">${rankVisual}<strong>${escapeHtml(topNeed)}</strong></span>`,
      `<span>${escapeHtml(formatSchedule(team.schedule))}</span>`,
      '</div>',
      '<div class="scout-chips">',
      `<span class="scout-chip"><strong>${escapeHtml(t('d.card.chip.proof'))}</strong><span>${escapeHtml(proofMeta.label)}</span></span>`,
      `<span class="scout-chip"><strong>${escapeHtml(t('d.card.chip.roleNeeded'))}</strong><span>${escapeHtml(roleNeeded)}</span></span>`,
      `<span class="scout-chip"><strong>${escapeHtml(t('d.card.chip.availability'))}</strong><span>${escapeHtml(coarseAvailability || '-')}</span></span>`,
      '</div>',
      availabilityDetail ? `<p class="availability-detail">${escapeHtml(availabilityDetail)}</p>` : '',
      '<div class="result-card__meta">',
      `<span class="meta-chip">${escapeHtml(t('d.card.region'))}: ${escapeHtml(team.region)}</span>`,
      scopedNeeds.length > 1 ? `<span class="meta-chip">${escapeHtml(scopedNeeds[1])}</span>` : '',
      hasPlatformFocus ? `<span class="meta-chip">${escapeHtml(t('d.common.platformFocus'))}: ${escapeHtml(platformFocus)}</span>` : '',
      `<span class="conduct-line">${conduct}</span>`,
      '</div>',
      '<div class="result-card__actions">',
      `<button type="button" class="button primary small" data-action="invite-team" data-team="${escapeHtml(team.slug)}" data-game="${escapeHtml(primaryGame)}">${escapeHtml(t('d.card.apply'))}</button>`,
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
    const entitiesState = loadEntitiesState();

    if (state.mode === 'players') {
      const filteredPlayers = players.filter(passesPlayerFilters);
      list.innerHTML = filteredPlayers.map((player) => renderPlayerCard(player, entitiesState)).join('');
      const hasResults = filteredPlayers.length > 0;
      empty.classList.toggle('hidden', hasResults);
    } else {
      const filteredTeams = teams.filter(passesTeamFilters);
      list.innerHTML = filteredTeams.map((team) => renderTeamCard(team, entitiesState)).join('');
      const hasResults = filteredTeams.length > 0;
      empty.classList.toggle('hidden', hasResults);
    }

    bindCardActions();
  }

  function clearCompareSelection() {
    state.compare = [];
    state.compareExpanded = false;
    renderResults();
    renderCompareDrawer();
  }

  function renderCompareDock() {
    const dock = document.getElementById('compareDock');
    const content = document.getElementById('compareDockContent');
    const openButton = document.getElementById('compareDockOpen');
    const clearButton = document.getElementById('compareDockClear');
    if (!dock || !content || !openButton || !clearButton) {
      return;
    }

    const selected = players.filter((player) => state.compare.includes(player.handle)).slice(0, 2);
    const hasCompare = selected.length > 0;
    state.compareDockVisible = hasCompare;
    dock.classList.toggle('is-visible', hasCompare);
    dock.setAttribute('aria-hidden', hasCompare ? 'false' : 'true');

    openButton.disabled = !hasCompare;
    clearButton.disabled = !hasCompare;

    if (!hasCompare) {
      content.innerHTML = `<strong>${escapeHtml(t('d.compare.dock.title'))}</strong>`;
      return;
    }

    const countLabel = formatTemplate(t('d.compare.dock.selectedCount'), {
      count: String(selected.length)
    });
    content.innerHTML = [
      `<strong class="compare-dock__title">${escapeHtml(t('d.compare.dock.title'))}</strong>`,
      `<span class="compare-dock__count">${escapeHtml(countLabel)}</span>`,
      '<div class="compare-dock__players">',
      selected.map((player) => {
        const primaryGame = getPrimaryGame(player);
        const gameLogo = getGameLogoMeta(primaryGame.game);
        return [
          '<span class="compare-dock__player">',
          renderAvatarBadgeHTML(resolveAvatarConfig(player, player.handle), {
            size: 'sm',
            className: 'compare-slot-avatar',
            ariaLabel: `${t('d.avatar.defaultAlt')} ${player.handle}`
          }),
          '<span class="compare-dock__player-copy">',
          `<span>${escapeHtml(player.handle)}</span>`,
          '<span class="compare-dock__player-meta">',
          gameLogo ? `<img class="compare-slot-game" src="${escapeHtml(gameLogo.src)}" alt="${escapeHtml(gameLogo.alt)}">` : '',
          `<span>${escapeHtml(getGameLabel(primaryGame.game))}</span>`,
          '</span>',
          '</span>',
          '</span>'
        ].join('');
      }).join(''),
      '</div>'
    ].join('');
  }

  function renderCompareDrawer() {
    const compareDrawer = document.getElementById('compareDrawer');
    const compareEmpty = document.getElementById('compareEmpty');
    const compareContent = document.getElementById('compareContent');
    const inviteSelected = document.getElementById('inviteSelected');
    const compareSlotA = document.getElementById('compareSlotA');
    const compareSlotB = document.getElementById('compareSlotB');
    const compareNow = document.getElementById('compareNow');
    const compareHeadToHead = document.getElementById('compareHeadToHead');
    const exploreLayout = compareDrawer ? compareDrawer.closest('.explore-layout') : null;

    if (!compareEmpty || !compareContent || !inviteSelected) {
      return;
    }

    const selected = players.filter((player) => state.compare.includes(player.handle));
    const hasCompare = selected.length > 0;
    renderCompareDock();
    if (compareDrawer) {
      compareDrawer.classList.toggle('is-active', hasCompare);
    }
    if (compareHeadToHead) {
      compareHeadToHead.classList.toggle('hidden', !hasCompare);
    }
    if (exploreLayout) {
      exploreLayout.classList.toggle('compare-active', hasCompare);
    }
    const setSlot = (node, player) => {
      if (!node) return;
      if (player) {
        const primaryGame = getPrimaryGame(player);
        const gameLogo = getGameLogoMeta(primaryGame.game);
        const avatarBadge = renderAvatarBadgeHTML(resolveAvatarConfig(player, player.handle), {
          size: 'sm',
          className: 'compare-slot-avatar'
        });
        const rankVisual = renderRankVisual(primaryGame, primaryGame.game);
        const platform = getPlatformLabel(resolvePlatformForGame(primaryGame, player));
        node.innerHTML = [
          '<span class="compare-slot-content">',
          avatarBadge,
          '<span class="compare-slot-copy">',
          `<span class="compare-slot-name">${escapeHtml(player.handle)}</span>`,
          '<span class="compare-slot-meta">',
          gameLogo ? `<img class="compare-slot-game" src="${escapeHtml(gameLogo.src)}" alt="${escapeHtml(gameLogo.alt)}">` : '',
          rankVisual,
          `<span>${escapeHtml(platform)}</span>`,
          '</span>',
          '</span>',
          '</span>'
        ].join('');
        node.classList.add('is-filled');
        node.dataset.action = 'open-player-compare';
        node.dataset.handle = player.handle;
        node.dataset.playerId = getPlayerViewId(player);
        node.dataset.game = primaryGame.game;
        node.setAttribute('aria-label', `${player.handle} ${getGameLabel(primaryGame.game)} ${platform}`);
        node.disabled = false;
        delete node.dataset.d18n;
        return;
      }
      node.textContent = t('d.compare.slot.empty');
      node.dataset.d18n = 'd.compare.slot.empty';
      node.classList.remove('is-filled');
      delete node.dataset.action;
      delete node.dataset.handle;
      delete node.dataset.playerId;
      delete node.dataset.game;
      node.removeAttribute('aria-label');
      node.disabled = true;
    };

    setSlot(compareSlotA, selected[0]);
    setSlot(compareSlotB, selected[1]);

    if (!hasCompare) {
      state.compareExpanded = false;
      compareEmpty.classList.remove('hidden');
      compareContent.classList.add('hidden');
      compareContent.innerHTML = '';
      inviteSelected.disabled = true;
      if (compareNow) {
        compareNow.disabled = true;
        compareNow.dataset.d18n = 'd.compare.now';
        compareNow.textContent = t('d.compare.now');
      }
      return;
    }

    if (compareNow) {
      compareNow.disabled = false;
      const compareNowKey = state.compareExpanded ? 'd.compare.hide' : 'd.compare.now';
      compareNow.dataset.d18n = compareNowKey;
      compareNow.textContent = t(compareNowKey);
    }

    const rows = [
      { key: t('d.compare.row.role'), value: (p) => formatRole(getPrimaryGame(p).role) || '-' },
      { key: t('d.compare.row.rank'), value: (p) => getPrimaryGame(p).rank || '-' },
      { key: t('d.compare.row.proof'), value: (p) => renderProofBadge(getPrimaryGame(p).proof, { compact: true }), isHtml: true },
      { key: t('d.compare.row.country'), value: (p) => formatCountry(p.country) },
      { key: t('d.compare.row.availability'), value: (p) => formatAvailability(p.availability) },
      { key: t('d.compare.row.languages'), value: (p) => p.language.join(', ') }
    ];

    compareContent.innerHTML = [
      '<div class="compare-profile-actions">',
      selected.map((player) => [
        `<button type="button" class="compare-profile-action" data-action="open-player-compare" data-handle="${escapeHtml(player.handle)}" data-player-id="${escapeHtml(getPlayerViewId(player))}" data-game="${escapeHtml(getPrimaryGame(player).game)}">`,
        renderAvatarBadgeHTML(resolveAvatarConfig(player, player.handle), {
          size: 'sm',
          className: 'compare-slot-avatar',
          ariaLabel: `${t('d.avatar.defaultAlt')} ${player.handle}`
        }),
        `<span>${escapeHtml(t('d.card.open'))}: ${escapeHtml(player.handle)}</span>`,
        '</button>'
      ].join('')).join(''),
      '</div>',
      '<table class="compare-table">',
      `<thead><tr><th>${t('d.compare.header.field')}</th>`,
      selected.map((player) => {
        const primary = getPrimaryGame(player);
        const logo = getGameLogoMeta(primary.game);
        const rankVisual = renderRankVisual(primary, primary.game);
        const platform = getPlatformLabel(resolvePlatformForGame(primary, player));
        return [
          '<th>',
          `<button type="button" class="compare-player-open" data-action="open-player-compare" data-handle="${escapeHtml(player.handle)}" data-player-id="${escapeHtml(getPlayerViewId(player))}" data-game="${escapeHtml(primary.game)}">`,
          '<span class="compare-player-open-content">',
          renderAvatarBadgeHTML(resolveAvatarConfig(player, player.handle), {
            size: 'sm',
            className: 'compare-slot-avatar',
            ariaLabel: `${t('d.avatar.defaultAlt')} ${player.handle}`
          }),
          '<span class="compare-player-open-copy">',
          `<span>${escapeHtml(player.handle)}</span>`,
          '<span class="compare-player-open-meta">',
          logo ? `<img class="compare-slot-game" src="${escapeHtml(logo.src)}" alt="${escapeHtml(logo.alt)}">` : '',
          rankVisual,
          `<span>${escapeHtml(platform)}</span>`,
          '</span>',
          '</span>',
          '</span>',
          '</button>',
          '</th>'
        ].join('');
      }).join(''),
      '</tr></thead><tbody>',
      rows
        .map((row) => `<tr><td>${row.key}</td>${selected.map((p) => `<td>${row.isHtml ? row.value(p) : escapeHtml(row.value(p))}</td>`).join('')}</tr>`)
        .join(''),
      '</tbody></table>'
    ].join('');

    compareEmpty.classList.add('hidden');
    compareContent.classList.toggle('hidden', !state.compareExpanded);
    inviteSelected.disabled = false;
  }

  function requireAuthForAction(lockModule, lockAction) {
    if (state.isAuthenticated) {
      return true;
    }
    track('click_preview_locked_cta', {
      page: getCurrentPage(),
      module: lockModule || 'unknown',
      action: lockAction || 'auth_required'
    });
    showToast('d.auth.requiredAction', 'error');
    openAuthModal('login');
    return false;
  }

  function getRequestStatusMeta(request) {
    if (request.status === 'CANCELLED') {
      return { key: 'd.requests.status.cancelled', cls: 'cancelled' };
    }
    if (request.status === 'COMPLETED') {
      return { key: 'd.requests.status.completed', cls: 'completed' };
    }
    return { key: 'd.requests.status.pending', cls: 'pending' };
  }

  function getRequestTryoutMeta(request) {
    const tryout = normalizeTryoutState(request);
    if (request.status === 'CANCELLED') {
      return { key: 'd.requests.tryout.cancelled', cls: 'cancelled' };
    }
    if (tryout.selfConfirmedAt && tryout.counterpartConfirmedAt && tryout.verifiedAt) {
      return { key: 'd.requests.tryout.verified', cls: 'verified' };
    }
    if (tryout.selfConfirmedAt || tryout.counterpartConfirmedAt) {
      return { key: 'd.requests.tryout.partial', cls: 'waiting' };
    }
    return { key: 'd.requests.tryout.pending', cls: 'pending' };
  }

  function getRequestRatingMeta(request, entitiesState) {
    const tryout = normalizeTryoutState(request);
    const selfRating = getRatingBySide(entitiesState, request.id, 'self');
    const counterpartRating = getRatingBySide(entitiesState, request.id, 'counterpart');

    if (request.status !== 'COMPLETED' || !tryout.verifiedAt) {
      return { text: t('d.requests.rating.locked'), cls: 'pending', canOpen: false };
    }

    if (selfRating && counterpartRating) {
      return {
        text: formatTemplate(t('d.requests.rating.revealed'), {
          you: selfRating.stars,
          counterpart: counterpartRating.stars
        }),
        cls: 'verified',
        canOpen: false
      };
    }

    if (selfRating && !counterpartRating) {
      if (tryout.ratingRevealState === 'timeout_partial') {
        return {
          text: formatTemplate(t('d.requests.rating.timeoutSelf'), { stars: selfRating.stars }),
          cls: 'waiting',
          canOpen: false
        };
      }
      return { text: t('d.requests.rating.waitingCounterpart'), cls: 'waiting', canOpen: false };
    }

    if (!selfRating && counterpartRating) {
      if (tryout.ratingRevealState === 'timeout_partial') {
        return { text: t('d.requests.rating.timeoutCounterpart'), cls: 'waiting', canOpen: true };
      }
      return { text: t('d.requests.rating.waitingYou'), cls: 'waiting', canOpen: true };
    }

    return { text: t('d.requests.rating.notStarted'), cls: 'pending', canOpen: true };
  }

  function resolveRequestProofStatus(request) {
    const normalizedRequest = normalizeTargetIdentity(cloneJson(request || {}));
    if (!normalizedRequest) {
      return PROOF_STATUS.SELF_DECLARED;
    }

    const normalizedGame = normalizeGameId(normalizedRequest.game, GAME_IDS.OVERWATCH);
    if (normalizedRequest.targetType === 'team') {
      const team = teams.find((entry) => slugifyStableId(entry.slug) === normalizedRequest.targetId);
      return team && team.verified ? team.verified : PROOF_STATUS.SELF_DECLARED;
    }

    const player = players.find((entry) => slugifyStableId(entry.handle) === normalizedRequest.targetId);
    if (!player || !Array.isArray(player.games) || !player.games.length) {
      return PROOF_STATUS.SELF_DECLARED;
    }

    const gameEntry = player.games.find((entry) => entry.game === normalizedGame) || player.games[0];
    return gameEntry && gameEntry.proof ? gameEntry.proof : PROOF_STATUS.SELF_DECLARED;
  }

  function renderRequestsPage(highlightRequestId) {
    const list = document.getElementById('requestsList');
    const empty = document.getElementById('requestsEmpty');
    if (!list || !empty) {
      return;
    }

    const entitiesState = loadEntitiesState();
    const requests = entitiesState.requests
      .slice()
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    if (!requests.length) {
      list.innerHTML = '';
      empty.classList.remove('hidden');
      return;
    }

    empty.classList.add('hidden');
    list.innerHTML = requests.map((request) => {
      const statusMeta = getRequestStatusMeta(request);
      const tryoutMeta = getRequestTryoutMeta(request);
      const ratingMeta = getRequestRatingMeta(request, entitiesState);
      const tryout = normalizeTryoutState(request);
      const selfRating = getRatingBySide(entitiesState, request.id, 'self');
      const counterpartRating = getRatingBySide(entitiesState, request.id, 'counterpart');
      const proofBadge = renderProofBadge(resolveRequestProofStatus(request), { compact: true });

      const canCancel = state.isAuthenticated && request.status === 'PENDING';
      const canConfirmCompleted = state.isAuthenticated && request.status !== 'CANCELLED' && !tryout.selfConfirmedAt;
      const canRate = state.isAuthenticated
        && request.status === 'COMPLETED'
        && !!tryout.verifiedAt
        && ratingMeta.canOpen
        && !selfRating;
      const canDemoCounterpartComplete = state.isAuthenticated
        && state.uiDemoMode
        && request.status !== 'CANCELLED'
        && !tryout.counterpartConfirmedAt;
      const canDemoCounterpartRate = state.isAuthenticated
        && state.uiDemoMode
        && request.status === 'COMPLETED'
        && !!tryout.verifiedAt
        && !counterpartRating;

      const openThreadButton = request.threadId
        ? `<button type="button" class="button ghost small" data-action="open-request-thread" data-thread-id="${request.threadId}">${t('d.requests.openThread')}</button>`
        : '';
      const cancelButton = canCancel
        ? `<button type="button" class="button ghost small" data-action="cancel-request" data-request-id="${request.id}">${t('d.requests.cancel')}</button>`
        : '';
      const confirmCompletedButton = canConfirmCompleted
        ? `<button type="button" class="button ghost small" data-action="confirm-completed" data-request-id="${request.id}">${t('d.requests.confirmCompleted')}</button>`
        : '';
      const rateButton = canRate
        ? `<button type="button" class="button ghost small" data-action="open-rating" data-request-id="${request.id}" data-author-side="self">${t('d.requests.rate')}</button>`
        : '';
      const demoCounterpartCompleteButton = canDemoCounterpartComplete
        ? `<button type="button" class="button ghost small" data-action="demo-counterpart-complete" data-request-id="${request.id}">${t('d.requests.demo.counterpartComplete')}</button>`
        : '';
      const demoCounterpartRateButton = canDemoCounterpartRate
        ? `<button type="button" class="button ghost small" data-action="demo-counterpart-rate" data-request-id="${request.id}" data-author-side="counterpart">${t('d.requests.demo.counterpartRate')}</button>`
        : '';

      return [
        `<li class="list-row" data-request-id="${request.id}">`,
        `<strong>${request.targetLabel} · ${getGameLabel(request.game)}</strong>`,
        `<span>${request.role} · ${request.slot}</span>`,
        `<span class="status-chip ${statusMeta.cls}">${t(statusMeta.key)}</span>`,
        `<span class="micro-row micro-row-proof">${t('d.compare.row.proof')}: ${proofBadge}</span>`,
        `<span class="micro-row">${t('d.requests.tryout.label')}: <span class="status-chip ${tryoutMeta.cls}">${t(tryoutMeta.key)}</span></span>`,
        `<span class="micro-row">${t('d.requests.rating.label')}: <span class="status-chip ${ratingMeta.cls}">${ratingMeta.text}</span></span>`,
        '<div class="list-row-actions">',
        confirmCompletedButton,
        rateButton,
        openThreadButton,
        cancelButton,
        demoCounterpartCompleteButton,
        demoCounterpartRateButton,
        '</div>',
        '</li>'
      ].join('');
    }).join('');

    if (highlightRequestId) {
      const node = list.querySelector(`[data-request-id="${highlightRequestId}"]`);
      setEntityHighlight(node);
    }
  }

  function openRatingModal(requestId, authorSide) {
    const modal = document.getElementById('ratingModal');
    const form = document.getElementById('ratingForm');
    if (!modal || !form) {
      return;
    }

    const normalizedSide = authorSide === 'counterpart' ? 'counterpart' : 'self';
    state.activeRatingRequestId = requestId;
    state.activeRatingAuthorSide = normalizedSide;

    const entitiesState = loadEntitiesState();
    const existing = getRatingBySide(entitiesState, requestId, normalizedSide);
    const starsValue = existing ? String(existing.stars) : '';
    const reasonValue = existing && existing.reasonCode ? existing.reasonCode : '';

    form.reset();
    const starsInputs = form.querySelectorAll('input[name="stars"]');
    starsInputs.forEach((input) => {
      input.checked = input.value === starsValue;
    });
    const reason = document.getElementById('ratingReason');
    if (reason) {
      reason.value = reasonValue;
    }

    const reasonWrap = document.getElementById('ratingReasonWrap');
    const requiresReason = Number(starsValue) > 0 && Number(starsValue) <= 2;
    if (reasonWrap) {
      reasonWrap.classList.toggle('hidden', !requiresReason);
    }
    if (reason) {
      reason.required = requiresReason;
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    track('open_rating_modal', { requestId, authorSide: normalizedSide });
  }

  function closeRatingModal() {
    const modal = document.getElementById('ratingModal');
    if (!modal) {
      return;
    }
    modal.classList.add('hidden');
    document.body.style.overflow = '';
    state.activeRatingRequestId = '';
    state.activeRatingAuthorSide = 'self';
  }

  function initRatingModal() {
    const modal = document.getElementById('ratingModal');
    const form = document.getElementById('ratingForm');
    if (!modal || !form) {
      return;
    }

    document.querySelectorAll('[data-close-rating]').forEach((button) => {
      button.addEventListener('click', closeRatingModal);
    });

    const starsInputs = form.querySelectorAll('input[name="stars"]');
    const reason = document.getElementById('ratingReason');
    const reasonWrap = document.getElementById('ratingReasonWrap');

    const syncReasonState = () => {
      const selected = form.querySelector('input[name="stars"]:checked');
      const stars = Number(selected ? selected.value : 0);
      const requiresReason = stars > 0 && stars <= 2;
      if (reasonWrap) {
        reasonWrap.classList.toggle('hidden', !requiresReason);
      }
      if (reason) {
        reason.required = requiresReason;
      }
    };

    starsInputs.forEach((input) => {
      input.addEventListener('change', syncReasonState);
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!requireAuthForAction('requests.open', 'submit_rating')) {
        return;
      }

      const requestId = state.activeRatingRequestId;
      const authorSide = state.activeRatingAuthorSide === 'counterpart' ? 'counterpart' : 'self';
      if (!requestId) {
        return;
      }

      if (authorSide === 'counterpart' && !state.uiDemoMode) {
        showToast('d.toast.error.generic', 'error');
        return;
      }

      syncReasonState();
      if (!form.reportValidity()) {
        return;
      }

      const selectedStars = form.querySelector('input[name="stars"]:checked');
      const stars = Number(selectedStars ? selectedStars.value : 0);
      const reasonCode = reason && reason.value ? reason.value : null;
      if (stars <= 2 && !reasonCode) {
        return;
      }

      const submitButton = form.querySelector('button[type="submit"]');
      setButtonLoading(submitButton, true, t('d.invite.submitting'));
      persistUiSubmitMeta('conductRating', { status: 'pending', requestId, authorSide });

      try {
        await callMockApi('submit_conduct_rating', { requestId, stars, reasonCode, authorSide });
        const nowIso = new Date().toISOString();
        let txResult = null;

        updateEntitiesState((draft) => {
          const request = draft.requests.find((entry) => entry.id === requestId);
          if (!request || request.status === 'CANCELLED') {
            return draft;
          }
          request.tryout = normalizeTryoutState(request);
          if (request.status !== 'COMPLETED' || !request.tryout.verifiedAt) {
            return draft;
          }

          normalizeTargetIdentity(request);
          const subject = getRequestSubject(request);

          let rating = draft.ratings.find((entry) => entry.requestId === requestId && entry.authorSide === authorSide);
          if (!rating) {
            rating = {
              id: makeUnifiedId('rat'),
              requestId,
              threadId: request.threadId || '',
              authorSide,
              subjectType: subject.subjectType,
              subjectId: subject.subjectId,
              stars,
              reasonCode: stars <= 2 ? reasonCode : null,
              submittedAt: nowIso,
              revealedAt: null,
              countedAt: null,
              publicEligible: false
            };
            draft.ratings.push(rating);
          } else {
            rating.threadId = request.threadId || rating.threadId;
            rating.subjectType = subject.subjectType;
            rating.subjectId = subject.subjectId;
            rating.stars = stars;
            rating.reasonCode = stars <= 2 ? reasonCode : null;
            rating.submittedAt = nowIso;
            rating.publicEligible = false;
            rating.countedAt = null;
            rating.revealedAt = null;
          }

          applyRatingTimeoutsInDraft(draft, nowIso);
          recomputeReputationInDraft(draft, nowIso);

          const selfRating = getRatingBySide(draft, requestId, 'self');
          const counterpartRating = getRatingBySide(draft, requestId, 'counterpart');
          txResult = {
            requestId,
            authorSide,
            revealed: !!(selfRating && counterpartRating),
            counted: !!((selfRating && isRatingCounted(selfRating)) && (counterpartRating && isRatingCounted(counterpartRating)))
          };
          return draft;
        });

        track('submit_conduct_rating', { requestId, authorSide, stars, reasonCode: reasonCode || '' });
        if (txResult && txResult.revealed) {
          track('conduct_rating_revealed', { requestId });
        }
        track('conduct_score_recomputed', { requestId });
        persistUiSubmitMeta('conductRating', { status: 'success', ...(txResult || { requestId, authorSide }) });
        showToast('d.requests.rating.saved', 'success');
        closeRatingModal();
        renderRequestsPage(getHashParam('request'));
        renderResults();
        renderCompareDrawer();
        applyProfileStateToDOM();
      } catch (_err) {
        persistUiSubmitMeta('conductRating', { status: 'error', requestId, authorSide });
        showToast('d.toast.error.generic', 'error');
      } finally {
        setButtonLoading(submitButton, false);
      }
    });
  }

  function initRequestsPage() {
    const list = document.getElementById('requestsList');
    if (!list) {
      return;
    }

    const render = () => renderRequestsPage(getHashParam('request'));
    render();

    list.addEventListener('click', async (event) => {
      const cancelButton = event.target.closest('[data-action="cancel-request"]');
      if (cancelButton) {
        const requestId = cancelButton.dataset.requestId;
        if (!requestId) {
          return;
        }
        if (!requireAuthForAction('requests.open', 'cancel_request')) {
          return;
        }

        setButtonLoading(cancelButton, true, t('d.invite.submitting'));
        persistUiSubmitMeta('requestCancel', { status: 'pending', requestId });

        try {
          await callMockApi('request_cancel', { requestId });
          const nowIso = new Date().toISOString();
          let txResult = null;

          updateEntitiesState((entitiesState) => {
            const request = entitiesState.requests.find((entry) => entry.id === requestId);
            if (!request || request.status === 'CANCELLED') {
              return entitiesState;
            }

            request.status = 'CANCELLED';
            request.updatedAt = nowIso;

            const thread = entitiesState.threads.find((entry) => entry.id === request.threadId);
            if (thread) {
              const systemText = `${t('d.system.requestCancelled')} ${request.targetLabel}.`;
              thread.messages.push(createEntityMessage('SYSTEM', 'system', systemText, nowIso));
              thread.lastMessageAt = nowIso;
              thread.updatedAt = nowIso;
            }

            const notification = createNotificationWithDedupe(entitiesState.notifications, {
              type: 'REQUEST_CANCELLED',
              title: t('d.notifications.title.requestCancelled'),
              body: `${request.targetLabel} · ${getGameLabel(request.game)}`,
              requestId: request.id,
              threadId: request.threadId,
              deepLink: getRequestDeepLink(request.id)
            }, nowIso);

            applyRatingTimeoutsInDraft(entitiesState, nowIso);
            recomputeReputationInDraft(entitiesState, nowIso);

            txResult = {
              requestId: request.id,
              threadId: request.threadId,
              notificationId: notification.id
            };
            return entitiesState;
          });

          persistUiSubmitMeta('requestCancel', {
            status: 'success',
            ...(txResult || { requestId })
          });
          showToast('d.toast.requestCancelled', 'success');
          render();
        } catch (_err) {
          persistUiSubmitMeta('requestCancel', { status: 'error', requestId });
          showToast('d.toast.error.generic', 'error');
        } finally {
          setButtonLoading(cancelButton, false);
        }
        return;
      }

      const confirmCompletedButton = event.target.closest('[data-action="confirm-completed"]');
      if (confirmCompletedButton) {
        const requestId = confirmCompletedButton.dataset.requestId;
        if (!requestId) {
          return;
        }
        if (!requireAuthForAction('requests.open', 'confirm_completed')) {
          return;
        }

        setButtonLoading(confirmCompletedButton, true, t('d.requests.processing'));
        persistUiSubmitMeta('requestCompletion', { status: 'pending', requestId, side: 'self' });

        try {
          await callMockApi('request_confirm_completion', { requestId, side: 'self' });
          const nowIso = new Date().toISOString();
          let txResult = null;

          updateEntitiesState((draft) => {
            const request = draft.requests.find((entry) => entry.id === requestId);
            if (!request || request.status === 'CANCELLED') {
              return draft;
            }

            request.tryout = normalizeTryoutState(request);
            if (!request.tryout.selfConfirmedAt) {
              request.tryout.selfConfirmedAt = nowIso;
            }
            if (request.tryout.selfConfirmedAt && request.tryout.counterpartConfirmedAt) {
              request.status = 'COMPLETED';
              request.tryout.verifiedAt = request.tryout.verifiedAt || nowIso;
              request.tryout.ratingWindowOpenedAt = request.tryout.ratingWindowOpenedAt || request.tryout.verifiedAt;
              request.tryout.ratingWindowExpiresAt = request.tryout.ratingWindowExpiresAt
                || addHoursIso(request.tryout.ratingWindowOpenedAt, CONDUCT_RATING_WINDOW_HOURS);
            }
            request.updatedAt = nowIso;

            const thread = draft.threads.find((entry) => entry.id === request.threadId);
            if (thread) {
              thread.messages.push(createEntityMessage('SYSTEM', 'system', t('d.requests.system.selfCompleted'), nowIso));
              thread.lastMessageAt = nowIso;
              thread.updatedAt = nowIso;
            }

            applyRatingTimeoutsInDraft(draft, nowIso);
            recomputeReputationInDraft(draft, nowIso);

            txResult = {
              requestId,
              verified: request.status === 'COMPLETED' && !!request.tryout.verifiedAt
            };
            return draft;
          });

          track('request_confirm_completion', { requestId, side: 'self' });
          if (txResult && txResult.verified) {
            track('request_verify_tryout', { requestId });
          }
          track('conduct_score_recomputed', { requestId });
          persistUiSubmitMeta('requestCompletion', { status: 'success', ...(txResult || { requestId }) });
          showToast('d.requests.completion.saved', 'success');
          render();
        } catch (_err) {
          persistUiSubmitMeta('requestCompletion', { status: 'error', requestId, side: 'self' });
          showToast('d.toast.error.generic', 'error');
        } finally {
          setButtonLoading(confirmCompletedButton, false);
        }
        return;
      }

      const demoCounterpartCompleteButton = event.target.closest('[data-action="demo-counterpart-complete"]');
      if (demoCounterpartCompleteButton) {
        const requestId = demoCounterpartCompleteButton.dataset.requestId;
        if (!requestId) {
          return;
        }
        if (!requireAuthForAction('requests.open', 'demo_counterpart_complete')) {
          return;
        }
        if (!state.uiDemoMode) {
          return;
        }

        setButtonLoading(demoCounterpartCompleteButton, true, t('d.requests.processing'));
        persistUiSubmitMeta('requestCompletion', { status: 'pending', requestId, side: 'counterpart' });

        try {
          await callMockApi('request_confirm_completion', { requestId, side: 'counterpart' });
          const nowIso = new Date().toISOString();
          let txResult = null;

          updateEntitiesState((draft) => {
            const request = draft.requests.find((entry) => entry.id === requestId);
            if (!request || request.status === 'CANCELLED') {
              return draft;
            }

            request.tryout = normalizeTryoutState(request);
            if (!request.tryout.counterpartConfirmedAt) {
              request.tryout.counterpartConfirmedAt = nowIso;
            }
            if (request.tryout.selfConfirmedAt && request.tryout.counterpartConfirmedAt) {
              request.status = 'COMPLETED';
              request.tryout.verifiedAt = request.tryout.verifiedAt || nowIso;
              request.tryout.ratingWindowOpenedAt = request.tryout.ratingWindowOpenedAt || request.tryout.verifiedAt;
              request.tryout.ratingWindowExpiresAt = request.tryout.ratingWindowExpiresAt
                || addHoursIso(request.tryout.ratingWindowOpenedAt, CONDUCT_RATING_WINDOW_HOURS);
            }
            request.updatedAt = nowIso;

            const thread = draft.threads.find((entry) => entry.id === request.threadId);
            if (thread) {
              thread.messages.push(createEntityMessage('SYSTEM', 'system', t('d.requests.system.counterpartCompleted'), nowIso));
              thread.lastMessageAt = nowIso;
              thread.updatedAt = nowIso;
            }

            applyRatingTimeoutsInDraft(draft, nowIso);
            recomputeReputationInDraft(draft, nowIso);
            txResult = {
              requestId,
              verified: request.status === 'COMPLETED' && !!request.tryout.verifiedAt
            };
            return draft;
          });

          track('request_confirm_completion', { requestId, side: 'counterpart' });
          if (txResult && txResult.verified) {
            track('request_verify_tryout', { requestId });
          }
          track('conduct_score_recomputed', { requestId });
          persistUiSubmitMeta('requestCompletion', { status: 'success', ...(txResult || { requestId }) });
          showToast('d.requests.completion.saved', 'success');
          render();
        } catch (_err) {
          persistUiSubmitMeta('requestCompletion', { status: 'error', requestId, side: 'counterpart' });
          showToast('d.toast.error.generic', 'error');
        } finally {
          setButtonLoading(demoCounterpartCompleteButton, false);
        }
        return;
      }

      const openRatingButton = event.target.closest('[data-action="open-rating"]');
      if (openRatingButton) {
        const requestId = openRatingButton.dataset.requestId;
        const authorSide = openRatingButton.dataset.authorSide || 'self';
        if (!requestId) {
          return;
        }
        if (!requireAuthForAction('requests.open', 'open_rating')) {
          return;
        }
        openRatingModal(requestId, authorSide);
        return;
      }

      const demoCounterpartRateButton = event.target.closest('[data-action="demo-counterpart-rate"]');
      if (demoCounterpartRateButton) {
        const requestId = demoCounterpartRateButton.dataset.requestId;
        if (!requestId || !state.uiDemoMode) {
          return;
        }
        if (!requireAuthForAction('requests.open', 'demo_counterpart_rate')) {
          return;
        }
        openRatingModal(requestId, 'counterpart');
        return;
      }

      const openThreadButton = event.target.closest('[data-action="open-request-thread"]');
      if (openThreadButton) {
        const threadId = openThreadButton.dataset.threadId;
        if (!threadId) {
          return;
        }
        window.location.href = getThreadDeepLink(threadId);
      }
    });

    window.addEventListener('hashchange', () => {
      render();
    });
  }

  function renderMessagesPage() {
    const threadsList = document.getElementById('threadsList');
    const threadsEmpty = document.getElementById('threadsEmpty');
    const messageList = document.getElementById('messageList');
    const messagesEmpty = document.getElementById('messagesEmpty');
    const recipient = document.getElementById('messageRecipient');
    const sendButton = document.getElementById('messageSendBtn');
    if (!threadsList || !threadsEmpty || !messageList || !messagesEmpty) {
      return;
    }

    const entitiesState = loadEntitiesState();
    const threads = entitiesState.threads
      .slice()
      .sort((a, b) => new Date(b.lastMessageAt || b.updatedAt || 0).getTime() - new Date(a.lastMessageAt || a.updatedAt || 0).getTime());

    const hashThreadId = getHashParam('thread');
    if (hashThreadId && threads.some((thread) => thread.id === hashThreadId)) {
      state.activeThreadId = hashThreadId;
      saveUnifiedState('ui.messaging.activeThreadId', hashThreadId);
    } else if (!state.activeThreadId) {
      const persisted = loadUnifiedState('ui.messaging.activeThreadId', '', () => '');
      if (persisted && threads.some((thread) => thread.id === persisted)) {
        state.activeThreadId = persisted;
      } else {
        state.activeThreadId = threads.length ? threads[0].id : '';
      }
    }

    if (!threads.length) {
      threadsList.innerHTML = '';
      messageList.innerHTML = '';
      threadsEmpty.classList.remove('hidden');
      messagesEmpty.classList.remove('hidden');
      if (recipient) {
        recipient.value = '-';
      }
      if (sendButton) {
        sendButton.disabled = true;
      }
      return;
    }

    threadsEmpty.classList.add('hidden');
    if (sendButton) {
      sendButton.disabled = false;
    }

    threadsList.innerHTML = threads.map((thread) => {
      const unreadCount = entitiesState.notifications.filter((notification) => !notification.read && notification.threadId === thread.id).length;
      const isActive = thread.id === state.activeThreadId;
      return [
        `<li class="list-row thread-item ${isActive ? 'active' : ''}" data-thread-id="${thread.id}">`,
        `<strong>${thread.title}</strong>`,
        `<span>${thread.messages.length} ${t('d.messages.meta.count')} · ${unreadCount} ${t('d.messages.meta.unread')}</span>`,
        '</li>'
      ].join('');
    }).join('');

    const activeThread = threads.find((thread) => thread.id === state.activeThreadId) || threads[0];
    if (!activeThread) {
      messageList.innerHTML = '';
      messagesEmpty.classList.remove('hidden');
      if (recipient) {
        recipient.value = '-';
      }
      return;
    }

    if (activeThread.id !== state.activeThreadId) {
      state.activeThreadId = activeThread.id;
      saveUnifiedState('ui.messaging.activeThreadId', activeThread.id);
    }

    if (recipient) {
      recipient.value = activeThread.title;
    }

    const actor = resolveActorIdentity();
    messageList.innerHTML = (activeThread.messages || []).map((message) => {
      const isSelf = message.kind === 'USER' && sanitizeThreadToken(message.sender) === sanitizeThreadToken(actor.handle);
      const bubbleClass = isSelf ? 'bubble self' : 'bubble';
      return `<p class="${bubbleClass}">${message.text}</p>`;
    }).join('');

    messagesEmpty.classList.toggle('hidden', (activeThread.messages || []).length > 0);

    if (hashThreadId && hashThreadId === activeThread.id) {
      const activeNode = threadsList.querySelector(`[data-thread-id="${hashThreadId}"]`);
      setEntityHighlight(activeNode);
    }
  }

  function initMessagesPage() {
    const threadsList = document.getElementById('threadsList');
    const form = document.getElementById('messageSendForm');
    const input = document.getElementById('messageInput');
    if (!threadsList || !form || !input) {
      return;
    }

    const render = () => renderMessagesPage();
    render();

    threadsList.addEventListener('click', (event) => {
      const item = event.target.closest('[data-thread-id]');
      if (!item) {
        return;
      }
      state.activeThreadId = item.dataset.threadId || '';
      saveUnifiedState('ui.messaging.activeThreadId', state.activeThreadId);
      render();
    });

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) {
        return;
      }
      if (!state.activeThreadId) {
        return;
      }
      if (!requireAuthForAction('messages.compose', 'send')) {
        return;
      }

      const submit = document.getElementById('messageSendBtn') || form.querySelector('button[type="submit"]');
      const text = input.value.trim();
      if (!text) {
        return;
      }

      setButtonLoading(submit, true, t('d.messages.sending'));
      persistUiSubmitMeta('messageSend', { status: 'pending', threadId: state.activeThreadId });

      try {
        await callMockApi('message_send', { threadId: state.activeThreadId, text });
        const actor = resolveActorIdentity();
        const nowIso = new Date().toISOString();
        let txResult = null;

        updateEntitiesState((entitiesState) => {
          const thread = entitiesState.threads.find((entry) => entry.id === state.activeThreadId);
          if (!thread) {
            return entitiesState;
          }

          thread.messages.push(createEntityMessage('USER', actor.handle, text, nowIso));
          thread.lastMessageAt = nowIso;
          thread.updatedAt = nowIso;

          const notification = createNotificationWithDedupe(entitiesState.notifications, {
            type: 'MESSAGE_POSTED',
            title: t('d.notifications.title.messagePosted'),
            body: `${thread.title}`,
            requestId: '',
            threadId: thread.id,
            deepLink: getThreadDeepLink(thread.id)
          }, nowIso);

          txResult = {
            threadId: thread.id,
            notificationId: notification.id
          };
          return entitiesState;
        });

        saveUnifiedState('ui.messaging.activeThreadId', state.activeThreadId);
        persistUiSubmitMeta('messageSend', {
          status: 'success',
          ...(txResult || { threadId: state.activeThreadId })
        });
        input.value = '';
        showToast('d.toast.messageSent', 'success');
        render();
      } catch (_err) {
        persistUiSubmitMeta('messageSend', { status: 'error', threadId: state.activeThreadId });
        showToast('d.toast.error.generic', 'error');
      } finally {
        setButtonLoading(submit, false);
      }
    });

    window.addEventListener('hashchange', render);
  }

  function renderNotificationsPage() {
    const unreadList = document.getElementById('notificationsUnreadList');
    const readList = document.getElementById('notificationsReadList');
    const unreadEmpty = document.getElementById('notificationsUnreadEmpty');
    const readEmpty = document.getElementById('notificationsReadEmpty');
    if (!unreadList || !readList || !unreadEmpty || !readEmpty) {
      return;
    }

    const entitiesState = loadEntitiesState();
    const notifications = entitiesState.notifications
      .slice()
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    const unread = notifications.filter((entry) => !entry.read);
    const read = notifications.filter((entry) => entry.read);

    const renderItem = (notification, isUnread) => [
      `<li class="list-row notification-item ${isUnread ? 'unread' : 'read'}" data-notification-id="${notification.id}">`,
      `<strong>${notification.title}</strong>`,
      `<span>${notification.body}</span>`,
      '<div class="list-row-actions">',
      `<button type="button" class="button ghost small" data-action="open-notification" data-notification-id="${notification.id}">${t('d.notifications.open')}</button>`,
      `<button type="button" class="button ghost small" data-action="toggle-notification-read" data-notification-id="${notification.id}">${isUnread ? t('d.notifications.markRead') : t('d.notifications.markUnread')}</button>`,
      '</div>',
      '</li>'
    ].join('');

    unreadList.innerHTML = unread.map((entry) => renderItem(entry, true)).join('');
    readList.innerHTML = read.map((entry) => renderItem(entry, false)).join('');
    unreadEmpty.classList.toggle('hidden', unread.length > 0);
    readEmpty.classList.toggle('hidden', read.length > 0);
  }

  function initNotificationsPage() {
    const unreadList = document.getElementById('notificationsUnreadList');
    const readList = document.getElementById('notificationsReadList');
    if (!unreadList || !readList) {
      return;
    }

    const render = () => renderNotificationsPage();
    render();

    const listHandler = (event) => {
      const openButton = event.target.closest('[data-action="open-notification"]');
      if (openButton) {
        const notificationId = openButton.dataset.notificationId;
        if (!notificationId) {
          return;
        }
        const entitiesState = loadEntitiesState();
        const found = entitiesState.notifications.find((entry) => entry.id === notificationId);
        if (!found) {
          return;
        }
        updateEntitiesState((draft) => {
          const current = draft.notifications.find((entry) => entry.id === notificationId);
          if (current) {
            current.read = true;
            current.updatedAt = new Date().toISOString();
          }
          return draft;
        });
        render();
        if (found.deepLink) {
          window.location.href = found.deepLink;
        }
        return;
      }

      const toggleButton = event.target.closest('[data-action="toggle-notification-read"]');
      if (toggleButton) {
        const notificationId = toggleButton.dataset.notificationId;
        if (!notificationId) {
          return;
        }
        updateEntitiesState((draft) => {
          const current = draft.notifications.find((entry) => entry.id === notificationId);
          if (current) {
            current.read = !current.read;
            current.updatedAt = new Date().toISOString();
          }
          return draft;
        });
        render();
      }
    };

    unreadList.addEventListener('click', listHandler);
    readList.addEventListener('click', listHandler);

    const markAllReadButton = document.getElementById('markAllReadBtn');
    if (markAllReadButton) {
      markAllReadButton.addEventListener('click', async () => {
        if (!requireAuthForAction('notifications.updates', 'mark_all_read')) {
          return;
        }

        setButtonLoading(markAllReadButton, true, t('d.notifications.marking'));
        persistUiSubmitMeta('markAllRead', { status: 'pending' });

        try {
          await callMockApi('notifications_mark_all_read', {});
          const nowIso = new Date().toISOString();
          updateEntitiesState((draft) => {
            draft.notifications.forEach((entry) => {
              if (!entry.read) {
                entry.read = true;
                entry.updatedAt = nowIso;
              }
            });
            return draft;
          });
          persistUiSubmitMeta('markAllRead', { status: 'success' });
          showToast('d.toast.notificationsMarkedRead', 'success');
          render();
        } catch (_err) {
          persistUiSubmitMeta('markAllRead', { status: 'error' });
          showToast('d.toast.error.generic', 'error');
        } finally {
          setButtonLoading(markAllReadButton, false);
        }
      });
    }
  }

  function applyFiltersTracking() {
    track('apply_filter', {
      game: state.game,
      role: state.role,
      rankRange: state.rank,
      proof: state.proof
    });
  }

  function syncGameChipActiveState() {
    document.querySelectorAll('#gameChips .chip').forEach((chip) => {
      const gameId = chip.dataset.game || GAME_IDS.ANY;
      chip.classList.toggle('active', gameId === state.game);
    });
  }

  function syncQuickStartControls() {
    document.querySelectorAll('[data-quick-game]').forEach((button) => {
      const gameId = button.dataset.quickGame || '';
      button.classList.toggle('active', gameId === state.game);
    });
    const quickPlayers = document.getElementById('quickStartModePlayers');
    const quickTeams = document.getElementById('quickStartModeTeams');
    if (quickPlayers) {
      quickPlayers.classList.toggle('active', state.mode === 'players');
      quickPlayers.setAttribute('aria-pressed', String(state.mode === 'players'));
    }
    if (quickTeams) {
      quickTeams.classList.toggle('active', state.mode === 'teams');
      quickTeams.setAttribute('aria-pressed', String(state.mode === 'teams'));
    }
  }

  function applyExploreGame(gameId, options) {
    const opts = options && typeof options === 'object' ? options : {};
    state.game = normalizeGameId(gameId, GAME_IDS.ANY);
    syncGameChipActiveState();
    syncQuickStartControls();
    syncExploreRoleFilterOptions();
    syncExploreRankFilterOptions();
    persistExploreFilters();
    if (opts.track !== false) {
      applyFiltersTracking();
    }
    renderResults();
    renderCompareDrawer();
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

    updateExploreModeSemantics();
    syncQuickStartControls();
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

  function findPlayerByHandle(handle) {
    const normalized = String(handle || '').trim().toLowerCase();
    if (!normalized) {
      return null;
    }
    return players.find((entry) => String(entry.handle || '').trim().toLowerCase() === normalized) || null;
  }

  function resolveInviteTargetContext(context) {
    const safeContext = context && typeof context === 'object' ? context : {};
    const contextGame = isCanonicalProfileGame(safeContext.game) ? normalizeGameId(safeContext.game, '') : '';

    if (safeContext.type === 'player') {
      const player = findPlayerByHandle(safeContext.handle);
      const game = contextGame || (player ? getPrimaryGame(player).game : '');
      return {
        type: 'player',
        handle: player ? player.handle : String(safeContext.handle || '').trim(),
        name: player ? player.handle : String(safeContext.handle || '').trim(),
        game,
        availability: normalizeAvailability(player && player.availability ? player.availability : 'Any'),
        availabilityDetail: player && player.availabilityDetail ? String(player.availabilityDetail).trim() : '',
        mixed: false
      };
    }

    if (safeContext.type === 'team') {
      const teamSlug = String(safeContext.team || safeContext.teamSlug || '').trim();
      const team = teams.find((entry) => entry.slug === teamSlug) || null;
      const game = contextGame
        || (team && Array.isArray(team.games) && team.games[0] ? normalizeGameId(team.games[0].game, '') : '');
      return {
        type: 'team',
        name: team ? team.name : teamSlug || 'Team',
        game,
        availability: normalizeAvailability(team ? getCoarseTeamAvailability(team) : 'Any'),
        availabilityDetail: team && team.availabilityDetail ? String(team.availabilityDetail).trim() : '',
        mixed: false
      };
    }

    if (safeContext.type === 'multi') {
      const compareHandles = Array.isArray(safeContext.compareHandles)
        ? safeContext.compareHandles.map((value) => String(value || '').trim()).filter(Boolean)
        : [];
      const comparePlayers = compareHandles
        .map((handle) => findPlayerByHandle(handle))
        .filter(Boolean);
      const game = contextGame || (comparePlayers[0] ? getPrimaryGame(comparePlayers[0]).game : '');

      if (comparePlayers.length === 1) {
        return {
          type: 'compare',
          handle: comparePlayers[0].handle,
          name: comparePlayers[0].handle,
          game,
          availability: normalizeAvailability(comparePlayers[0].availability),
          availabilityDetail: comparePlayers[0].availabilityDetail ? String(comparePlayers[0].availabilityDetail).trim() : '',
          mixed: false
        };
      }

      if (comparePlayers.length > 1) {
        const normalizedAvailabilities = comparePlayers.map((player) => normalizeAvailability(player.availability));
        const uniqueAvailabilities = Array.from(new Set(normalizedAvailabilities));
        const mixed = uniqueAvailabilities.length > 1;
        const details = Array.from(new Set(comparePlayers
          .map((player) => String(player.availabilityDetail || '').trim())
          .filter(Boolean)));

        return {
          type: 'compare',
          name: comparePlayers.map((player) => player.handle).join(', '),
          game,
          availability: mixed ? 'Any' : (uniqueAvailabilities[0] || 'Any'),
          availabilityDetail: mixed ? '' : (details.length === 1 ? details[0] : ''),
          mixed
        };
      }
    }

    return {
      type: 'unknown',
      name: '',
      game: contextGame,
      availability: 'Any',
      availabilityDetail: '',
      mixed: false
    };
  }

  function getInviteSlotPresets(availability) {
    const normalized = normalizeAvailability(availability);
    const presetGroup = normalized === 'Weeknights'
      ? 'weeknights'
      : normalized === 'Weekend'
        ? 'weekend'
        : 'any';
    return [1, 2, 3].map((index) => {
      const key = `d.invite.slotPreset.${presetGroup}.${index}`;
      const label = t(key);
      return { key, label, value: label };
    });
  }

  function applyInviteSlotSuggestions(context) {
    const slotSelect = document.getElementById('inviteSlot');
    const slotHint = document.getElementById('inviteSlotHint');
    if (!slotSelect) {
      return;
    }

    const targetContext = state.inviteTargetContext
      || resolveInviteTargetContext(context || state.selectedInviteContext || {});
    state.inviteTargetContext = targetContext;

    const previousValue = slotSelect.value;
    const presets = getInviteSlotPresets(targetContext.availability);

    slotSelect.innerHTML = '';
    presets.forEach((preset) => {
      const option = document.createElement('option');
      option.value = preset.value;
      option.textContent = preset.label;
      slotSelect.append(option);
    });
    const fallbackValue = presets[0] ? presets[0].value : '';
    const matched = presets.some((preset) => preset.value === previousValue);
    slotSelect.value = matched ? previousValue : fallbackValue;
    if (typeof slotSelect._uspecRebuildMenu === 'function') {
      slotSelect._uspecRebuildMenu();
    }

    if (!slotHint) {
      return;
    }

    let hintText = t('d.invite.slotHintUnknown');
    if (targetContext.mixed) {
      hintText = t('d.invite.slotHintMixed');
    } else if (targetContext.name && targetContext.availabilityDetail) {
      hintText = formatTemplate(t('d.invite.slotSource'), {
        name: targetContext.name,
        detail: targetContext.availabilityDetail
      });
    } else if (targetContext.name) {
      hintText = formatTemplate(t('d.invite.slotHint'), {
        name: targetContext.name,
        availability: formatAvailability(targetContext.availability)
      });
    }

    slotHint.removeAttribute('data-d18n');
    slotHint.textContent = hintText;
  }

  function openInviteModal(context) {
    const modal = document.getElementById('inviteModal');
    if (!modal) {
      return;
    }

    state.selectedInviteContext = context;
    state.inviteTargetContext = resolveInviteTargetContext(context);
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
    applyInviteSlotSuggestions(context);
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

  function externalTranslate(key, fallback) {
    if (typeof window.uspecmeTranslate === 'function') {
      return window.uspecmeTranslate(key);
    }
    return fallback || key;
  }

  function applyWaitlistPanelCtaState() {
    const buttons = document.querySelectorAll('[data-waitlist-cta]');
    if (!buttons.length) {
      return;
    }
    const waitlistState = loadUnifiedState('waitlist', {}, () => null);
    const joined = waitlistState && typeof waitlistState === 'object' && waitlistState.status === 'JOINED';
    buttons.forEach((button) => {
      if (joined) {
        button.textContent = externalTranslate('wait.panel.ctaJoined', "You're on the waitlist ✓");
        button.dataset.waitlistState = 'joined';
        button.disabled = true;
        return;
      }
      button.textContent = externalTranslate('wait.panel.cta', 'Open Waitlist');
      button.dataset.waitlistState = 'open';
      button.disabled = false;
    });
  }

  function applyWaitlistSuccessCopy() {
    const success = document.getElementById('waitlistSuccess');
    if (!success) {
      return;
    }
    success.dataset.d18n = 'd.waitlist.success.tight';
    success.textContent = t('d.waitlist.success.tight');
  }

  function openWaitlistModal(email) {
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
        submit.textContent = externalTranslate('modal.submit', submit.textContent);
      }
    }

    if (success) {
      success.classList.add('hidden');
    }
    applyWaitlistSuccessCopy();
  }

  function initWaitlistFormOverride() {
    const form = document.getElementById('waitlistForm');
    if (!form || !form.parentNode) {
      return;
    }
    const freshForm = form.cloneNode(true);
    freshForm.dataset.usmWaitlistOverride = '1';
    form.parentNode.replaceChild(freshForm, form);

    freshForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!freshForm.reportValidity()) {
        return;
      }

      const emailInput = freshForm.querySelector('input[name="email"]');
      const roleSelect = freshForm.querySelector('select[name="role"]');
      const gameSelect = freshForm.querySelector('select[name="game"]');
      const submit = freshForm.querySelector('button[type="submit"]');
      const success = document.getElementById('waitlistSuccess');

      const email = emailInput ? emailInput.value.trim() : '';
      const role = roleSelect ? roleSelect.value : '';
      const game = gameSelect ? gameSelect.value : '';
      if (!email.includes('@') || !role || !game) {
        showToast('d.waitlist.validation.error', 'error');
        return;
      }

      setButtonLoading(submit, true, t('d.waitlist.submitting'));
      persistUiSubmitMeta('waitlist', {
        status: 'pending',
        startedAt: new Date().toISOString()
      });

      try {
        const requestId = makeUnifiedId('waitlist');
        const nowIso = new Date().toISOString();
        await callMockApi('waitlist_submit', {
          email,
          role,
          game
        });

        updateUnifiedState('waitlist', () => ({
          status: 'JOINED',
          email,
          role,
          game,
          requestId,
          joinedAt: nowIso
        }), {});

        persistUiSubmitMeta('waitlist', {
          status: 'success',
          requestId,
          completedAt: nowIso
        });

        if (success) {
          success.classList.remove('hidden');
        }
        if (submit) {
          submit.disabled = true;
          submit.dataset.submitted = 'true';
          submit.textContent = externalTranslate('modal.submitted', 'Submitted');
        }
        applyWaitlistPanelCtaState();
        applyWaitlistSuccessCopy();
        showToast('d.waitlist.success.tight', 'success');
        document.dispatchEvent(new CustomEvent('usm:waitlist:success', {
          detail: {
            email,
            role,
            game,
            requestId,
            status: 'JOINED'
          }
        }));
      } catch (_err) {
        if (success) {
          success.classList.add('hidden');
        }
        if (submit) {
          submit.dataset.submitted = 'false';
          submit.textContent = externalTranslate('modal.submit', 'Join Waitlist');
        }
        persistUiSubmitMeta('waitlist', {
          status: 'error',
          completedAt: new Date().toISOString()
        });
        showToast('d.toast.error.generic', 'error');
      } finally {
        if (submit && submit.dataset.submitted === 'true') {
          setButtonLoading(submit, false);
          submit.disabled = true;
        } else {
          setButtonLoading(submit, false);
        }
      }
    });

    applyWaitlistSuccessCopy();
  }

  function openWaitlistAfterAuth(email) {
    openWaitlistModal(email);
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

  function openPlayerProfileView(handle, options) {
    const opts = options && typeof options === 'object' ? options : {};
    const fallbackHandle = String(handle || '').trim();
    const normalizedHandle = fallbackHandle.toLowerCase();
    const playerId = String(opts.playerId || '').trim();
    const normalizedSourceGame = normalizeGameId(opts.sourceGame || '', '');
    const sourceGame = isCanonicalProfileGame(normalizedSourceGame) ? normalizedSourceGame : '';
    const navSource = normalizeNavSource(opts.navSource || '');
    const compareHandles = serializeCompareHandles(
      Array.isArray(opts.compareHandles) ? opts.compareHandles : state.compare
    );
    const shouldScroll = opts.scroll !== false;

    if (!fallbackHandle && !playerId) {
      return;
    }

    const player = players.find((entry) => {
      if (playerId && getPlayerViewId(entry) === slugifyStableId(playerId)) {
        return true;
      }
      return normalizedHandle && String(entry.handle || '').trim().toLowerCase() === normalizedHandle;
    });

    const resolvedHandle = player ? player.handle : fallbackHandle;
    if (!resolvedHandle) {
      return;
    }

    track('view_player_profile', { handle: resolvedHandle });
    state.lastProfileOpenHandle = resolvedHandle;

    if (!isProfilePage()) {
      navigateToProfilePlayer(resolvedHandle, {
        sourceGame,
        navSource,
        compareHandles: compareHandles ? compareHandles.split(',') : []
      });
      return;
    }

    if (!player) {
      state.profileViewMode = 'self';
      state.profileViewPlayerId = '';
      state.profileViewHandle = '';
      state.profileViewSourceGame = '';
      replaceProfileRoute('', {});
      applyProfileStateToDOM();
      return;
    }

    if (navSource) {
      setNavContext(navSource, {
        scrollY: window.scrollY || 0,
        compareScrollTarget: navSource === 'compare'
      });
    }

    state.profileViewMode = 'player';
    state.profileViewPlayerId = getPlayerViewId(player);
    state.profileViewHandle = resolvedHandle;
    state.profileViewSourceGame = sourceGame;
    replaceProfileRoute(resolvedHandle, {
      sourceGame,
      navSource,
      compareHandles: compareHandles ? compareHandles.split(',') : []
    });
    applyProfileStateToDOM();

    if (shouldScroll) {
      const profileSection = document.getElementById('profile');
      if (profileSection) {
        profileSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
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
        const sourceGameFromButton = button.dataset.game || '';
        const sourceGame = isCanonicalProfileGame(state.game) ? state.game : sourceGameFromButton;
        setNavContext('explore', {
          scrollY: window.scrollY || 0,
          compareScrollTarget: false
        });
        openPlayerProfileView(button.dataset.handle || '', {
          playerId: button.dataset.playerId || '',
          sourceGame,
          navSource: 'explore',
          compareHandles: state.compare.slice(),
          scroll: true
        });
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
    updateExploreModeSemantics();

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
        applyExploreGame(chip.dataset.game || GAME_IDS.ANY);
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
        clearCompareSelection();
      });
    }

    const compareNow = document.getElementById('compareNow');
    if (compareNow) {
      compareNow.addEventListener('click', () => {
        if (!state.compare.length) {
          return;
        }
        state.compareExpanded = !state.compareExpanded;
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
        openInviteModal({
          type: 'multi',
          compareHandles: state.compare.slice(),
          game: state.game === GAME_IDS.ANY ? GAME_IDS.OVERWATCH : state.game
        });
      });
    }

    const compareDrawer = document.getElementById('compareDrawer');
    if (compareDrawer) {
      compareDrawer.addEventListener('click', (event) => {
        const openButton = event.target.closest('[data-action="open-player-compare"]');
        if (!openButton) {
          return;
        }
        setNavContext('compare', {
          scrollY: window.scrollY || 0,
          compareScrollTarget: true
        });
        openPlayerProfileView(openButton.dataset.handle || '', {
          playerId: openButton.dataset.playerId || '',
          sourceGame: openButton.dataset.game || state.game,
          navSource: 'compare',
          compareHandles: state.compare.slice(),
          scroll: true
        });
      });
    }

    const compareDockOpen = document.getElementById('compareDockOpen');
    if (compareDockOpen) {
      compareDockOpen.addEventListener('click', () => {
        if (!state.compare.length) {
          return;
        }
        scrollToCompareSection();
      });
    }

    const compareDockClear = document.getElementById('compareDockClear');
    if (compareDockClear) {
      compareDockClear.addEventListener('click', () => {
        clearCompareSelection();
      });
    }

    persistExploreFilters();
    renderResults();
    renderCompareDrawer();
    applyStartReturnContextFromURL();
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
      if (!requireAuthForAction('invite.modal', 'invite_submit')) {
        return;
      }

      const submit = form.querySelector('button[type="submit"]');
      setButtonLoading(submit, true, t('d.invite.submitting'));
      persistUiSubmitMeta('invite', { status: 'pending' });

      const game = normalizeGameId(form.querySelector('#inviteGame').value, GAME_IDS.OVERWATCH);
      const role = form.querySelector('#inviteRole').value;
      const slot = form.querySelector('#inviteSlot').value;
      const notes = form.querySelector('#inviteNotes') ? form.querySelector('#inviteNotes').value : '';
      const success = document.getElementById('inviteSuccess');

      try {
        await callMockApi('invite_submit', { game, role, slot, region: state.region });
        track('submit_invite_request', { game, role, region: state.region });

        const context = state.selectedInviteContext || { type: 'multi', compareHandles: state.compare.slice(), game };
        const actor = resolveActorIdentity();
        const nowIso = new Date().toISOString();
        let txResult = null;

        updateEntitiesState((entitiesState) => {
          const thread = findOrCreateThread(entitiesState, context, game, actor.handle, nowIso);
          const targetIdentity = getTargetIdentityFromContext(context);
          const request = {
            id: makeUnifiedId('req'),
            status: 'PENDING',
            createdAt: nowIso,
            updatedAt: nowIso,
            game,
            role: String(role || '').trim(),
            slot: String(slot || '').trim(),
            notes: String(notes || '').trim(),
            source: {
              type: context.type || 'multi',
              handle: context.handle || '',
              teamSlug: context.team || context.teamSlug || '',
              compareHandles: Array.isArray(context.compareHandles) ? context.compareHandles.slice() : []
            },
            targetLabel: getTargetLabelFromContext(context),
            targetType: targetIdentity.targetType,
            targetId: targetIdentity.targetId,
            threadId: thread.id,
            createdBy: {
              username: actor.username,
              handle: actor.handle
            },
            tryout: {
              selfConfirmedAt: null,
              counterpartConfirmedAt: null,
              verifiedAt: null,
              ratingWindowOpenedAt: null,
              ratingWindowExpiresAt: null,
              ratingRevealState: 'pending'
            }
          };
          entitiesState.requests.push(request);

          if (!Array.isArray(thread.requestIds)) {
            thread.requestIds = [];
          }
          if (!thread.requestIds.includes(request.id)) {
            thread.requestIds.push(request.id);
          }

          const systemText = `${t('d.system.inviteCreated')} ${request.targetLabel} · ${getGameLabel(request.game)} · ${request.role} · ${request.slot}`;
          thread.messages.push(createEntityMessage('SYSTEM', 'system', systemText, nowIso));
          thread.lastMessageAt = nowIso;
          thread.updatedAt = nowIso;

          const notification = createNotificationWithDedupe(entitiesState.notifications, {
            type: 'REQUEST_CREATED',
            title: t('d.notifications.title.requestCreated'),
            body: `${request.targetLabel} · ${getGameLabel(request.game)}`,
            requestId: request.id,
            threadId: thread.id,
            deepLink: getRequestDeepLink(request.id)
          }, nowIso);

          txResult = {
            requestId: request.id,
            threadId: thread.id,
            notificationId: notification.id
          };
          return entitiesState;
        });

        if (success) {
          success.classList.remove('hidden');
        }

        persistUiSubmitMeta('invite', {
          status: 'success',
          ...(txResult || { requestId: makeUnifiedId('invite') })
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
        if (!requireAuthForAction('connect.modal', 'connect_provider')) {
          return;
        }
        setButtonLoading(button, true, t('d.connect.connecting'));
        persistUiSubmitMeta('connect', { status: 'pending', provider });

        try {
          await callMockApi('connect_provider', { provider });
          track('click_connect_provider', { provider });
          track('complete_connect_fake', { provider });

          const nowIso = new Date().toISOString();
          const providerKey = normalizeProviderKey(provider);
          updateUnifiedState(
            'accounts',
            (previous) => {
              const next = previous && typeof previous === 'object' ? { ...previous } : {};
              next[providerKey] = {
                providerLabel: provider,
                status: 'CONNECTED_PENDING',
                updatedAt: nowIso
              };
              return next;
            },
            {}
          );

          const normalizedProfile = normalizeProfileState(state.profile);
          if (normalizedProfile.publicProfile.proofStatus === PROOF_STATUS.SELF_DECLARED) {
            normalizedProfile.publicProfile.proofStatus = PROOF_STATUS.ACCOUNT_CONNECTED;
            state.profile = normalizedProfile;
            persistProfileState();
            applyProfileStateToDOM();
          }

          updateEntitiesState((entitiesState) => {
            createNotificationWithDedupe(entitiesState.notifications, {
              type: 'ACCOUNT_CONNECTED_PENDING',
              title: t('d.notifications.title.accountConnectedPending'),
              body: formatTemplate(t('d.notifications.body.accountConnectedPending'), { provider }),
              requestId: `connect:${providerKey}`,
              threadId: '',
              deepLink: 'profile.html'
            }, nowIso);
            return entitiesState;
          });
          renderResults();

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
      inputs.profileAvailability,
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
    const explorePrimary = document.getElementById('ctaExplorePrimary');
    const earlyAccessSecondary = document.getElementById('ctaEarlyAccessSecondary');
    const player = document.getElementById('ctaPlayer');
    const team = document.getElementById('ctaTeam');
    const scrollToExplore = () => {
      const explore = document.getElementById('explore');
      if (explore) {
        explore.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    if (explorePrimary) {
      explorePrimary.addEventListener('click', () => {
        track('click_cta_player', { source: 'hero_primary' });
        setMode('players');
        scrollToExplore();
      });
    }

    if (earlyAccessSecondary) {
      earlyAccessSecondary.addEventListener('click', () => {
        openWaitlistModal();
      });
    }

    if (player) {
      player.addEventListener('click', () => {
        track('click_cta_player', {});
        setMode('players');
        scrollToExplore();
      });
    }

    if (team) {
      team.addEventListener('click', () => {
        track('click_cta_team', {});
        setMode('teams');
        scrollToExplore();
      });
    }
  }

  function initQuickStart() {
    const quickStart = document.getElementById('quickStart');
    if (!quickStart) {
      return;
    }

    const runButton = document.getElementById('quickStartRun');
    const modePlayers = document.getElementById('quickStartModePlayers');
    const modeTeams = document.getElementById('quickStartModeTeams');
    const scrollToExplore = () => {
      const explore = document.getElementById('explore');
      if (explore) {
        explore.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    document.querySelectorAll('[data-quick-game]').forEach((button) => {
      button.addEventListener('click', () => {
        const gameId = button.dataset.quickGame || GAME_IDS.OVERWATCH;
        applyExploreGame(gameId, { track: false });
      });
    });

    if (modePlayers) {
      modePlayers.addEventListener('click', () => {
        setMode('players');
      });
    }
    if (modeTeams) {
      modeTeams.addEventListener('click', () => {
        setMode('teams');
      });
    }

    if (runButton) {
      runButton.addEventListener('click', () => {
        if (state.game === GAME_IDS.ANY) {
          applyExploreGame(GAME_IDS.OVERWATCH, { track: false });
        }
        applyFiltersTracking();
        renderResults();
        renderCompareDrawer();
        scrollToExplore();
      });
    }

    syncQuickStartControls();
  }

  function initProfileTeaser() {
    const openButton = document.getElementById('openSelfProfileFromStart');
    if (!openButton) {
      return;
    }

    openButton.addEventListener('click', () => {
      track('open_profile_page', { source: isStartPage() ? 'start_teaser' : getCurrentPage() });
      if (!state.isAuthenticated) {
        openAuthModal('login');
        return;
      }
      navigateToProfileSelf();
    });
  }

  function initWaitlistTracking() {
    document.addEventListener('usm:waitlist:success', (event) => {
      const detail = (event && event.detail && typeof event.detail === 'object') ? event.detail : {};
      const role = detail.role || 'unknown';
      const game = detail.game || 'unknown';
      const normalizedGame = normalizeGameId(game, '');
      const gameLabel = normalizedGame ? getGameLabel(normalizedGame) : String(game || 'unknown');
      const roleLabel = String(role || 'unknown');
      const nowIso = new Date().toISOString();
      const requestId = detail.requestId || makeUnifiedId('waitlist');

      track('submit_waitlist', { persona: role, games: game, region: state.region === 'Any' ? 'unknown' : state.region });
      state.metrics.waitlist += 1;
      syncMetrics();
      persistUiSubmitMeta('waitlist', {
        status: 'success',
        requestId
      });
      updateEntitiesState((entitiesState) => {
        createNotificationWithDedupe(entitiesState.notifications, {
          type: 'WAITLIST_JOINED',
          title: t('d.notifications.title.waitlistJoined'),
          body: formatTemplate(t('d.notifications.body.waitlistJoined'), {
            role: roleLabel,
            game: gameLabel
          }),
          requestId,
          threadId: '',
          deepLink: 'index.html#waitlist'
        }, nowIso);
        return entitiesState;
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
      closeRatingModal();
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
    applyWaitlistSuccessCopy();
    applyWaitlistPanelCtaState();
    renderRequestsPage(getHashParam('request'));
    renderMessagesPage();
    renderNotificationsPage();
  }

  document.addEventListener('uspecme:langchange', onLanguageChange);
  window.usmShowToast = showToast;
  window.usmSetButtonLoading = setButtonLoading;

  document.addEventListener('DOMContentLoaded', () => {
    initNavigationState();
    initTheme();
    initHeroCTAs();
    initQuickStart();
    seedEntityStoreIfNeeded();
    syncConductDerivedStateOnLoad();
    applyProfileRouteFromURL();
    initExplore();
    initWaitlistFormOverride();
    initInviteModal();
    initRatingModal();
    initConnectModal();
    initAuthModal();
    initProfileTeaser();
    initNetworkModal();
    initProfileEditor();
    initProfileHeaderActions();
    initRequestsPage();
    initMessagesPage();
    initNotificationsPage();
    initWaitlistTracking();
    initGlobalToasts();
    bindGlobalEsc();

    applyCustomI18n();
    applyWaitlistSuccessCopy();
    applyWaitlistPanelCtaState();
    syncMetrics();
    if (isProfilePage()) {
      const routeEditSection = getProfileRouteEditSectionFromURL();
      if (routeEditSection && state.isAuthenticated) {
        openProfileEditorModal(routeEditSection);
      }
    }
    trackPageView();
  });
})();
