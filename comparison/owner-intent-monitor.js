(function () {
  const METRICS_STORAGE_KEY = 'uspecme_intent_metrics_v1';
  const OWNER_CODE_KEY = 'uspecme_owner_monitor_code';
  const OWNER_ACCESS_SESSION_KEY = 'uspecme_owner_monitor_access';
  const DEFAULT_OWNER_CODE = 'uSpecMeOwner';

  const DEFAULT_METRICS = {
    connect: 0,
    tryouts: 0,
    waitlist: 0,
    compareAdds: 0,
    updatedAt: null
  };

  function safeStorageGet(storage, key) {
    try {
      return storage.getItem(key);
    } catch (_err) {
      return null;
    }
  }

  function safeStorageSet(storage, key, value) {
    try {
      storage.setItem(key, value);
    } catch (_err) {
      // no-op
    }
  }

  function sanitizeMetricValue(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return 0;
    }
    return Math.floor(parsed);
  }

  function parseMetrics() {
    const raw = safeStorageGet(window.localStorage, METRICS_STORAGE_KEY);
    if (!raw) {
      return { ...DEFAULT_METRICS };
    }

    try {
      const parsed = JSON.parse(raw);
      return {
        connect: sanitizeMetricValue(parsed.connect),
        tryouts: sanitizeMetricValue(parsed.tryouts),
        waitlist: sanitizeMetricValue(parsed.waitlist),
        compareAdds: sanitizeMetricValue(parsed.compareAdds),
        updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : null
      };
    } catch (_err) {
      return { ...DEFAULT_METRICS };
    }
  }

  function formatTimestamp(value) {
    if (!value) {
      return 'No events yet';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return 'No events yet';
    }
    return date.toLocaleString();
  }

  function setText(id, value) {
    const node = document.getElementById(id);
    if (node) {
      node.textContent = String(value);
    }
  }

  function showNotice(message) {
    const notice = document.getElementById('ownerLockNotice');
    if (!notice) {
      return;
    }
    notice.textContent = message;
    notice.classList.remove('hidden');

    window.clearTimeout(showNotice._timer);
    showNotice._timer = window.setTimeout(() => {
      notice.classList.add('hidden');
    }, 2200);
  }

  function renderMetrics() {
    const metrics = parseMetrics();
    setText('metricConnect', metrics.connect);
    setText('metricTryouts', metrics.tryouts);
    setText('metricWaitlist', metrics.waitlist);
    setText('metricCompare', metrics.compareAdds);
    setText('metricsUpdatedAt', formatTimestamp(metrics.updatedAt));
  }

  function requireOwnerAccess() {
    const hasSessionAccess = safeStorageGet(window.sessionStorage, OWNER_ACCESS_SESSION_KEY) === '1';
    if (hasSessionAccess) {
      return true;
    }

    const expectedCode = safeStorageGet(window.localStorage, OWNER_CODE_KEY) || DEFAULT_OWNER_CODE;
    const enteredCode = window.prompt('Private owner page. Enter owner code:');
    if (!enteredCode || enteredCode !== expectedCode) {
      return false;
    }

    safeStorageSet(window.sessionStorage, OWNER_ACCESS_SESSION_KEY, '1');
    return true;
  }

  function resetMetrics() {
    const shouldReset = window.confirm('Reset all intent counters to zero?');
    if (!shouldReset) {
      return;
    }

    safeStorageSet(
      window.localStorage,
      METRICS_STORAGE_KEY,
      JSON.stringify({
        ...DEFAULT_METRICS,
        updatedAt: new Date().toISOString()
      })
    );
    renderMetrics();
    showNotice('Counters reset.');
  }

  function changeOwnerCode() {
    const currentCode = safeStorageGet(window.localStorage, OWNER_CODE_KEY) || DEFAULT_OWNER_CODE;
    const nextCode = window.prompt('Set new owner code:', currentCode);
    if (!nextCode || !nextCode.trim()) {
      return;
    }
    safeStorageSet(window.localStorage, OWNER_CODE_KEY, nextCode.trim());
    showNotice('Owner code updated.');
  }

  function denyAccess() {
    const panel = document.querySelector('.owner-panel');
    if (!panel) {
      return;
    }
    panel.innerHTML = [
      '<h1>Access denied</h1>',
      '<p>Owner code was invalid. Reload to try again.</p>'
    ].join('');
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!requireOwnerAccess()) {
      denyAccess();
      return;
    }

    renderMetrics();

    const refreshButton = document.getElementById('refreshMetrics');
    const resetButton = document.getElementById('resetMetrics');
    const changeCodeButton = document.getElementById('changeOwnerCode');

    if (refreshButton) {
      refreshButton.addEventListener('click', renderMetrics);
    }
    if (resetButton) {
      resetButton.addEventListener('click', resetMetrics);
    }
    if (changeCodeButton) {
      changeCodeButton.addEventListener('click', changeOwnerCode);
    }

    window.addEventListener('storage', (event) => {
      if (event.key === METRICS_STORAGE_KEY) {
        renderMetrics();
      }
    });
  });
})();
