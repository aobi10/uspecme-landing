(function () {
  const sink = [];

  function track(event, payload) {
    const entry = {
      event,
      payload: payload || {},
      ts: new Date().toISOString()
    };

    sink.push(entry);
    window.__uspecTrackEvents = sink;
    if (window.console && typeof window.console.log === 'function') {
      window.console.log('[track]', entry.event, entry.payload);
    }
  }

  window.uspecTrack = track;
})();
