export interface CountdownConfig {
  targetDate: string; // UTC format: "2025-10-10T10:00:00Z"
  enabledPages: {
    dashboard: boolean;
    mevTracker: boolean;
    referrals: boolean;
  };
}

export const countdownConfig: CountdownConfig = {
  targetDate: "2025-10-10T10:00:00Z", // UTC format - change this to your launch date
  enabledPages: {
    dashboard: false,
    mevTracker: false,
    referrals: false
  }
};