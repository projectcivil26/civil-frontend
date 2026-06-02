// Centralized masking utilities — used when showing sensitive destinations.

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.slice(0, Math.min(4, local.length));
  return `${visible}...${domain.split(".").pop() ? `@${domain.split(".")[0]}...${domain.split(".").slice(-1)[0]}` : domain}`;
}

export function maskPhoneIndian(phoneNumber: string): string {
  if (phoneNumber.length < 4) return phoneNumber;
  const last4 = phoneNumber.slice(-4);
  return `+91 ••••••${last4}`;
}
