export type TrackEventName =
  | 'view_landing'
  | 'click_cta_player'
  | 'click_cta_team'
  | 'view_explore_players'
  | 'apply_filter'
  | 'toggle_compare'
  | 'view_player_profile'
  | 'click_invite_tryout'
  | 'submit_invite_request'
  | 'open_connect_modal'
  | 'click_connect_provider'
  | 'complete_connect_fake'
  | 'submit_waitlist';

export type TrackPayload = Record<string, string | number | boolean | null | undefined>;

export function track(event: TrackEventName, payload: TrackPayload = {}): void {
  // Placeholder adapter for GA4/Mixpanel wiring in app runtime.
  // eslint-disable-next-line no-console
  console.log('[track]', event, payload);
}
