export const MIN_PASSWORD_LENGTH = 8;
export const MAX_PASSWORD_LENGTH = 15;

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4; // 0 empty, 1 weak … 4 strong
  label: string;
  meetsMinimum: boolean;
}

// Lightweight heuristic — no dependency. Rewards length + variety.
export function getPasswordStrength(pw: string): PasswordStrength {
  if (!pw) return { score: 0, label: "", meetsMinimum: false };

  let points = 0;
  if (pw.length >= MIN_PASSWORD_LENGTH) points++;
  if (pw.length >= 12) points++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) points++;
  if (/\d/.test(pw)) points++;
  if (/[^A-Za-z0-9]/.test(pw)) points++;

  const meetsMinimum = pw.length >= MIN_PASSWORD_LENGTH;
  // Cap displayed score at 4; anything below the minimum length reads as weak.
  const score = (meetsMinimum ? Math.min(4, Math.max(1, points)) : 1) as PasswordStrength["score"];
  const label = !meetsMinimum ? "Too short" : ["", "Weak", "Fair", "Good", "Strong"][score];

  return { score, label, meetsMinimum };
}
